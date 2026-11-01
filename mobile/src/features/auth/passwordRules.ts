/** Same five rules as the web sign-up, set-password and change-password forms (web/src/features/auth). */
export const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (password: string) => password.length >= 8 },
  { label: "At least 1 uppercase letter", test: (password: string) => /[A-Z]/.test(password) },
  { label: "At least 1 lowercase letter", test: (password: string) => /[a-z]/.test(password) },
  { label: "At least 1 number", test: (password: string) => /[0-9]/.test(password) },
  { label: "At least 1 special character", test: (password: string) => /[^A-Za-z0-9]/.test(password) },
] as const;

/** Returns the first broken rule as a sentence, or undefined when the password is good. */
export function validateNewPassword(password: string): string | undefined {
  if (!password) return "Enter your password.";
  if (password.length < 8) return "Use at least 8 characters.";
  if (!/[A-Z]/.test(password)) return "Include at least 1 uppercase letter.";
  if (!/[a-z]/.test(password)) return "Include at least 1 lowercase letter.";
  if (!/[0-9]/.test(password)) return "Include at least 1 number.";
  if (!/[^A-Za-z0-9]/.test(password)) return "Include at least 1 special character.";
  return undefined;
}
