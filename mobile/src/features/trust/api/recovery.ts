import { apiFetch } from "../../../api/client";

export function requestTrustRecovery(email: string) {
  return apiFetch<{ success: boolean }>("/trust/recovery/request", {
    method: "POST",
    body: JSON.stringify({ email: email.trim().toLowerCase() }),
  });
}

export function verifyTrustRecovery(email: string, otp: string) {
  return apiFetch<{ success: boolean; restoredAt: string }>("/trust/recovery/verify", {
    method: "POST",
    body: JSON.stringify({ email: email.trim().toLowerCase(), otp: otp.trim() }),
  });
}
