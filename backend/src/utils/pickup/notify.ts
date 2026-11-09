import type { OrderTransaction } from "../order-types";
import { queueTrustNotice } from "../trust";
import { createSellerNotification } from "../seller-notifications";
import { sellerOrderCode } from "../seller-notifications/messages";

/** A plain-words message to the buyer, shown in their notices (and by email). Safe to call twice with the same key. */
export function notifyBuyer(tx: OrderTransaction, input: { buyerId: string; orderId?: string | null; key: string; message: string; kind?: string }) {
  return queueTrustNotice(tx, {
    noticeKey: input.key, recipientId: input.buyerId, orderId: input.orderId ?? null,
    kind: input.kind ?? "order_update", detail: input.message,
  });
}

/** A seller alert with the same plain message. */
export function notifySeller(tx: OrderTransaction, input: { sellerId: string; orderId?: string | null; key: string; message: string; kind?: "order_update" | "trust_decision" }) {
  return createSellerNotification(tx, {
    sellerId: input.sellerId, kind: input.kind ?? "order_update", dedupeKey: input.key, orderId: input.orderId ?? null,
    payload: { message: input.message, ...(input.orderId ? { code: sellerOrderCode(input.orderId) } : {}) },
  });
}
