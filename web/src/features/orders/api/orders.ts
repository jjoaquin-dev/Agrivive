import { apiRequest } from "@/src/lib/api";
import type {
  BuyerOrder,
  BuyerOrderResponse,
  BuyerOrderReview,
  BuyerProductReview,
} from "@/src/features/marketplace/types";

export function listBuyerOrders(cursor?: string, signal?: AbortSignal) {
  const query = new URLSearchParams({ limit: "20" });
  if (cursor) query.set("cursor", cursor);
  return apiRequest<BuyerOrderResponse>(`/buyer/orders?${query.toString()}`, { signal });
}

export function getBuyerOrder(id: string, signal?: AbortSignal) {
  return apiRequest<BuyerOrder>(`/buyer/orders/${encodeURIComponent(id)}`, { signal });
}

export function createBuyerOrder(productId: string, quantity: number, idempotencyKey: string) {
  return apiRequest<BuyerOrder>("/buyer/orders", {
    method: "POST",
    headers: {
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify({ productId, quantity }),
  });
}

export function cancelBuyerOrder(id: string) {
  return apiRequest<BuyerOrder>(`/buyer/orders/${encodeURIComponent(id)}/cancel`, {
    method: "POST",
  });
}

export function getBuyerOrderReview(orderId: string, signal?: AbortSignal) {
  return apiRequest<BuyerOrderReview>(`/buyer/orders/${encodeURIComponent(orderId)}/review`, { signal });
}

export function createBuyerOrderReview(orderId: string, rating: number, review: string) {
  return apiRequest<BuyerOrderReview>(`/buyer/orders/${encodeURIComponent(orderId)}/review`, {
    method: "POST",
    body: JSON.stringify({ rating, review }),
  });
}

export function getBuyerProductReview(orderId: string, itemId: string, signal?: AbortSignal) {
  return apiRequest<BuyerProductReview>(
    `/buyer/orders/${encodeURIComponent(orderId)}/items/${encodeURIComponent(itemId)}/review`,
    { signal },
  );
}

export function createBuyerProductReview(orderId: string, itemId: string, rating: number, review: string) {
  return apiRequest<BuyerProductReview>(
    `/buyer/orders/${encodeURIComponent(orderId)}/items/${encodeURIComponent(itemId)}/review`,
    { method: "POST", body: JSON.stringify({ rating, review }) },
  );
}
