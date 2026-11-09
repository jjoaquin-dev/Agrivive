import { apiRequest } from "@/src/lib/api";
import type {
  BuyerOrder,
  BuyerOrderResponse,
  BuyerOrderReview,
} from "@/src/features/marketplace/types";

export function listBuyerOrders(cursor?: string, signal?: AbortSignal) {
  const query = new URLSearchParams({ limit: "20" });
  if (cursor) query.set("cursor", cursor);
  return apiRequest<BuyerOrderResponse>(`/buyer/orders?${query.toString()}`, { signal });
}

export function getBuyerOrder(id: string, signal?: AbortSignal) {
  return apiRequest<BuyerOrder>(`/buyer/orders/${encodeURIComponent(id)}`, { signal });
}

export function createBuyerOrder(productId: string, quantity: number, pickup: { pickupStart: string; pickupEnd: string }, idempotencyKey: string) {
  return apiRequest<BuyerOrder>("/buyer/orders", {
    method: "POST",
    headers: {
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify({ productId, quantity, ...pickup }),
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

export type OrderReviewInput = { productRating: number; serviceRating: number; review: string };

export function createBuyerOrderReview(orderId: string, input: OrderReviewInput) {
  return apiRequest<BuyerOrderReview>(`/buyer/orders/${encodeURIComponent(orderId)}/review`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function editBuyerOrderReview(orderId: string, input: OrderReviewInput) {
  return apiRequest<BuyerOrderReview>(`/buyer/orders/${encodeURIComponent(orderId)}/review`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function uploadBuyerReviewPhoto(orderId: string, file: File) {
  const body = new FormData();
  body.append("file", file);
  return apiRequest<BuyerOrderReview>(`/buyer/orders/${encodeURIComponent(orderId)}/review/photo`, { method: "POST", body });
}

export type ExcuseReason = "rain" | "sick" | "no_transport" | "other";

export function sendOrderExcuse(orderId: string, reason: ExcuseReason, details: string) {
  return apiRequest<BuyerOrder>(`/buyer/orders/${encodeURIComponent(orderId)}/excuse`, { method: "POST", body: JSON.stringify({ reason, details }) });
}

export function answerReschedule(orderId: string, accept: boolean) {
  return apiRequest<BuyerOrder>(`/buyer/orders/${encodeURIComponent(orderId)}/reschedule/respond`, { method: "POST", body: JSON.stringify({ accept }) });
}

export function sendPickupDecline(orderId: string, input: { reason: string; details: string; photo: Blob; capturedAt: string; items?: { itemId: string; quantity: number }[] }) {
  const body = new FormData();
  body.append("reason", input.reason);
  if (input.details) body.append("details", input.details);
  body.append("capturedAt", input.capturedAt);
  if (input.items) body.append("items", JSON.stringify(input.items));
  body.append("photo", new File([input.photo], "decline.jpg", { type: "image/jpeg" }));
  return apiRequest<BuyerOrder>(`/buyer/orders/${encodeURIComponent(orderId)}/decline`, { method: "POST", body });
}
