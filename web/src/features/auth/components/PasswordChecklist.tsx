import { Check, Circle } from "lucide-react";

type PasswordChecklistProps = {
  password: string;
  confirmPassword: string;
};

export function PasswordChecklist({
  password,
  confirmPassword,
}: PasswordChecklistProps) {
  const hasLength = password.length >= 8;
  const matches = Boolean(password && confirmPassword && password === confirmPassword);

  if (!password && !confirmPassword) return null;

  return (
    <div
      className="mt-2 space-y-1.5 rounded-lg border border-agrivive-border bg-agrivive-background/70 p-3 text-xs text-agrivive-muted"
      aria-live="polite"
    >
      <div
        className={`flex items-center gap-2 ${
          hasLength ? "font-medium text-agrivive-success" : ""
        }`}
      >
        {hasLength ? (
          <Check className="size-3.5 shrink-0 text-agrivive-success" />
        ) : (
          <Circle className="size-3.5 shrink-0 opacity-40" />
        )}
        <span>At least 8 characters</span>
      </div>
      <div
        className={`flex items-center gap-2 ${
          matches ? "font-medium text-agrivive-success" : ""
        }`}
      >
        {matches ? (
          <Check className="size-3.5 shrink-0 text-agrivive-success" />
        ) : (
          <Circle className="size-3.5 shrink-0 opacity-40" />
        )}
        <span>Passwords match</span>
      </div>
    </div>
  );
}
