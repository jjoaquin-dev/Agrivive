import { apiFetch } from "../../../api/client";
import type {
  SellerOrder,
  SellerOrderFilter,
  SellerOrdersResponse,
} from "../types";

export interface FetchSellerOrdersParams {
  status?: SellerOrderFilter;
  limit?: number;
  cursor?: string;
}

export async function fetchSellerOrders(
  params: FetchSellerOrdersParams = {},
): Promise<SellerOrdersResponse> {
  const query = new URLSearchParams();
  if (params.status && params.status !== "all") query.set("status", params.status);
  if (params.limit) query.set("limit", String(params.limit));
  if (params.cursor) query.set("cursor", params.cursor);

  const qs = query.toString();
  return apiFetch<SellerOrdersResponse>(`/seller/orders${qs ? `?${qs}` : ""}`);
}

export async function fetchSellerOrder(orderId: string): Promise<SellerOrder> {
  return apiFetch<SellerOrder>(`/seller/orders/${orderId}`);
}

export async function scanSellerOrder(qrPayload: string): Promise<SellerOrder> {
  return apiFetch<SellerOrder>("/seller/orders/scan", {
    method: "POST",
    body: JSON.stringify({ qrPayload }),
  });
}

export async function cancelSellerOrder(
  orderId: string,
  reason: string,
): Promise<SellerOrder> {
  return apiFetch<SellerOrder>(`/seller/orders/${orderId}/cancel`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}
