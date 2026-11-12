"use client";

import Link from "next/link";

interface SignUpTermsCheckboxProps {
  checked: boolean;
  error?: string;
  onChange: (checked: boolean) => void;
}

export function SignUpTermsCheckbox({ checked, error, onChange }: SignUpTermsCheckboxProps) {
  return (
    <div>
      <label className="flex cursor-pointer select-none items-start gap-2.5 text-xs leading-relaxed text-agrivive-stone">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "terms-error" : undefined}
          className="mt-0.5 size-4 shrink-0 cursor-pointer rounded-lg border-agrivive-border accent-agrivive-primary"
        />
        <span>
          I agree to the{" "}
          <Link href="/terms" target="_blank" className="font-semibold text-agrivive-primary hover:underline">Terms of Use</Link>
          {" "}and{" "}
          <Link href="/privacy" target="_blank" className="font-semibold text-agrivive-primary hover:underline">Privacy Policy</Link>.
        </span>
      </label>
      {error ? <p id="terms-error" role="alert" className="mt-1.5 text-xs font-medium text-destructive">{error}</p> : null}
    </div>
  );
}
