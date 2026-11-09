import { and, eq, gte, sql } from "drizzle-orm";
import { orders } from "../../db/schema";
import type { OrderTransaction } from "../order-types";

export const FLOOD_ORDER_LIMIT = 5;
export const FLOOD_WINDOW_DAYS = 7;

/**
 * Table 2: more than 5 orders in 7 days from one buyer to one seller. The extra orders still work for the buyer,
 * add 0 points to anyone, and are left out of the seller's counts and rankings.
 */
export async function flagOrderFlood(tx: OrderTransaction, orderId: string, buyerId: string, sellerId: string, now = new Date()) {
  const since = new Date(now.getTime() - FLOOD_WINDOW_DAYS * 86_400_000);
  const [row] = await tx.select({ n: sql<number>`count(*)::int` }).from(orders).where(and(
    eq(orders.buyersId, buyerId), eq(orders.sellersId, sellerId), gte(orders.createdAt, since)));
  const flooded = Number(row?.n ?? 0) > FLOOD_ORDER_LIMIT;
  if (flooded) await tx.update(orders).set({ countsForRanking: false }).where(eq(orders.id, orderId));
  return flooded;
}
