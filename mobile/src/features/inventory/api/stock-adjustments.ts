import { apiFetch } from "../../../api/client";
import type { StockAdjustment } from "../types";

export interface FetchStockAdjustmentsParams {
  productId?: string;
  limit?: number;
  cursor?: string;
}

export interface StockAdjustmentsResponse {
  items: StockAdjustment[];
  nextCursor: string | null;
}

export async function fetchStockAdjustments(
  params: FetchStockAdjustmentsParams = {},
): Promise<StockAdjustmentsResponse> {
  const query = new URLSearchParams();
  if (params.productId) query.append("productId", params.productId);
  if (params.limit) query.append("limit", params.limit.toString());
  if (params.cursor) query.append("cursor", params.cursor);

  const qs = query.toString();
  const endpoint = `/seller/stock-adjustments${qs ? `?${qs}` : ""}`;

  return apiFetch<StockAdjustmentsResponse>(endpoint);
}
