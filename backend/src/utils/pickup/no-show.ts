import { and, eq, sql } from "drizzle-orm";
import { buyer_no_shows, orders } from "../../db/schema";
import type { OrderTransaction } from "../order-types";
import { recordTrustEvent } from "../trust";

/**
 * Records a missed pickup: 2 points every time (Table 1). The sequence number only counts how many the buyer has had.
 */
export async function recordNoShow(tx: OrderTransaction, input: { orderId: string; buyerId: string; markedBy: string }) {
  const [prior] = await tx.select({ n: sql<number>`count(*)::int` }).from(buyer_no_shows)
    .where(and(eq(buyer_no_shows.buyerId, input.buyerId), eq(buyer_no_shows.excused, false)));
  const sequence = Number(prior?.n ?? 0) + 1;
  const weight = 2;
  const [row] = await tx.insert(buyer_no_shows).values({ orderId: input.orderId, buyerId: input.buyerId, markedBy: input.markedBy, sequence, weight })
    .onConflictDoNothing({ target: buyer_no_shows.orderId }).returning();
  if (!row) return null;
  await tx.update(orders).set({ noShowAt: new Date() }).where(eq(orders.id, input.orderId));
  const eventKey = `buyer-expired:${input.orderId}`;
  await recordTrustEvent(tx, {
    eventKey, orderId: input.orderId, subjectId: input.buyerId, kind: "buyer_failed_reservation",
    classification: "verified", sourceId: input.orderId, weight,
    reason: "Missed pickup",
  });
  return { eventKey, sequence, weight };
}
