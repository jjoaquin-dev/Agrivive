"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthInput } from "@/src/features/auth/components/AuthInput";
import { AuthShell } from "@/src/features/auth/components/AuthShell";
import { PasswordChecklist } from "@/src/features/auth/components/PasswordChecklist";
import { PasswordInput } from "@/src/features/auth/components/PasswordInput";
import { GoogleSignInButton } from "@/src/features/auth/components/GoogleSignInButton";
import { validateSignUp, type AuthErrors } from "@/src/features/auth/validation";
import { authClient } from "@/src/lib/auth-client";
import { apiRequest } from "@/src/lib/api";

import { DEFAULT_BUYER_DESTINATION, getNextPathFromLocation, withNextPath } from "@/src/lib/navigation";
import { LogIn, Mail, User, UserPlus } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";

interface EmailCheckResult {
  exists: boolean;
  roleCount: number;
  currentRoles: string[];
  canUseEmail: boolean;
  hasTargetRole: boolean;
  message: string;
}

export default function SignUpPage() {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [accountNotice, setAccountNotice] = useState<string | null>(null);
  const [errors, setErrors] = useState<AuthErrors>({});
  const [nextPath, setNextPath] = useState(DEFAULT_BUYER_DESTINATION);

  useEffect(() => {
    if (!sessionPending && session?.user) {
      router.replace(nextPath || "/marketplace");
      return;
    }
    setNextPath(getNextPathFromLocation());
  }, [sessionPending, session, nextPath, router]);

  async function checkEmailPreflight(cleanEmail: string): Promise<EmailCheckResult | null> {
    try {
      return await apiRequest<EmailCheckResult>("/auth/check-email", {
        method: "POST",
        body: JSON.stringify({ email: cleanEmail, targetRole: "buyer" }),
      });
    } catch {
      return null;
    }
  }

  async function handleEmailBlur() {
    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) return;

    const check = await checkEmailPreflight(cleanEmail);
    if (!check) return;

    if (check.roleCount >= 2) {
      setErrors((prev) => ({
        ...prev,
        email: "This email already has both Buyer and Seller profiles (maximum 2 roles reached). Please sign in instead.",
      }));
      setAccountNotice(null);
    } else if (check.hasTargetRole) {
      setErrors((prev) => ({
        ...prev,
        email: "An account with this email is already registered as a Buyer. Please sign in instead.",
      }));
      setAccountNotice(null);
    } else if (check.exists && check.canUseEmail) {
      setErrors((prev) => ({ ...prev, email: undefined }));
      setAccountNotice("Existing Seller account found. Enter your password to add the Buyer profile.");
    } else {
      setErrors((prev) => ({ ...prev, email: undefined }));
      setAccountNotice(null);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateSignUp({ name, email, password, confirmPassword });
    if (Object.keys(nextErrors).length) return setErrors(nextErrors);
    setLoading(true);
    setErrors({});
    const cleanEmail = email.trim().toLowerCase();

    try {
      // 1. Mandatory Preflight Duplicate Filtering
      const check = await checkEmailPreflight(cleanEmail);

      if (!check) {
        setErrors({ form: "Could not connect to verify your email. Please try again." });
        setLoading(false);
        return;
      }

      // Max 2 roles rule: if 2 roles already exist, email cannot be used
      if (check.roleCount >= 2) {
        setErrors({
          email: "This email already has both Buyer and Seller profiles (maximum 2 roles reached). Please sign in instead.",
        });
        setLoading(false);
        return; // HARD STOP: Never redirect!
      }

      // If already a Buyer: cannot register duplicate Buyer role
      if (check.hasTargetRole) {
        setErrors({
          email: "An account with this email is already registered as a Buyer. Please sign in instead.",
        });
        setLoading(false);
        return; // HARD STOP: Never redirect!
      }

      // If account has 1 role (e.g. Seller): expand role using account password
      if (check.exists && check.canUseEmail) {
        try {
          await apiRequest<any>("/auth/register-role", {
            method: "POST",
            body: JSON.stringify({
              email: cleanEmail,
              password,
              name: name.trim(),
              targetRole: "buyer",
            }),
          });

          await authClient.signIn.email({
            email: cleanEmail,
            password,
          });

          router.replace(nextPath);
          return;
        } catch (expandErr: any) {
          const errMsg = expandErr?.message || "";
          if (errMsg.toLowerCase().includes("password") || expandErr?.statusCode === 401) {
            setErrors({
              password: "Incorrect password for your existing account. Enter your password to add the Buyer profile.",
            });
          } else {
            setErrors({
              form: errMsg || "Failed to link Buyer profile to your account.",
            });
          }
          setLoading(false);
          return; // HARD STOP: Never redirect!
        }
      }

      // Brand new account (0 roles): register with targetRole buyer and verify OTP
      try {
        await apiRequest<any>("/auth/register-role", {
          method: "POST",
          body: JSON.stringify({
            email: cleanEmail,
            password,
            name: name.trim(),
            targetRole: "buyer",
          }),
        });

        router.replace(withNextPath(`/verify-email?email=${encodeURIComponent(cleanEmail)}&sent=true`, nextPath));
      } catch (regErr: any) {
        setErrors({
          form: regErr?.message || "Failed to register account. Please try again.",
        });
        setLoading(false);
        return;
      }
    } catch {
      setErrors({ form: "We could not connect. Check your connection and try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Create your buyer account"
      description="Reserve fresh vegetables from local markets and track your pickups."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href={withNextPath("/login", nextPath)}
            className="inline-flex items-center gap-1 font-semibold text-agrivive-primary underline-offset-4 hover:underline"
          >
            Sign in
            <LogIn aria-hidden="true" size={15} />
          </Link>
        </>
      }
    >
      <GoogleSignInButton nextPath={nextPath} />
      <div className="my-5 flex items-center gap-3 text-xs text-agrivive-muted">
        <span className="h-px flex-1 bg-agrivive-border" />
        <span>or create with email</span>
        <span className="h-px flex-1 bg-agrivive-border" />
      </div>

      {errors.form ? (
        <Alert variant="destructive" className="mb-5">
          <AlertDescription>{errors.form}</AlertDescription>
        </Alert>
      ) : null}

      {accountNotice ? (
        <Alert className="mb-5 border-agrivive-primary/30 bg-agrivive-primary/5 text-agrivive-primary">
          <AlertDescription>{accountNotice}</AlertDescription>
        </Alert>
      ) : null}

      <form onSubmit={handleSubmit} aria-busy={loading}>
        <FieldGroup>
          <AuthInput
            id="name"
            label="Full name"
            icon={<User className="size-4" />}
            autoComplete="name"
            placeholder="e.g. Maria Santos"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              if (errors.form) setErrors((prev) => ({ ...prev, form: undefined }));
            }}
            error={errors.name}
          />

          <AuthInput
            id="email"
            label="Email address"
            type="email"
            icon={<Mail className="size-4" />}
            autoComplete="email"
            placeholder="maria@example.com"
            value={email}
            onBlur={handleEmailBlur}
            onChange={(event) => {
              setEmail(event.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              if (errors.form) setErrors((prev) => ({ ...prev, form: undefined }));
              if (accountNotice) setAccountNotice(null);
            }}
            error={errors.email}
          />

          <div>
            <PasswordInput
              id="password"
              label="Password"
              autoComplete="new-password"
              placeholder="Create a password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                if (errors.form) setErrors((prev) => ({ ...prev, form: undefined }));
              }}
              error={errors.password}
            />
          </div>

          <div>
            <PasswordInput
              id="confirm-password"
              label="Confirm password"
              autoComplete="new-password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                if (errors.form) setErrors((prev) => ({ ...prev, form: undefined }));
              }}
              error={errors.confirmPassword}
            />
            <PasswordChecklist password={password} confirmPassword={confirmPassword} />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Spinner data-icon="inline-start" />
                Creating account...
              </>
            ) : accountNotice ? (
              <>
                <UserPlus data-icon="inline-start" />
                Add Buyer Profile
              </>
            ) : (
              <>
                <UserPlus data-icon="inline-start" />
                Create account
              </>
            )}
          </Button>
        </FieldGroup>
      </form>
    </AuthShell>
  );
}
