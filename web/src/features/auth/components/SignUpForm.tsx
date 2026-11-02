"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, User, UserPlus } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { AuthInput } from "./AuthInput";
import { PasswordInput } from "./PasswordInput";
import { PasswordChecklist } from "./PasswordChecklist";
import { GoogleSignInButton } from "./GoogleSignInButton";
import { validateSignUp, type AuthErrors } from "../validation";
import { checkEmailPreflight, registerBuyerRole } from "../api/signup";
import { withNextPath } from "@/src/lib/navigation";
import { authClient } from "@/src/lib/auth-client";
import { recaptchaHeaders } from "@/src/lib/recaptcha";
import { SignUpTermsCheckbox } from "./SignUpTermsCheckbox";

export function SignUpForm({ nextPath }: { nextPath: string }) {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [accountNotice, setAccountNotice] = useState<string | null>(null);
  const [errors, setErrors] = useState<AuthErrors>({});

  useEffect(() => {
    if (!sessionPending && session?.user) router.replace(nextPath || "/marketplace");
  }, [sessionPending, session, nextPath, router]);

  async function handleEmailBlur() {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) return;
    const check = await checkEmailPreflight(cleanEmail);
    if (!check) return;

    if (check.roleCount >= 2) {
      setErrors((p) => ({ ...p, email: "This email has both Buyer and Seller profiles. Please sign in." }));
      setAccountNotice(null);
    } else if (check.hasTargetRole) {
      setErrors((p) => ({ ...p, email: "An account with this email is already a Buyer. Please sign in." }));
      setAccountNotice(null);
    } else if (check.exists && check.canUseEmail) {
      setErrors((p) => ({ ...p, email: undefined }));
      setAccountNotice("Existing Seller account found. Enter password to link Buyer profile.");
    } else {
      setErrors((p) => ({ ...p, email: undefined }));
      setAccountNotice(null);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateSignUp({ name, email, password, confirmPassword, acceptedTerms });
    if (Object.keys(nextErrors).length) return setErrors(nextErrors);
    setLoading(true);
    setErrors({});
    const cleanEmail = email.trim().toLowerCase();

    try {
      const check = await checkEmailPreflight(cleanEmail);
      if (!check) return setErrors({ form: "Could not connect to verify email. Try again." });
      if (check.roleCount >= 2) return setErrors({ email: "This email reached the maximum 2 roles. Please sign in." });
      if (check.hasTargetRole) return setErrors({ email: "Already registered as Buyer. Please sign in." });

      await registerBuyerRole({ email: cleanEmail, password, name: name.trim() });
      if (check.exists && check.canUseEmail) {
        await authClient.signIn.email({ email: cleanEmail, password }, { headers: await recaptchaHeaders("sign_in") });
        router.replace(nextPath);
        return;
      }
      router.replace(withNextPath(`/verify-email?email=${encodeURIComponent(cleanEmail)}&sent=true`, nextPath));
    } catch (err: unknown) {
      const msg = (err as Error)?.message || "";
      if (msg.toLowerCase().includes("password")) {
        setErrors({ password: "Incorrect password for existing account." });
      } else {
        setErrors({ form: msg || "Failed to register account. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="space-y-4">
        <GoogleSignInButton nextPath={nextPath} />
        <div className="flex items-center gap-3 text-xs font-medium text-agrivive-muted">
          <span className="h-px flex-1 bg-agrivive-border/80" />
          <span className="text-xs font-semibold uppercase tracking-wider text-agrivive-muted/80">or create with email</span>
          <span className="h-px flex-1 bg-agrivive-border/80" />
        </div>
      </div>

      {errors.form && (
        <Alert variant="destructive" className="mt-4"><AlertDescription>{errors.form}</AlertDescription></Alert>
      )}
      {accountNotice && (
        <Alert className="mt-4 border-agrivive-primary/30 bg-agrivive-primary/5 text-agrivive-primary"><AlertDescription>{accountNotice}</AlertDescription></Alert>
      )}

      <form onSubmit={handleSubmit} aria-busy={loading} className="mt-4 space-y-4">
        {/* Full name (full horizontal width) */}
        <AuthInput
          id="name"
          label="Full name"
          icon={<User className="size-4" />}
          autoComplete="name"
          placeholder="e.g. Maria Santos"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name || errors.form) setErrors((p) => ({ ...p, name: undefined, form: undefined }));
          }}
          error={errors.name}
        />

        {/* Email address (full horizontal width) */}
        <AuthInput
          id="email"
          label="Email address"
          type="email"
          icon={<Mail className="size-4" />}
          autoComplete="email"
          placeholder="maria@example.com"
          value={email}
          onBlur={handleEmailBlur}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email || errors.form) setErrors((p) => ({ ...p, email: undefined, form: undefined }));
            if (accountNotice) setAccountNotice(null);
          }}
          error={errors.email}
        />

        {/* Password (full horizontal width) */}
        <PasswordInput
          id="password"
          label="Password"
          autoComplete="new-password"
          placeholder="Create password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password || errors.form) setErrors((p) => ({ ...p, password: undefined, form: undefined }));
          }}
          error={errors.password}
        />

        {/* Confirm password (full horizontal width) */}
        <PasswordInput
          id="confirm-password"
          label="Confirm password"
          autoComplete="new-password"
          placeholder="Re-enter password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (errors.confirmPassword || errors.form) setErrors((p) => ({ ...p, confirmPassword: undefined, form: undefined }));
          }}
          error={errors.confirmPassword}
        />

        {/* 5-Rule Password Strength Bar & Checklist */}
        <PasswordChecklist password={password} confirmPassword={confirmPassword} />

        <SignUpTermsCheckbox
          checked={acceptedTerms}
          error={errors.terms}
          onChange={(checked) => {
            setAcceptedTerms(checked);
            if (errors.terms) setErrors((p) => ({ ...p, terms: undefined }));
          }}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#457D00] text-sm font-semibold text-white shadow-md transition-all duration-150 hover:bg-[#457D00]/90 hover:shadow-lg active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-agrivive-primary/30"
        >
          {loading ? (
            <>
              <Spinner data-icon="inline-start" />
              <span>Creating account…</span>
            </>
          ) : (
            <>
              <UserPlus className="size-4" />
              <span>{accountNotice ? "Add Buyer Profile" : "Create account"}</span>
            </>
          )}
        </Button>
      </form>
    </>
  );
}
