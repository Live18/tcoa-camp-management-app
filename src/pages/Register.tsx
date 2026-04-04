
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { signUpWithEmail } from "@/services/authService";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

const HCAPTCHA_SITE_KEY = import.meta.env.VITE_HCAPTCHA_SITE_KEY as string;

// Password strength helpers
interface PasswordRule {
  label: string;
  test: (pw: string) => boolean;
}

const PASSWORD_RULES: PasswordRule[] = [
  { label: "At least 8 characters",        test: (pw) => pw.length >= 8 },
  { label: "One uppercase letter (A–Z)",   test: (pw) => /[A-Z]/.test(pw) },
  { label: "One number (0–9)",             test: (pw) => /[0-9]/.test(pw) },
  { label: "One special character (!@#…)", test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];

const getStrengthScore = (pw: string): number =>
  PASSWORD_RULES.filter((r) => r.test(pw)).length;

const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
const strengthColor = ["", "bg-red-500", "bg-orange-400", "bg-yellow-400", "bg-green-500"];

const Register = () => {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);
  const captchaRef = useRef<HCaptcha>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const score = getStrengthScore(password);
  const passwordValid = score === PASSWORD_RULES.length;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!passwordValid) {
      toast({
        title: "Password too weak",
        description: "Please meet all password requirements before continuing.",
        variant: "destructive",
      });
      return;
    }

    if (!captchaToken) {
      toast({
        title: "CAPTCHA required",
        description: "Please complete the CAPTCHA verification.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const response = await signUpWithEmail(email, password, { name });

    setLoading(false);

    // Reset captcha regardless of outcome
    captchaRef.current?.resetCaptcha();
    setCaptchaToken(null);

    if (!response.success) {
      toast({
        title: "Registration failed",
        description: response.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Account created!",
      description: "Check your email for a confirmation link before logging in.",
    });

    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>
            Create an account to join the basketball camp
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">

            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {/* Password */}
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

              {/* Strength bar — only shown once the user starts typing */}
              {password.length > 0 && (
                <div className="space-y-2 pt-1">
                  <div className="flex gap-1 h-1.5">
                    {PASSWORD_RULES.map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-full transition-colors duration-300 ${
                          i < score ? strengthColor[score] : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs font-medium ${
                    score === 4 ? "text-green-600" :
                    score === 3 ? "text-yellow-600" :
                    score === 2 ? "text-orange-500" : "text-red-500"
                  }`}>
                    {strengthLabel[score]}
                  </p>

                  {/* Rule checklist */}
                  <ul className="space-y-1">
                    {PASSWORD_RULES.map((rule) => {
                      const passed = rule.test(password);
                      return (
                        <li key={rule.label} className="flex items-center gap-1.5 text-xs">
                          {passed
                            ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                            : <XCircle    className="h-3.5 w-3.5 text-gray-300 shrink-0" />
                          }
                          <span className={passed ? "text-green-700" : "text-gray-500"}>
                            {rule.label}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            {/* hCaptcha */}
            <div className="flex justify-center pt-1">
              <HCaptcha
                ref={captchaRef}
                sitekey={HCAPTCHA_SITE_KEY}
                onVerify={(token) => setCaptchaToken(token)}
                onExpire={() => setCaptchaToken(null)}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !passwordValid || !captchaToken}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" onClick={() => navigate("/login")} disabled={loading}>
            Already have an account? Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
