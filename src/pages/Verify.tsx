
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabaseAdmin } from "@/integrations/supabase/serviceClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

type VerifyState = "loading" | "success" | "already_verified" | "error";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [state, setState]           = useState<VerifyState>("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setErrorMessage("No verification token found in this link.");
      setState("error");
      return;
    }

    const verify = async () => {
      try {
        // Find the profile matching this token using service role (bypasses RLS)
        const { data: profile, error: findError } = await supabaseAdmin
          .from("profiles")
          .select("id, email_verified")
          .eq("verification_token", token)
          .single();

        if (findError || !profile) {
          setErrorMessage("This verification link is invalid or has already been used.");
          setState("error");
          return;
        }

        // Idempotent — already verified
        if (profile.email_verified) {
          setState("already_verified");
          return;
        }

        // Mark verified and clear the token so the link can't be reused
        const { error: updateError } = await supabaseAdmin
          .from("profiles")
          .update({ email_verified: true, verification_token: null })
          .eq("id", profile.id);

        if (updateError) {
          setErrorMessage("Failed to verify your email address. Please try again.");
          setState("error");
          return;
        }

        setState("success");
      } catch (err: any) {
        setErrorMessage("An unexpected error occurred. Please try again.");
        setState("error");
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">

          {state === "loading" && (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
              <CardDescription>Verifying your email address…</CardDescription>
            </>
          )}

          {state === "success" && (
            <>
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
              <div className="space-y-1">
                <p className="font-semibold text-green-700">Your email has been verified!</p>
                <CardDescription>Your account is now active. You can log in below.</CardDescription>
              </div>
              <Button className="w-full" onClick={() => navigate("/login")}>
                Go to Login
              </Button>
            </>
          )}

          {state === "already_verified" && (
            <>
              <CheckCircle2 className="h-12 w-12 text-blue-500 mx-auto" />
              <div className="space-y-1">
                <p className="font-semibold text-blue-700">Already verified</p>
                <CardDescription>Your email address has already been confirmed.</CardDescription>
              </div>
              <Button className="w-full" onClick={() => navigate("/login")}>
                Go to Login
              </Button>
            </>
          )}

          {state === "error" && (
            <>
              <XCircle className="h-12 w-12 text-red-500 mx-auto" />
              <div className="space-y-1">
                <p className="font-semibold text-red-700">Verification failed</p>
                <CardDescription>{errorMessage}</CardDescription>
              </div>
              <Button variant="outline" className="w-full" onClick={() => navigate("/login")}>
                Back to Login
              </Button>
            </>
          )}

        </CardContent>
      </Card>
    </div>
  );
};

export default Verify;
