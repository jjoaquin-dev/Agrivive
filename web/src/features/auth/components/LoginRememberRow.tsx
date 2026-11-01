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
    <div className="flex items-center justify-between pt-1">
      <label className="group flex cursor-pointer select-none items-center gap-2 text-xs font-medium text-[#5F7367] hover:text-[#14231A] transition-colors">
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => onRememberMeChange(e.target.checked)}
          className="size-4 rounded-lg border-agrivive-border text-[#457D00] accent-[#457D00] focus:ring-0 focus-visible:ring-0 focus-visible:outline-none transition-all cursor-pointer"
        />
        <span>Remember me</span>
      </label>
      <Link
        href={withNextPath("/account-recovery", nextPath)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#457D00] hover:text-[#FEA938] transition-colors focus-visible:outline-none focus-visible:underline"
      >
        <KeyRound className="size-3.5" aria-hidden="true" />
        <span>Forgot Password?</span>
      </Link>
    </div>
  );
}
