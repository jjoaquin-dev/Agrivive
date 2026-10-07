import { apiRequest } from "@/src/lib/api";
import type { MarketplaceSellerMapResponse } from "../types";

export function listMarketplaceSellersMap(params: URLSearchParams, signal?: AbortSignal) {
  const query = new URLSearchParams(params);
  query.delete("cursor");
  query.delete("limit");
  const suffix = query.toString();
  return apiRequest<MarketplaceSellerMapResponse>(
    `/marketplace/sellers/map${suffix ? `?${suffix}` : ""}`,
    { signal },
  );
}
