import { apiRequest } from "@/src/lib/api";
import type { CartCheckoutResponse } from "../types";

export function createCartCheckout(items: Array<{ productId: string; quantity: number }>, pickups: Array<{ sellerId: string; pickupStart: string; pickupEnd: string }>, idempotencyKey: string) {
  return apiRequest<CartCheckoutResponse>("/buyer/checkouts", {
    method: "POST",
    headers: { "Idempotency-Key": idempotencyKey },
    body: JSON.stringify({ items, pickups }),
  });
}
