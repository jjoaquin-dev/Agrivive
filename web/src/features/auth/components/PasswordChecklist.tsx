import { Check } from "lucide-react";

type PasswordChecklistProps = {
  password: string;
  confirmPassword: string;
};

export function PasswordChecklist({
  password,
  confirmPassword,
}: PasswordChecklistProps) {
  const rules = [
    { label: "8 - 10+ characters", valid: password.length >= 8 },
    { label: "At least 1 uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "At least 1 lowercase letter", valid: /[a-z]/.test(password) },
    { label: "At least 1 number", valid: /[0-9]/.test(password) },
    { label: "At least 1 special character", valid: /[^A-Za-z0-9]/.test(password) },
  ];

  const validCount = rules.filter((r) => r.valid).length;
  const matches = Boolean(password && confirmPassword && password === confirmPassword);

  if (!password && !confirmPassword) return null;

  const strengthConfig = [
    { label: "Weak password", color: "bg-rose-500", textColor: "text-rose-600" },
    { label: "Weak password", color: "bg-rose-500", textColor: "text-rose-600" },
    { label: "Fair password", color: "bg-amber-500", textColor: "text-amber-600" },
    { label: "Good password", color: "bg-emerald-500", textColor: "text-emerald-600" },
    { label: "Strong password", color: "bg-[#457D00]", textColor: "text-[#457D00]" },
  ];

  const currentStrength = validCount > 0 ? strengthConfig[validCount - 1] : null;

  return (
    <div
      className="mt-3 space-y-3 rounded-2xl border border-agrivive-border/80 bg-white/95 p-3.5 shadow-2xs"
      aria-live="polite"
    >
      {/* 5-Segment Strength Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-[#5F7367]">Password strength</span>
          <span className={currentStrength?.textColor || "text-[#5F7367]"}>
            {currentStrength?.label || "Enter password"}
          </span>
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {[0, 1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-colors duration-200 ${
                index < validCount && currentStrength
                  ? currentStrength.color
                  : "bg-neutral-200"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Rules Checklist in a Clean Vertical List (One Line per Rule) */}
      <div className="space-y-2 pt-1 text-xs">
        {rules.map((rule) => (
          <div
            key={rule.label}
            className={`flex items-center gap-2.5 transition-colors ${
              rule.valid ? "font-semibold text-emerald-700" : "text-neutral-500"
            }`}
          >
            <span
              className={`grid size-4 shrink-0 place-items-center rounded-full transition-colors ${
                rule.valid ? "bg-emerald-600 text-white" : "bg-neutral-300 text-white"
              }`}
            >
              <Check className="size-2.5 stroke-[3]" />
            </span>
            <span>{rule.label}</span>
          </div>
        ))}
        {confirmPassword ? (
          <div
            className={`flex items-center gap-2.5 transition-colors ${
              matches ? "font-semibold text-emerald-700" : "text-neutral-500"
            }`}
          >
            <span
              className={`grid size-4 shrink-0 place-items-center rounded-full transition-colors ${
                matches ? "bg-emerald-600 text-white" : "bg-neutral-300 text-white"
              }`}
            >
              <Check className="size-2.5 stroke-[3]" />
            </span>
            <span>Passwords match</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
