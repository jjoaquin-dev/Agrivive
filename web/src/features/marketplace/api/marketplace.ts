import { apiRequest } from "@/src/lib/api";
import type {
  MarketplaceProduct,
  MarketplaceProductResponse,
  MarketplaceSellerProfile,
  ProductReviewsResponse,
  SellerReviewsResponse,
} from "../types";

export function listMarketplaceProducts(params: URLSearchParams, signal?: AbortSignal) {
  const query = new URLSearchParams(params);
  query.set("limit", query.get("limit") ?? "20");
  return apiRequest<MarketplaceProductResponse>(`/marketplace/products?${query.toString()}`, { signal });
}

export function listMarketplaceDeals(signal?: AbortSignal) {
  return apiRequest<{ products: MarketplaceProduct[]; evaluatedAt: string }>("/marketplace/products/deals", { signal });
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
