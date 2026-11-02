import { apiFetch } from "../../../api/client";
import { recaptchaHeaders } from "../../auth/recaptcha";

export async function requestTrustRecovery(email: string) {
  return apiFetch<{ success: boolean }>("/trust/recovery/request", {
    method: "POST",
    headers: await recaptchaHeaders("account_recovery"),
    body: JSON.stringify({ email: email.trim().toLowerCase() }),
  });
}

export function verifyTrustRecovery(email: string, otp: string) {
  return apiFetch<{ success: boolean; restoredAt: string }>("/trust/recovery/verify", {
    method: "POST",
    body: JSON.stringify({ email: email.trim().toLowerCase(), otp: otp.trim() }),
  });
}
