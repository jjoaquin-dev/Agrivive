"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, KeyRound, Mail, MailCheck, RefreshCw, ShieldCheck } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { AuthInput } from "@/src/features/auth/components/AuthInput";
import { AuthShell } from "@/src/features/auth/components/AuthShell";
import { DEFAULT_BUYER_DESTINATION, sanitizeNextPath, withNextPath } from "@/src/lib/navigation";
import { ApiError } from "@/src/lib/api";
import { requestTrustRecovery, verifyTrustRecovery } from "@/src/features/trust/api/recovery";

export default function AccountRecoveryPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [nextPath, setNextPath] = useState(DEFAULT_BUYER_DESTINATION);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setEmail(params.get("email")?.trim().toLowerCase() ?? "");
    setNextPath(sanitizeNextPath(params.get("next")));
    if (params.get("blocked") === "true") {
      setMessage("If this email belongs to an account with a trust restriction, we will send a recovery code.");
    }
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => setCooldown((current) => current - 1), 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  async function requestCode() {
    if (!email.trim()) return setError("Enter the email used for your Agrivive account.");
    setResending(true);
    setError("");
    try {
      await requestTrustRecovery(email);
      setSent(true);
      setMessage("If this email belongs to a restricted account, a recovery code was sent.");
      setCooldown(30);
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : "We could not request a recovery code.");
    } finally {
      setResending(false);
    }
  }

  async function handleRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await requestCode();
  }

  async function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return setError("Enter the email used for your Agrivive account.");
    if (!/^\d{4,12}$/.test(otp.trim())) return setError("Enter the recovery code from your email.");
    setLoading(true);
    setError("");
    try {
      await verifyTrustRecovery(email, otp);
      router.replace(withNextPath("/login?restored=true", nextPath));
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : "We could not verify the recovery code.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Restore account access"
      description="Verify your email to restore an account limited by the trust policy."
      footer={
        <Link href={withNextPath("/login", nextPath)} className="inline-flex items-center gap-1 font-semibold text-agrivive-primary underline-offset-4 hover:underline">
          <ArrowLeft aria-hidden="true" size={15} />Back to sign in
        </Link>
      }
    >
      {message ? (
        <Alert className="mb-5 border-emerald-200 bg-emerald-50 text-emerald-800">
          <MailCheck aria-hidden="true" className="size-4 text-emerald-600" />
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      ) : null}
      {error ? <Alert variant="destructive" className="mb-5"><AlertDescription>{error}</AlertDescription></Alert> : null}

      <form onSubmit={sent ? handleVerify : handleRequest} aria-busy={loading || resending}>
        <FieldGroup>
          <AuthInput
            id="recovery-email"
            label="Email address"
            type="email"
            icon={<Mail className="size-4" />}
            autoComplete="email"
            placeholder="buyer@example.com"
            value={email}
            onChange={(event) => { setEmail(event.target.value); setError(""); }}
          />
          {sent ? (
            <AuthInput
              id="recovery-otp"
              label="Recovery code"
              icon={<KeyRound className="size-4" />}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={12}
              placeholder="Enter your code"
              className="text-center font-mono text-xl tracking-[0.2em]"
              value={otp}
              onChange={(event) => { setOtp(event.target.value.replace(/\D/g, "")); setError(""); }}
            />
          ) : null}
          <Button type="submit" disabled={loading || resending} className="w-full">
            {loading ? <><Spinner data-icon="inline-start" />Restoring access…</> : resending ? <><Spinner data-icon="inline-start" />Sending code…</> : sent ? <><ShieldCheck data-icon="inline-start" />Restore access</> : <><MailCheck data-icon="inline-start" />Send recovery code</>}
          </Button>
          {sent ? (
            <Button type="button" variant="outline" disabled={resending || loading || cooldown > 0} onClick={() => void requestCode()} className="w-full">
              <RefreshCw data-icon="inline-start" />{cooldown > 0 ? `Send again in ${cooldown}s` : "Send a new code"}
            </Button>
          ) : null}
        </FieldGroup>
      </form>
    </AuthShell>
  );
}
