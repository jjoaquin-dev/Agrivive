import { apiRequest } from "@/src/lib/api";
import { recaptchaHeaders } from "@/src/lib/recaptcha";
import { LEGAL_VERSION } from "@/src/features/legal/content/version";

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
    headers: await recaptchaHeaders("sign_up"),
    body: JSON.stringify({
      email,
      password,
      name,
      targetRole: "buyer",
      acceptedTerms: true,
      termsVersion: LEGAL_VERSION,
    }),
  });
}
