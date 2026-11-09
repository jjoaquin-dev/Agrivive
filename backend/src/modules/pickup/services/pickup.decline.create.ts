import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { order_declines, ordered_items, orders } from "../../../db/schema";
import { getOrder } from "../../../utils/order-read";
import { OrderError } from "../../../utils/order-types";
import { DECLINE_SELLER_HOURS, declineReasons, isValidDeclineReason } from "../../../utils/pickup/decline-reasons";
import { storeDeclinePhoto } from "../../../utils/pickup/decline-photo";
import { notifySeller } from "../../../utils/pickup/notify";
import { qrStatus } from "../../../utils/pickup/qr-window";
import { evaluateTrustAction } from "../../../utils/trust/evaluate-action";
import type { DeclineCreateBody } from "../model/pickup.decline";
import { finalizeDecline } from "./pickup.decline.finalize";

function parseItems(text: string | undefined, rows: { id: string; quantity: string | null }[]) {
  if (!text) return { isFull: true, items: rows.map((row) => ({ itemId: row.id, quantity: Number(row.quantity ?? 0) })) };
  let parsed: unknown;
  try { parsed = JSON.parse(text); } catch { throw new OrderError(400, "The items to decline could not be read."); }
  if (!Array.isArray(parsed) || !parsed.length) throw new OrderError(400, "Choose at least one item to decline.");
  const items = parsed.map((entry) => {
    const row = rows.find((candidate) => candidate.id === entry?.itemId);
    const ordered = Number(row?.quantity ?? 0);
    const quantity = Number(entry?.quantity ?? ordered);
    if (!row || !(quantity > 0) || quantity > ordered + 0.0001) throw new OrderError(400, "Check the items and amounts you want to decline.");
    return { itemId: row.id, quantity };
  });
  if (new Set(items.map((item) => item.itemId)).size !== items.length) throw new OrderError(400, "Each item can only appear once.");
  const isFull = rows.every((row) => Math.abs((items.find((item) => item.itemId === row.id)?.quantity ?? 0) - Number(row.quantity ?? 0)) < 0.0001);
  return { isFull, items };
}

/**
 * "Decline at pickup": the buyer inspects first, chooses a reason from Table 8 and takes a photo in the app.
 * A reason that is not allowed closes at once (buyer +1). A picture already used on another decline closes at once as false or reused (buyer +2).
 * Otherwise the seller has 24 hours to accept or dispute, and nobody gets points until that is settled.
 */
export async function createPickupDecline(buyerId: string, orderId: string, body: DeclineCreateBody) {
  const [orderRow] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!orderRow || orderRow.buyersId !== buyerId) throw new OrderError(404, "Order not found");
  if (orderRow.status !== "pending") throw new OrderError(409, "This order is no longer open for pickup.");
  if (qrStatus(orderRow.pickupStart, orderRow.pickupEnd) !== "active" || (orderRow.pickupStart && orderRow.pickupStart > new Date())) throw new OrderError(409, "You can decline only during your pickup time.");
  const { key, hash } = await storeDeclinePhoto(orderId, body.photo, "buyer", body.capturedAt);

  const result = await db.transaction(async (tx) => {
    const [order] = await tx.select().from(orders).where(eq(orders.id, orderId)).for("update").limit(1);
    if (!order || order.status !== "pending") throw new OrderError(409, "This order is no longer open for pickup.");
    const [existing] = await tx.select({ id: order_declines.id }).from(order_declines).where(eq(order_declines.orderId, orderId)).limit(1);
    if (existing) throw new OrderError(409, "You already declined this order.");
    const rows = await tx.select({ id: ordered_items.id, quantity: ordered_items.quantity }).from(ordered_items).where(eq(ordered_items.ordersId, orderId));
    const { isFull, items } = parseItems(body.items, rows);
    const [reused] = await tx.select({ id: order_declines.id }).from(order_declines).where(eq(order_declines.photoHash, hash)).limit(1);
    const reasonValid = isValidDeclineReason(body.reason);
    const now = new Date();
    const [decline] = await tx.insert(order_declines).values([{
      orderId, buyerId, sellerId: order.sellersId, reason: body.reason, reasonValid, details: body.details?.trim() ?? null,
      items, isFull, photoKey: key, photoHash: hash, photoReused: !!reused,
      sellerDueAt: new Date(now.getTime() + DECLINE_SELLER_HOURS * 3_600_000),
      status: "pending_seller",
    }]).returning();
    await notifySeller(tx, {
      sellerId: order.sellersId, orderId, key: `decline-new:${decline!.id}`,
      message: `The buyer declined at pickup: ${declineReasons[body.reason as keyof typeof declineReasons].label}. You have 24 hours to accept, or dispute with your own photo.`,
    });
    if (reused) return { finalized: await finalizeDecline(tx, decline!, "buyer_false_photo") };
    if (!reasonValid) return { finalized: await finalizeDecline(tx, decline!, "buyer_invalid") };
    return { finalized: null };
  });
  if (result.finalized) await evaluateTrustAction(result.finalized.subjectId, orderId, result.finalized.eventKey, result.finalized.kind);
  return getOrder(orderId, buyerId, "buyer");
}
