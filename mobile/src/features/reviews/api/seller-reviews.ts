import { apiFetch } from "../../../api/client";
import type { ReviewFilter, SellerReviewsResponse } from "../types";

export interface FetchSellerReviewsParams {
  filter?: ReviewFilter;
  rating?: number;
  limit?: number;
  offset?: number;
}

export async function fetchSellerReviewsList(
  params: FetchSellerReviewsParams = {},
): Promise<SellerReviewsResponse> {
  const query = new URLSearchParams();
  if (params.filter && params.filter !== "all") query.set("filter", params.filter);
  if (params.rating) query.set("rating", String(params.rating));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.offset) query.set("offset", String(params.offset));

  const qs = query.toString();
  return apiFetch<SellerReviewsResponse>(`/seller/reviews${qs ? `?${qs}` : ""}`);
}

export async function replyToReview(
  reviewId: string,
  response: string,
): Promise<{ id: string; sellerResponse: string }> {
  return apiFetch(`/seller/reviews/${reviewId}/reply`, {
    method: "POST",
    body: JSON.stringify({ response }),
  });
}
