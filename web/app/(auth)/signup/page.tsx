"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthInput } from "@/src/features/auth/components/AuthInput";
import { AuthShell } from "@/src/features/auth/components/AuthShell";
import { PasswordChecklist } from "@/src/features/auth/components/PasswordChecklist";
import { PasswordInput } from "@/src/features/auth/components/PasswordInput";
import { validateSignUp, type AuthErrors } from "@/src/features/auth/validation";
import { authClient } from "@/src/lib/auth-client";
import { DEFAULT_BUYER_DESTINATION, getNextPathFromLocation, withNextPath } from "@/src/lib/navigation";
import { LogIn, Mail, User, UserPlus } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<AuthErrors>({});
  const [nextPath, setNextPath] = useState(DEFAULT_BUYER_DESTINATION);

  useEffect(() => setNextPath(getNextPathFromLocation()), []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateSignUp({ name, email, password, confirmPassword });
    if (Object.keys(nextErrors).length) return setErrors(nextErrors);
    setLoading(true);
    setErrors({});
    const cleanEmail = email.trim().toLowerCase();
    try {
      const response = await authClient.signUp.email({
        name: name.trim(),
        email: cleanEmail,
        password,
      });
      if (response.error) {
        const message = response.error.message?.toLowerCase() ?? "";
        setErrors(
          message.includes("already") || message.includes("exist")
            ? { email: "An account with this email already exists. Sign in instead." }
            : { form: response.error.message || "Could not create your account." },
        );
        return;
      }
      router.replace(withNextPath(`/verify-email?email=${encodeURIComponent(cleanEmail)}&sent=true`, nextPath));
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
      <form onSubmit={handleSubmit} aria-busy={loading}>
        {errors.form ? (
          <Alert variant="destructive" className="mb-5">
            <AlertDescription>{errors.form}</AlertDescription>
          </Alert>
        ) : null}

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
            onChange={(event) => {
              setEmail(event.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              if (errors.form) setErrors((prev) => ({ ...prev, form: undefined }));
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
