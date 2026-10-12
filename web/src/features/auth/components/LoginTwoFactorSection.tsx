"use client";

import { ShieldCheck } from "lucide-react";
import { AuthInput } from "./AuthInput";

interface LoginTwoFactorSectionProps {
  code: string;
  onChangeCode: (val: string) => void;
  error?: string;
}

export function LoginTwoFactorSection({
  code,
  onChangeCode,
  error,
}: LoginTwoFactorSectionProps) {
  return (
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
      onChange={(e) => onChangeCode(e.target.value.replace(/\D/g, ""))}
      error={error}
    />
  );
}
