import { apiRequest } from "@/src/lib/api";
import type { MarketplaceProductRecommendationResponse } from "../types";

export function getMarketplaceProductRecommendations(productId: string, signal?: AbortSignal) {
  return apiRequest<MarketplaceProductRecommendationResponse>(
    `/marketplace/products/${encodeURIComponent(productId)}/recommendations`,
    { signal },
  );
}
