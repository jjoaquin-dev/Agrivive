"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthInput } from "@/src/features/auth/components/AuthInput";
import { AuthShell } from "@/src/features/auth/components/AuthShell";
import { OtpCodeInput } from "@/src/features/auth/components/OtpCodeInput";
import { authClient } from "@/src/lib/auth-client";
import { DEFAULT_BUYER_DESTINATION, sanitizeNextPath, withNextPath } from "@/src/lib/navigation";
import { ArrowLeft, Mail, MailCheck, RefreshCw, ShieldCheck } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [nextPath, setNextPath] = useState(DEFAULT_BUYER_DESTINATION);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setEmail(params.get("email")?.trim().toLowerCase() ?? "");
    setNextPath(sanitizeNextPath(params.get("next")));
    if (params.get("sent") === "true") {
      setMessage("A 6-digit verification code was sent to your email.");
      setCooldown(30);
    }
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((current) => current - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  async function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email) return setError("Return to sign up or sign in so we know which email to verify.");
    if (!/^\d{6}$/.test(otp.trim())) return setError("Enter the 6-digit verification code.");
    setLoading(true);
    setError("");
    try {
      const response = await authClient.emailOtp.verifyEmail({ email, otp: otp.trim() });
      if (response.error) return setError(response.error.message || "That code is invalid or expired.");
      router.replace(withNextPath("/login?verified=true", nextPath));
    } catch {
      setError("We could not verify the code. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!email) return setError("Return to sign up or sign in so we know which email to verify.");
    if (cooldown > 0) return;
    setResending(true);
    setError("");
    try {
      const response = await authClient.emailOtp.sendVerificationOtp({ email, type: "email-verification" });
      if (response.error) return setError(response.error.message || "Could not send a new code.");
      setMessage("A fresh verification code was sent to your inbox.");
      setCooldown(30);
    } catch {
      setError("We could not send a new code. Check your connection and try again.");
    } finally {
      setResending(false);
    }
  }

  return (
    <AuthShell
      centered
      title="Verify your email"
      description={email ? `Enter the 6-digit code sent to ${email}.` : "Enter the verification code sent to your email."}
      footer={
        <Link
          href={withNextPath("/login", nextPath)}
          className="inline-flex items-center gap-1.5 font-semibold text-[#457D00] underline-offset-4 hover:underline"
        >
          <ArrowLeft aria-hidden="true" size={15} />
          Back to sign in
        </Link>
      }
    >
      <form onSubmit={handleVerify} aria-busy={loading || resending}>
        {message ? (
          <Alert className="mb-5 border-[#457D00]/20 bg-[#F7FAF2] text-[#457D00] rounded-2xl p-4">
            <MailCheck aria-hidden="true" className="size-4 text-[#457D00]" />
            <AlertDescription className="text-sm font-medium">{message}</AlertDescription>
          </Alert>
        ) : null}

        {error ? (
          <Alert variant="destructive" className="mb-5">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <FieldGroup>
          <AuthInput
            id="email"
            label="Email address"
            type="email"
            icon={<Mail className="size-4" />}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="bg-[#EEF2FF] border-indigo-100/90 text-[#14231A]"
          />

          <div className="space-y-2">
            <label
              htmlFor="verification-otp"
              className="block text-xs font-semibold uppercase tracking-wider text-[#14231A]/85 text-center"
            >
              6-digit verification code
            </label>
            <OtpCodeInput
              id="verification-otp"
              value={otp}
              onChange={(val) => {
                setOtp(val);
                if (error) setError("");
              }}
              length={6}
              error={Boolean(error && !otp)}
            />
          </div>

          <Button
            type="submit"
            disabled={loading || resending}
            className="h-12 w-full rounded-xl bg-[#457D00] font-semibold text-white shadow-sm hover:bg-[#457D00]/90 active:scale-[0.99] transition-all"
          >
            {loading ? (
              <>
                <Spinner data-icon="inline-start" />
                Verifying...
              </>
            ) : (
              <>
                <ShieldCheck data-icon="inline-start" />
                Verify email
              </>
            )}
          </Button>

          <Button
            type="button"
            disabled={resending || loading || cooldown > 0}
            onClick={handleResend}
            className="h-12 w-full rounded-xl border border-agrivive-border/80 bg-[#F6F4EE] font-semibold text-[#14231A] shadow-sm hover:bg-[#ECE8DF] active:scale-[0.99] transition-all"
          >
            {resending ? (
              <>
                <Spinner data-icon="inline-start" />
                Sending fresh code...
              </>
            ) : cooldown > 0 ? (
              `Resend code in ${cooldown}s`
            ) : (
              <>
                <RefreshCw data-icon="inline-start" />
                Send a new code
              </>
            )}
          </Button>
        </FieldGroup>
      </form>
    </AuthShell>
  );
}
