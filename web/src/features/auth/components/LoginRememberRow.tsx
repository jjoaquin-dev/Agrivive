"use client";

import Link from "next/link";
import { KeyRound } from "lucide-react";
import { withNextPath } from "@/src/lib/navigation";

interface LoginRememberRowProps {
  rememberMe: boolean;
  onRememberMeChange: (checked: boolean) => void;
  nextPath: string;
}

export function LoginRememberRow({
  rememberMe,
  onRememberMeChange,
  nextPath,
}: LoginRememberRowProps) {
  return (
    <div className="flex items-center justify-between pt-1 text-xs">
      <label className="flex cursor-pointer select-none items-center gap-2 text-agrivive-muted">
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => onRememberMeChange(e.target.checked)}
          className="size-4 rounded border-agrivive-border text-agrivive-primary focus:ring-agrivive-primary"
        />
        <span>Remember me</span>
      </label>
      <Link
        href={withNextPath("/account-recovery", nextPath)}
        className="inline-flex items-center gap-1 font-medium text-agrivive-primary hover:underline"
      >
        <KeyRound className="size-3" aria-hidden="true" />
        Forgot Password?
      </Link>
    </div>
  );
}
