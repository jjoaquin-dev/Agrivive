import { apiFetch } from "../../api/client";

/** What the server says about an email before sign-up: is it taken, and how many roles does it have. */
export interface EmailCheckResult {
  exists: boolean;
  roleCount: number;
  currentRoles: string[];
  canUseEmail: boolean;
  hasTargetRole: boolean;
  message: string;
}

export async function checkEmailPreflight(cleanEmail: string): Promise<EmailCheckResult | null> {
  try {
    return await apiFetch<EmailCheckResult>("/auth/check-email", {
      method: "POST",
      body: JSON.stringify({ email: cleanEmail, targetRole: "seller" }),
    });
  } catch {
    return null;
  }
}
