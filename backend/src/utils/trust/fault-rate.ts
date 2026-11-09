import { and, eq, gte, isNull, sql } from "drizzle-orm";
import type { db } from "../../db";
import { order_declines, orders, trust_events } from "../../db/schema";
import { sellerFaultPolicy, trustScoreWindowStart } from "./policy";

type Reader = Pick<typeof db, "select">;

/** Equation 2. Returns a percentage. */
export function computeFaultRate(faults: number, orderCount: number) {
  return orderCount > 0 ? (faults / orderCount) * 100 : 0;
}

export const faultGateMet = (orderCount: number, ratePercent: number) =>
  orderCount >= sellerFaultPolicy.minOrders && ratePercent >= sellerFaultPolicy.gatePercent;

export const needsReview = (orderCount: number, ratePercent: number) =>
  orderCount >= sellerFaultPolicy.minOrders && ratePercent >= sellerFaultPolicy.reviewPercent;

/**
 * F = (seller cancellations + confirmed wrong listings + upheld declines at pickup)
 *     / (completed + cancelled + declined orders), over the score window, kept apart from the trust score.
 * A declined order the seller disputed counts only in the bottom number.
 */
export async function readSellerFaultRate(reader: Reader, sellerId: string, now = new Date()) {
  const since = trustScoreWindowStart(now) ?? new Date(0);
  const [orderRow] = await reader.select({
    completed: sql<number>`count(*) filter (where ${orders.status} = 'completed' and ${orders.completedAt} >= ${since.toISOString()}::timestamptz)::int`,
    cancelled: sql<number>`count(*) filter (where ${orders.status} = 'cancelled' and ${orders.cancelledAt} >= ${since.toISOString()}::timestamptz)::int`,
  }).from(orders).where(and(eq(orders.sellersId, sellerId), eq(orders.countsForRanking, true)));
  const [declineRow] = await reader.select({ count: sql<number>`count(*)::int` }).from(order_declines).where(and(
    eq(order_declines.sellerId, sellerId), eq(order_declines.status, "seller_fault"), gte(order_declines.decidedAt, since)));
  const [disputedRow] = await reader.select({ count: sql<number>`count(*)::int` }).from(order_declines).where(and(
    eq(order_declines.sellerId, sellerId), eq(order_declines.status, "disputed"), gte(order_declines.decidedAt, since)));
  const [wrongRow] = await reader.select({ count: sql<number>`count(*)::int` }).from(trust_events).where(and(
    eq(trust_events.subjectId, sellerId), eq(trust_events.kind, "misleading_product_info"),
    eq(trust_events.classification, "verified"), isNull(trust_events.invalidatedAt), gte(trust_events.createdAt, since)));
  // Seller cancellations are the counted (verified, not overturned) cancellation events.
  const [cancelRow] = await reader.select({ count: sql<number>`count(*)::int` }).from(trust_events).where(and(
    eq(trust_events.subjectId, sellerId), eq(trust_events.kind, "seller_cancellation"),
    eq(trust_events.classification, "verified"), isNull(trust_events.invalidatedAt), gte(trust_events.createdAt, since)));
  const upheldDeclines = Number(declineRow?.count ?? 0);
  const wrongListings = Number(wrongRow?.count ?? 0);
  const sellerCancelled = Number(cancelRow?.count ?? 0);
  const orderCount = Number(orderRow?.completed ?? 0) + Number(orderRow?.cancelled ?? 0) + upheldDeclines + Number(disputedRow?.count ?? 0);
  const faults = sellerCancelled + wrongListings + upheldDeclines;
  return {
    faults, orderCount, upheldDeclines, wrongListings, sellerCancelled,
    completedOrders: Number(orderRow?.completed ?? 0),
    ratePercent: computeFaultRate(faults, orderCount),
  };
}
