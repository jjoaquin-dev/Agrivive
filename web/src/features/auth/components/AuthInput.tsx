import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type AuthInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
};

export function AuthInput({
  id,
  label,
  error,
  hint,
  icon,
  className,
  ...props
}: AuthInputProps) {
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
        {icon && (
          <div
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5F7367] transition-colors group-focus-within:text-[#457D00]"
            aria-hidden="true"
          >
            {icon}
          </div>
        )}
        <input
          id={id}
          aria-invalid={Boolean(error)}
          className={cn(
            "h-12 w-full rounded-full border border-agrivive-border/80 bg-white text-sm font-medium text-[#14231A] shadow-2xs transition-all placeholder:text-[#5F7367]/50",
            "hover:border-[#457D00]/40 focus:border-[#457D00] focus:bg-white focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
            icon ? "pl-11 pr-5" : "px-5",
            error && "border-destructive/80 focus:border-destructive focus:ring-0",
            className,
          )}
          {...props}
        />
      </div>
      {error && (
        <p role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
