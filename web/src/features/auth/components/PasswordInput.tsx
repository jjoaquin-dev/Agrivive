"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
  error?: string;
  hint?: string;
};

export function PasswordInput({
  id,
  label,
  error,
  hint,
  className,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="group flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="text-xs font-semibold uppercase tracking-wider text-[#14231A]/85 transition-colors group-focus-within:text-[#457D00]"
        >
          {label}
        </label>
        {hint && <span className="text-xs text-[#5F7367]">{hint}</span>}
      </div>
      <div className="relative">
        <div
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5F7367] transition-colors group-focus-within:text-[#457D00]"
          aria-hidden="true"
        >
          <Lock className="size-4" />
        </div>
        <input
          {...props}
          id={id}
          type={visible ? "text" : "password"}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            "h-12 w-full rounded-full border border-agrivive-border/80 bg-white pl-11 pr-14 text-sm font-medium text-[#14231A] shadow-sm transition-all placeholder:text-[#5F7367]",
            "hover:border-[#457D00]/40 focus:border-[#457D00] focus:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#457D00]/40 focus-visible:ring-offset-0",
            "[&::-ms-reveal]:hidden [&::-ms-clear]:hidden",
            error && "border-destructive/80 focus:border-destructive focus-visible:ring-destructive/40",
            className,
          )}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-1 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-lg text-[#5F7367] hover:bg-[#F7FAF2] hover:text-[#457D00] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#457D00]/40"
        >
          {visible ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
