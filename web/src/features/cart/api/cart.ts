import { apiRequest } from "@/src/lib/api";
import type { CartCheckoutResponse } from "../types";

export function createCartCheckout(items: Array<{ productId: string; quantity: number }>, idempotencyKey: string) {
  return apiRequest<CartCheckoutResponse>("/buyer/checkouts", {
    method: "POST",
    headers: { "Idempotency-Key": idempotencyKey },
    body: JSON.stringify({ items }),
  });
}
