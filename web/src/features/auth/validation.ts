const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type AuthErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  code?: string;
  form?: string;
};

export function validateEmail(email: string): string | undefined {
  if (!email.trim()) return "Enter your email address.";
  if (!emailPattern.test(email.trim())) return "Enter a valid email address.";
  return undefined;
}

export function validatePassword(password: string): string | undefined {
  if (!password) return "Enter your password.";
  if (password.length < 8) return "Use at least 8 characters.";
  return undefined;
}

export function validateSignUp(input: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}): AuthErrors {
  const errors: AuthErrors = {};
  if (!input.name.trim()) errors.name = "Enter your name.";
  errors.email = validateEmail(input.email);
  errors.password = validatePassword(input.password);
  if (!input.confirmPassword) errors.confirmPassword = "Confirm your password.";
  else if (input.password !== input.confirmPassword) errors.confirmPassword = "Passwords do not match.";
  return Object.fromEntries(Object.entries(errors).filter(([, value]) => value)) as AuthErrors;
}
