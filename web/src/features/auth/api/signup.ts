import { apiRequest } from "@/src/lib/api";

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
    return await apiRequest<EmailCheckResult>("/auth/check-email", {
      method: "POST",
      body: JSON.stringify({ email: cleanEmail, targetRole: "buyer" }),
    });
  } catch {
    return null;
  }
}

export async function registerBuyerRole({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name: string;
}): Promise<void> {
  await apiRequest<unknown>("/auth/register-role", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      name,
      targetRole: "buyer",
    }),
  });
}
