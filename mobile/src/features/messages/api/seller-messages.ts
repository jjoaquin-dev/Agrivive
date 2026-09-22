import { apiFetch } from "../../../api/client";
import type { SellerMessageFilter, SellerMessagesResponse } from "../types";

export interface FetchSellerMessagesParams {
  status?: SellerMessageFilter;
  limit?: number;
  cursor?: string;
}

export function fetchSellerMessages(params: FetchSellerMessagesParams = {}) {
  const query = new URLSearchParams();
  if (params.status && params.status !== "all") query.set("status", params.status);
  if (params.limit) query.set("limit", String(params.limit));
  if (params.cursor) query.set("cursor", params.cursor);

  const suffix = query.toString() ? `?${query.toString()}` : "";
  return apiFetch<SellerMessagesResponse>(`/seller/inquiries${suffix}`);
}
