import type { InputHTMLAttributes, ReactNode } from "react";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

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
    <Field data-invalid={error ? "true" : undefined}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {icon ? (
        <div className="relative">
          <div
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-agrivive-muted"
            aria-hidden="true"
          >
            {icon}
          </div>
          <Input
            id={id}
            aria-invalid={Boolean(error)}
            className={`pl-10 ${className ?? ""}`}
            {...props}
          />
        </div>
      ) : (
        <Input
          id={id}
          aria-invalid={Boolean(error)}
          className={className}
          {...props}
        />
      )}
      {hint ? <FieldDescription>{hint}</FieldDescription> : null}
      <FieldError>{error}</FieldError>
    </Field>
  );
}
