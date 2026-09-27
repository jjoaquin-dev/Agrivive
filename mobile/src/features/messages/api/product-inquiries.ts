import { apiFetch } from "../../../api/client";
import type { SellerMessageFilter, SellerProductInquiriesResponse } from "../types";

export interface FetchSellerProductInquiriesParams {
  status?: SellerMessageFilter;
  limit?: number;
  cursor?: string;
}

export function fetchSellerProductInquiries(params: FetchSellerProductInquiriesParams = {}) {
  const query = new URLSearchParams();
  if (params.status && params.status !== "all") query.set("status", params.status);
  if (params.limit) query.set("limit", String(params.limit));
  if (params.cursor) query.set("cursor", params.cursor);

  const suffix = query.toString() ? `?${query.toString()}` : "";
  return apiFetch<SellerProductInquiriesResponse>(`/seller/product-inquiries${suffix}`);
}

export function replyToProductInquiry(inquiryId: string, reply: string) {
  return apiFetch<{ success?: boolean; message?: string }>(
    `/seller/product-inquiries/${encodeURIComponent(inquiryId)}/reply`,
    {
      method: "POST",
      body: JSON.stringify({ reply }),
    },
  );
}
