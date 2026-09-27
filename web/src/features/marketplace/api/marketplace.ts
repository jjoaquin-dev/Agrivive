import { apiRequest } from "@/src/lib/api";
import type {
  MarketplaceProduct,
  MarketplaceProductResponse,
  MarketplaceSellerProfile,
  ProductReviewsResponse,
  ProductReviewEligibility,
  SellerReviewsResponse,
  BuyerProductReview,
} from "../types";

export function listMarketplaceProducts(params: URLSearchParams, signal?: AbortSignal) {
  const query = new URLSearchParams(params);
  query.set("limit", query.get("limit") ?? "20");
  return apiRequest<MarketplaceProductResponse>(`/marketplace/products?${query.toString()}`, { signal });
}

export function getMarketplaceProduct(id: string, signal?: AbortSignal) {
  return apiRequest<MarketplaceProduct>(`/marketplace/products/${encodeURIComponent(id)}`, { signal });
}

export function getMarketplaceSeller(sellerId: string, signal?: AbortSignal) {
  return apiRequest<MarketplaceSellerProfile>(`/marketplace/sellers/${encodeURIComponent(sellerId)}`, { signal });
}

export function getSellerReviews(sellerId: string, signal?: AbortSignal) {
  return apiRequest<SellerReviewsResponse>(`/buyer/sellers/${encodeURIComponent(sellerId)}/reviews`, { signal });
}

export function getProductReviews(productId: string, signal?: AbortSignal) {
  return apiRequest<ProductReviewsResponse>(`/marketplace/products/${encodeURIComponent(productId)}/reviews`, { signal });
}

export function getProductReviewEligibility(productId: string, signal?: AbortSignal) {
  return apiRequest<ProductReviewEligibility>(`/buyer/products/${encodeURIComponent(productId)}/review-eligibility`, { signal });
}

export function createProductReview(productId: string, orderId: string, itemId: string, rating: number, review: string) {
  return apiRequest<BuyerProductReview>(`/buyer/orders/${encodeURIComponent(orderId)}/items/${encodeURIComponent(itemId)}/review`, {
    method: "POST",
    body: JSON.stringify({ rating, review }),
  });
}
