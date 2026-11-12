import { eq, sql } from "drizzle-orm";
import { order_declines, order_status_history, ordered_items, orders, sellers_product } from "../../../db/schema";
import type { OrderTransaction } from "../../../utils/order-types";
import { notifyBuyer, notifySeller } from "../../../utils/pickup/notify";
import { recordTrustEvent } from "../../../utils/trust";
import { pointsText } from "../../../utils/trust/policy";

export type DeclineOutcome = "seller_fault" | "buyer_invalid" | "buyer_false_photo" | "disputed";
type Decline = typeof order_declines.$inferSelect;

/** "disputed" has no event: nobody gets points. */
const outcomeEvent = {
  seller_fault: { kind: "seller_decline_fault", who: "seller" },
  buyer_invalid: { kind: "buyer_invalid_decline", who: "buyer" },
  buyer_false_photo: { kind: "buyer_false_photo", who: "buyer" },
} as const;

const outcomeText: Record<DeclineOutcome, { buyer: string; seller: string }> = {
  seller_fault: {
    buyer: "Your decline was accepted. You are not charged for the declined items. You get 0 trust points.",
    seller: "The decline was confirmed as your fault. It adds 2 trust points and counts in your fault rate. Take the produce back; it is not put back into stock. You can dispute this within 7 days.",
  },
  buyer_invalid: {
    buyer: `Your decline was not valid, so it adds ${pointsText("buyer_invalid_decline")}. You can dispute this within 7 days.`,
    seller: "The decline was not valid. You get 0 points, and the produce went back into your stock so you can sell it again.",
  },
  disputed: {
    buyer: "The seller disagreed with your decline. Nobody gets points. The order is closed as declined at pickup, and you are not charged for the declined items.",
    seller: "You disagreed with the decline. Nobody gets points. The order is closed as declined at pickup, and the produce is not put back into stock.",
  },
  buyer_false_photo: {
    buyer: `The system found that this decline photo was already used on another decline. This adds ${pointsText("buyer_false_photo")}. You can dispute this within 7 days.`,
    seller: "The system found that the buyer's photo was already used on another decline. You get 0 points, and the produce went back into your stock.",
  },
};

/**
 * Closes a decline with its final outcome. The declined amounts leave the order. They go back to stock only when
 * the seller was not at fault, because produce that was really bad is not safe to resell. One trust event per order, except a disputed decline, which gives nobody points.
 */
export async function finalizeDecline(tx: OrderTransaction, decline: Decline, outcome: DeclineOutcome) {
  const now = new Date();
  await tx.update(order_declines).set({ status: outcome, decidedAt: now }).where(eq(order_declines.id, decline.id));
  const rows = await tx.select().from(ordered_items).where(eq(ordered_items.ordersId, decline.orderId));
  let total = 0;
  for (const row of rows) {
    const declined = decline.items.find((item) => item.itemId === row.id);
    const ordered = Number(row.quantity ?? 0);
    const remaining = declined ? Math.max(0, ordered - declined.quantity) : ordered;
    if (declined) {
      const subtotal = (remaining * Number(row.unitPrice)).toFixed(2);
      await tx.update(ordered_items).set({ quantity: remaining.toFixed(2), subtotal }).where(eq(ordered_items.id, row.id));
      if (outcome !== "seller_fault" && outcome !== "disputed") {
        await tx.update(sellers_product).set({ productQty: sql`${sellers_product.productQty} + ${declined.quantity.toFixed(2)}` }).where(eq(sellers_product.id, row.productId));
      }
    }
    total += remaining * Number(row.unitPrice);
  }
  await tx.update(orders).set({
    totalAmount: total.toFixed(2), updatedAt: now,
    ...(decline.isFull ? { status: "declined" as const, declinedAt: now } : {}),
  }).where(eq(orders.id, decline.orderId));
  await tx.insert(order_status_history).values({ orderId: decline.orderId, status: decline.isFull ? "declined" : "partly_declined", actorId: null, note: outcome });

  await notifyBuyer(tx, { buyerId: decline.buyerId, orderId: decline.orderId, key: `decline-decided:${decline.id}`, message: outcomeText[outcome].buyer });
  await notifySeller(tx, { sellerId: decline.sellerId, orderId: decline.orderId, key: `decline-decided:${decline.id}`, message: outcomeText[outcome].seller, kind: "trust_decision" });
  if (outcome === "disputed") return null;
  const { kind, who } = outcomeEvent[outcome];
  const subjectId = who === "seller" ? decline.sellerId : decline.buyerId;
  const eventKey = `decline:${decline.orderId}`;
  await recordTrustEvent(tx, { eventKey, orderId: decline.orderId, subjectId, kind, classification: "verified", sourceId: decline.id, reason: outcome });
  return { subjectId, eventKey, kind };
}
