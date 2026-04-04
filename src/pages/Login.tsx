
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { signInWithEmail } from "@/services/authService";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, MailCheck } from "lucide-react";

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail]                     = useState("");
  const [password, setPassword]               = useState("");
  const [loading, setLoading]                 = useState(false);
  const [showResend, setShowResend]           = useState(false);
  const [resendLoading, setResendLoading]     = useState(false);
  const [resendSent, setResendSent]           = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Missing information",
        description: "Please enter your email and password.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setShowResend(false);

    try {
      const response = await signInWithEmail(email, password);

      if (!response.success) {
        // Detect unconfirmed email — Supabase returns this exact message
        const isUnconfirmed =
          response.message?.toLowerCase().includes("email not confirmed") ||
          response.message?.toLowerCase().includes("email link is invalid or has expired");

        if (isUnconfirmed) {
          setShowResend(true);
          toast({
            title: "Email not confirmed",
            description: "Please verify your email address before logging in.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Login failed",
            description: response.message,
            variant: "destructive",
          });
        }
        setLoading(false);
        return;
      }

      toast({
        title: "Login successful",
        description: "Welcome back!",
      });

      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address above first.",
        variant: "destructive",
      });
      return;
    }

    setResendLoading(true);

    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });

    setResendLoading(false);

    if (error) {
      toast({
        title: "Could not resend",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setResendSent(true);
      toast({
        title: "Confirmation email sent",
        description: `A new confirmation link has been sent to ${email}.`,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login to TCOA Camp Management</CardTitle>
          <CardDescription>Enter your credentials to continue</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setShowResend(false);
                  setResendSent(false);
                }}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>

          {/* Resend confirmation banner — shown only after unconfirmed-email error */}
          {showResend && (
            <div className="rounded-md border border-yellow-300 bg-yellow-50 p-4 space-y-2">
              <div className="flex items-center gap-2 text-yellow-800 font-medium text-sm">
                <MailCheck className="h-4 w-4 shrink-0" />
                Your email address has not been confirmed yet.
              </div>
              <p className="text-xs text-yellow-700">
                Check your inbox (and spam folder) for the confirmation link we sent
                when you registered. Need a new one?
              </p>
              {resendSent ? (
                <p className="text-xs font-medium text-green-700">
                  ✓ Confirmation email sent — please check your inbox.
                </p>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-yellow-400 text-yellow-800 hover:bg-yellow-100"
                  onClick={handleResendConfirmation}
                  disabled={resendLoading}
                >
                  {resendLoading ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Resend confirmation email"
                  )}
                </Button>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            variant="link"
            className="px-0"
            onClick={() => navigate("/register")}
            disabled={loading}
          >
            Don't have an account? Register
          </Button>
          <Button variant="link" className="px-0" disabled={loading}>
            Forgot password?
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
