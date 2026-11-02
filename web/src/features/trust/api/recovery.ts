import { apiRequest } from "@/src/lib/api";
import { recaptchaHeaders } from "@/src/lib/recaptcha";

export async function requestTrustRecovery(email: string) {
  return apiRequest<{ success: true }>("/trust/recovery/request", {
    method: "POST",
    headers: await recaptchaHeaders("account_recovery"),
    body: JSON.stringify({ email: email.trim().toLowerCase() }),
  });
}

export function verifyTrustRecovery(email: string, otp: string) {
  return apiRequest<{ success: true; restoredAt: string }>("/trust/recovery/verify", {
    method: "POST",
    body: JSON.stringify({ email: email.trim().toLowerCase(), otp: otp.trim() }),
  });
}
