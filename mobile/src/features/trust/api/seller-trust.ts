import { apiFetch } from "../../../api/client";
import type { SellerTrustResponse } from "../types";

export function fetchSellerTrust() {
  return apiFetch<SellerTrustResponse>("/seller/trust");
}

export function requestTrustCorrection(eventId: string, reason: string) {
  return apiFetch(`/seller/trust/events/${eventId}/correction`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}
