"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, Mail, ShieldCheck, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { AuthAlerts } from "@/src/features/auth/components/AuthAlerts";
import { AuthInput } from "@/src/features/auth/components/AuthInput";
import { AuthShell } from "@/src/features/auth/components/AuthShell";
import { PasswordInput } from "@/src/features/auth/components/PasswordInput";
import { validateEmail, validatePassword, type AuthErrors } from "@/src/features/auth/validation";
import { DEFAULT_BUYER_DESTINATION, getNextPathFromLocation, withNextPath } from "@/src/lib/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<AuthErrors>({});
  const [nextPath, setNextPath] = useState(DEFAULT_BUYER_DESTINATION);
  const [verifiedNotice, setVerifiedNotice] = useState(false);
  const [checkoutNotice, setCheckoutNotice] = useState(false);

  useEffect(() => {
    const destination = getNextPathFromLocation();
    setNextPath(destination);
    const params = new URLSearchParams(window.location.search);
    if (params.get("verified") === "true") setVerifiedNotice(true);
    if (destination && destination !== DEFAULT_BUYER_DESTINATION) setCheckoutNotice(true);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = Object.fromEntries(
      Object.entries({ email: validateEmail(email), password: validatePassword(password) }).filter(
        ([, value]) => value,
      ),
    ) as AuthErrors;
    if (Object.keys(nextErrors).length) return setErrors(nextErrors);
    setLoading(true);
    setErrors({});
    try {
      const { authClient } = await import("@/src/lib/auth-client");
      const cleanEmail = email.trim().toLowerCase();
      const response = await authClient.signIn.email({ email: cleanEmail, password });
      if ((response.data as unknown as { twoFactorRedirect?: boolean } | undefined)?.twoFactorRedirect) {
        setTwoFactorRequired(true);
        return;
      }
      if (response.error) {
        setErrors({ form: "The email or password you entered is incorrect." });
        return;
      }
      if (!response.data?.user?.emailVerified) {
        await authClient.emailOtp.sendVerificationOtp({ email: cleanEmail, type: "email-verification" });
        router.replace(withNextPath(`/verify-email?email=${encodeURIComponent(cleanEmail)}`, nextPath));
        return;
      }
      router.replace(nextPath);
    } catch {
      setErrors({ form: "We could not connect. Check your connection and try again." });
    } finally {
      setLoading(false);
    }
  }

  async function handleTwoFactor(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!code.trim()) return setErrors({ code: "Enter your authenticator code." });
    setLoading(true);
    setErrors({});
    try {
      const { authClient } = await import("@/src/lib/auth-client");
      const response = await authClient.twoFactor.verifyTotp({ code: code.trim() });
      if (response.error) return setErrors({ code: "That code is invalid or expired." });
      router.replace(nextPath);
    } catch {
      setErrors({ form: "We could not verify the code. Try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title={twoFactorRequired ? "Two-factor verification" : "Welcome back"}
      description={
        twoFactorRequired
          ? "Enter the 6-digit code from your authenticator app to proceed."
          : "Sign in to reserve fresh surplus vegetables."
      }
      footer={
        twoFactorRequired ? (
          <button
            type="button"
            className="font-semibold text-agrivive-primary underline"
            onClick={() => {
              setTwoFactorRequired(false);
              setCode("");
              setErrors({});
            }}
          >
            Back to sign in
          </button>
        ) : (
          <>
            New to Agrivive?{" "}
            <Link
              href={withNextPath("/signup", nextPath)}
              className="inline-flex items-center gap-1 font-semibold text-agrivive-primary hover:underline"
            >
              Create an account
              <UserPlus aria-hidden="true" className="size-4" />
            </Link>
          </>
        )
      }
    >
      <AuthAlerts
        verifiedNotice={verifiedNotice}
        checkoutNotice={checkoutNotice}
        formError={errors.form}
      />

      <form onSubmit={twoFactorRequired ? handleTwoFactor : handleSubmit} aria-busy={loading}>
        <FieldGroup>
          {twoFactorRequired ? (
            <AuthInput
              id="code"
              label="Authenticator code"
              icon={<ShieldCheck className="size-4" />}
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="000000"
              maxLength={6}
              className="text-center font-mono text-xl tracking-[0.25em]"
              value={code}
              onChange={(event) => {
                setCode(event.target.value.replace(/\D/g, ""));
                if (errors.code) setErrors((prev) => ({ ...prev, code: undefined }));
              }}
              error={errors.code}
            />
          ) : (
            <>
              <AuthInput
                id="email"
                label="Email address"
                type="email"
                icon={<Mail className="size-4" />}
                autoComplete="email"
                placeholder="buyer@example.com"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (errors.email || errors.form) {
                    setErrors((prev) => ({ ...prev, email: undefined, form: undefined }));
                  }
                }}
                error={errors.email}
              />
              <PasswordInput
                id="password"
                label="Password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  if (errors.password || errors.form) {
                    setErrors((prev) => ({ ...prev, password: undefined, form: undefined }));
                  }
                }}
                error={errors.password}
              />
            </>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <><Spinner data-icon="inline-start" />Please wait…</>
            ) : twoFactorRequired ? (
              <><ShieldCheck data-icon="inline-start" />Verify and continue</>
            ) : (
              <><LogIn data-icon="inline-start" />Sign in</>
            )}
          </Button>
        </FieldGroup>
      </form>
    </AuthShell>
  );
}
