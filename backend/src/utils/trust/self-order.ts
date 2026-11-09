import { and, eq, inArray } from "drizzle-orm";
import { db } from "../../db";
import { sellers_product } from "../../db/schema";
import { OrderError } from "../order-types";
import { evaluateTrustAction } from "./evaluate-action";
import { recordTrustEvent } from "./index";

/**
 * Table 2: an order from the seller's own account adds 3 points and blocks the account at once.
 * The order itself is refused. The event is saved before the error, so the refusal cannot undo it.
 */
export async function blockSelfOrder(buyerId: string, productIds: string[]) {
  const own = await db.select({ id: sellers_product.id }).from(sellers_product)
    .where(and(inArray(sellers_product.id, productIds), eq(sellers_product.userId, buyerId))).limit(1);
  if (!own.length) return;
  const eventKey = `self-order:${buyerId}:${own[0]!.id}`;
  await db.transaction(async (tx) => {
    await recordTrustEvent(tx, { eventKey, subjectId: buyerId, kind: "self_order", classification: "verified", sourceId: own[0]!.id, reason: "The buyer account is the seller account" });
  });
  await evaluateTrustAction(buyerId, null, eventKey, "self_order");
  throw new OrderError(403, "You cannot reserve items from your own stall. This adds 3 points and blocks your account.");
}
