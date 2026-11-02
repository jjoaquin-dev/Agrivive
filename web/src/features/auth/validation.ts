const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type AuthErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
  code?: string;
  form?: string;
};

export function validateEmail(email: string): string | undefined {
  if (!email.trim()) return "Enter your email address.";
  if (!emailPattern.test(email.trim())) return "Enter a valid email address.";
  return undefined;
}

export function validatePassword(password: string, isSignUp = false): string | undefined {
  if (!password) return "Enter your password.";
  if (password.length < 8) return "Use at least 8 characters.";
  if (isSignUp) {
    if (!/[A-Z]/.test(password)) return "Include at least 1 uppercase letter.";
    if (!/[a-z]/.test(password)) return "Include at least 1 lowercase letter.";
    if (!/[0-9]/.test(password)) return "Include at least 1 number.";
    if (!/[^A-Za-z0-9]/.test(password)) return "Include at least 1 special character.";
  }
  return undefined;
}

export function validateSignUp(input: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
}): AuthErrors {
  const errors: AuthErrors = {};
  if (!input.name.trim()) errors.name = "Enter your name.";
  errors.email = validateEmail(input.email);
  errors.password = validatePassword(input.password, true);
  if (!input.confirmPassword) errors.confirmPassword = "Confirm your password.";
  else if (input.password !== input.confirmPassword) errors.confirmPassword = "Passwords do not match.";
  if (!input.acceptedTerms) errors.terms = "Agree to the Terms of Use and Privacy Policy to continue.";
  return Object.fromEntries(Object.entries(errors).filter(([, value]) => value)) as AuthErrors;
}
