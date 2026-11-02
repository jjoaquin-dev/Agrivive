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
      <label className="flex cursor-pointer select-none items-start gap-2.5 text-xs leading-relaxed text-[#5F7367]">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "terms-error" : undefined}
          className="mt-0.5 size-4 shrink-0 cursor-pointer rounded border-agrivive-border accent-[#457D00]"
        />
        <span>
          I agree to the{" "}
          <Link href="/terms" target="_blank" className="font-semibold text-[#457D00] hover:underline">Terms of Use</Link>
          {" "}and{" "}
          <Link href="/privacy" target="_blank" className="font-semibold text-[#457D00] hover:underline">Privacy Policy</Link>.
        </span>
      </label>
      {error ? <p id="terms-error" role="alert" className="mt-1.5 text-xs font-medium text-red-600">{error}</p> : null}
    </div>
  );
}
