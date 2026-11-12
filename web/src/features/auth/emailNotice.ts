type EmailCheck = { roleCount: number; hasTargetRole: boolean; exists: boolean; canUseEmail: boolean };

/** What the sign-up form says about an email after the check: an error under the field, or a notice. */
export function signUpEmailMessage(check: EmailCheck): { error?: string; notice: string | null } {
  if (check.roleCount >= 2) return { error: "This email has both Buyer and Seller profiles. Please sign in.", notice: null };
  if (check.hasTargetRole) return { error: "An account with this email is already a Buyer. Please sign in.", notice: null };
  if (check.exists && check.canUseEmail) return { notice: "Existing Seller account found. Enter password to link Buyer profile." };
  return { notice: null };
}
