import { apiFetch } from "../../../api/client";
import type { ReviewFilter, ReviewKind, SellerReviewsResponse } from "../types";

export interface FetchSellerReviewsParams {
  kind?: ReviewKind;
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
  const path = params.kind === "product" ? "/seller/product-reviews" : "/seller/reviews";
  return apiFetch<SellerReviewsResponse>(`${path}${qs ? `?${qs}` : ""}`);
}

export async function replyToReview(
  reviewId: string,
  response: string,
  kind: ReviewKind = "pickup",
): Promise<{ id: string; sellerResponse: string }> {
  const path = kind === "product" ? "product-reviews" : "reviews";
  return apiFetch(`/seller/${path}/${reviewId}/reply`, {
    method: "POST",
    body: JSON.stringify({ response }),
  });
}
