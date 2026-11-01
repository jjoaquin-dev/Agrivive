"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, MailCheck, RefreshCw, ShieldCheck } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { AuthInput } from "@/src/features/auth/components/AuthInput";
import { AuthShell } from "@/src/features/auth/components/AuthShell";
import { OtpCodeInput } from "@/src/features/auth/components/OtpCodeInput";
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
    if (!/^\d{6}$/.test(otp.trim())) return setError("Enter the 6-digit recovery code from your email.");
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
      centered
      title="Restore account access"
      description="Verify your email to restore an account limited by the trust policy."
      footer={
        <Link
          href={withNextPath("/login", nextPath)}
          className="inline-flex items-center gap-1.5 font-semibold text-[#457D00] underline-offset-4 hover:underline"
        >
          <ArrowLeft aria-hidden="true" size={15} />Back to sign in
        </Link>
      }
    >
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
            className={sent ? "bg-[#EEF2FF] border-indigo-100/90 text-[#14231A]" : ""}
          />
          {sent ? (
            <div className="space-y-2">
              <label
                htmlFor="recovery-otp"
                className="block text-xs font-semibold uppercase tracking-wider text-[#14231A]/85 text-center"
              >
                Recovery code
              </label>
              <OtpCodeInput
                id="recovery-otp"
                value={otp}
                onChange={(val) => {
                  setOtp(val);
                  setError("");
                }}
                length={6}
                error={Boolean(error && !otp)}
              />
            </div>
          ) : null}
          <Button
            type="submit"
            disabled={loading || resending}
            className="h-12 w-full rounded-xl bg-[#457D00] font-semibold text-white shadow-sm hover:bg-[#457D00]/90 active:scale-[0.99] transition-all"
          >
            {loading ? (
              <><Spinner data-icon="inline-start" />Restoring access…</>
            ) : resending ? (
              <><Spinner data-icon="inline-start" />Sending code…</>
            ) : sent ? (
              <><ShieldCheck data-icon="inline-start" />Restore access</>
            ) : (
              <><MailCheck data-icon="inline-start" />Send recovery code</>
            )}
          </Button>
          {sent ? (
            <Button
              type="button"
              disabled={resending || loading || cooldown > 0}
              onClick={() => void requestCode()}
              className="h-12 w-full rounded-xl border border-agrivive-border/80 bg-[#F6F4EE] font-semibold text-[#14231A] shadow-sm hover:bg-[#ECE8DF] active:scale-[0.99] transition-all"
            >
              <RefreshCw data-icon="inline-start" />{cooldown > 0 ? `Send again in ${cooldown}s` : "Send a new code"}
            </Button>
          ) : null}
        </FieldGroup>
      </form>
    </AuthShell>
  );
}
