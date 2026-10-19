"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, Mail, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { AuthAlerts } from "@/src/features/auth/components/AuthAlerts";
import { AuthInput } from "@/src/features/auth/components/AuthInput";
import { AuthShell } from "@/src/features/auth/components/AuthShell";
import { PasswordInput } from "@/src/features/auth/components/PasswordInput";
import { GoogleSignInButton } from "@/src/features/auth/components/GoogleSignInButton";
import { LoginTwoFactorSection } from "@/src/features/auth/components/LoginTwoFactorSection";
import { LoginRememberRow } from "@/src/features/auth/components/LoginRememberRow";
import { validateEmail, validatePassword, type AuthErrors } from "@/src/features/auth/validation";
import { DEFAULT_BUYER_DESTINATION, getNextPathFromLocation, withNextPath } from "@/src/lib/navigation";
import { authClient } from "@/src/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [code, setCode] = useState("");
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<AuthErrors>({});
  const [nextPath, setNextPath] = useState(DEFAULT_BUYER_DESTINATION);
  const [notices, setNotices] = useState({ verified: false, restored: false, checkout: false });

  useEffect(() => {
    if (!sessionPending && session?.user) {
      router.replace(nextPath || "/marketplace");
      return;
    }
    const destination = getNextPathFromLocation();
    setNextPath(destination);
    const params = new URLSearchParams(window.location.search);
    setNotices({
      verified: params.get("verified") === "true",
      restored: params.get("restored") === "true",
      checkout: Boolean(destination && destination !== DEFAULT_BUYER_DESTINATION),
    });
  }, [sessionPending, session, nextPath, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = Object.fromEntries(
      Object.entries({ email: validateEmail(email), password: validatePassword(password) }).filter(
        ([, val]) => val,
      ),
    ) as AuthErrors;
    if (Object.keys(nextErrors).length) return setErrors(nextErrors);
    setLoading(true);
    setErrors({});
    try {
      const { authClient } = await import("@/src/lib/auth-client");
      const cleanEmail = email.trim().toLowerCase();
      const response = await authClient.signIn.email({ email: cleanEmail, password, rememberMe });
      if ((response.data as unknown as { twoFactorRedirect?: boolean } | undefined)?.twoFactorRedirect) {
        setTwoFactorRequired(true);
        return;
      }
      if (response.error) {
        setErrors({ form: "The email or password you entered is incorrect." });
        return;
      }
      const user = response.data?.user as { emailVerified?: boolean; isActive?: boolean } | undefined;
      if (user?.isActive === false) {
        router.replace(withNextPath(`/account-recovery?email=${encodeURIComponent(cleanEmail)}&blocked=true`, nextPath));
        return;
      }
      if (!user?.emailVerified) {
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
      title={twoFactorRequired ? "Two-factor verification" : "Sign in to Agrivive"}
      description={twoFactorRequired ? "Enter the 6-digit code from your authenticator app to proceed." : "Welcome back! Enter your details to reserve fresh produce."}
      footer={
        twoFactorRequired ? (
          <button type="button" className="font-semibold text-agrivive-primary underline" onClick={() => { setTwoFactorRequired(false); setCode(""); setErrors({}); }}>
            Back to sign in
          </button>
        ) : (
          <p className="text-sm">
            Don&apos;t have an account?{" "}
            <Link href={withNextPath("/signup", nextPath)} className="inline-flex items-center gap-1 font-semibold text-agrivive-primary hover:underline">
              Sign Up now<UserPlus aria-hidden="true" className="size-3.5" />
            </Link>
          </p>
        )
      }
    >
      <AuthAlerts
        verifiedNotice={notices.verified}
        restoredNotice={notices.restored}
        checkoutNotice={notices.checkout}
        formError={errors.form}
      />

      <form onSubmit={twoFactorRequired ? handleTwoFactor : handleSubmit} aria-busy={loading} className="space-y-4">
        <FieldGroup>
          {twoFactorRequired ? (
            <LoginTwoFactorSection
              code={code}
              onChangeCode={(nextCode) => {
                setCode(nextCode);
                if (errors.code) setErrors((prev) => ({ ...prev, code: undefined }));
              }}
              error={errors.code}
            />
          ) : (
            <>
              <AuthInput
                id="email"
                label="Email"
                type="email"
                icon={<Mail className="size-4" />}
                autoComplete="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email || errors.form) setErrors((prev) => ({ ...prev, email: undefined, form: undefined }));
                }}
                error={errors.email}
              />
              <PasswordInput
                id="password"
                label="Password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password || errors.form) setErrors((prev) => ({ ...prev, password: undefined, form: undefined }));
                }}
                error={errors.password}
              />
              <LoginRememberRow
                rememberMe={rememberMe}
                onRememberMeChange={setRememberMe}
                nextPath={nextPath}
              />
            </>
          )}

          <Button type="submit" disabled={loading} className="mt-2 min-h-12 w-full font-semibold">
            {loading ? <Spinner data-icon="inline-start" /> : <LogIn data-icon="inline-start" />}
            {twoFactorRequired ? "Verify and continue" : "Sign In"}
          </Button>
        </FieldGroup>
      </form>

      {!twoFactorRequired && (
        <>
          <div className="my-5 flex items-center gap-3 text-xs text-agrivive-muted">
            <span className="h-px flex-1 bg-agrivive-border" />
            <span>Or login with</span>
            <span className="h-px flex-1 bg-agrivive-border" />
          </div>
          <GoogleSignInButton nextPath={nextPath} />
        </>
      )}
    </AuthShell>
  );
}
