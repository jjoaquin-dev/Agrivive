import { apiFetch } from "../../../api/client";
import type { AnalyticsUnit, SellerAnalyticsResponse } from "../types";

export interface FetchSellerAnalyticsParams {
  from: string;
  to: string;
  productId?: string;
  unit?: AnalyticsUnit;
}

export function fetchSellerAnalytics(params: FetchSellerAnalyticsParams) {
  const query = new URLSearchParams({ from: params.from, to: params.to });
  if (params.productId) query.set("productId", params.productId);
  if (params.unit) query.set("unit", params.unit);
  return apiFetch<SellerAnalyticsResponse>(`/seller/analytics/summary?${query.toString()}`);
}
