import { and, eq, gt, isNotNull, lt, ne, sql } from "drizzle-orm";
import type { db } from "../../db";
import { orders, seller_opening_hours, sellers_profile } from "../../db/schema";
import { OrderError, type OrderTransaction } from "../order-types";
import { MINUTE_MS, addDaysKey, bookableDateKeys, manilaInstant } from "./manila";
import { PICKUP_CAPACITY, PICKUP_STEP_MINUTES, dayWindow, rangeCells, rangesOverlap, validatePickupRange, type Range, type StallRules } from "./rules";

type Reader = Pick<typeof db, "select">;

export async function readStallRules(reader: Reader, sellerId: string): Promise<StallRules & { shopName: string }> {
  const [profile] = await reader.select().from(sellers_profile)
    .where(and(eq(sellers_profile.userId, sellerId), eq(sellers_profile.isCurrent, true))).limit(1);
  if (!profile) throw new OrderError(404, "Seller stall not found");
  const hours = await reader.select().from(seller_opening_hours).where(eq(seller_opening_hours.sellerId, sellerId));
  return {
    hours: hours.map((row) => ({ weekday: row.weekday, isClosed: row.isClosed, opensMinute: row.opensMinute, closesMinute: row.closesMinute })),
    closedDate: profile.closedDate,
    pickupWithinMinutes: profile.pickupWithinMinutes,
    capacity: PICKUP_CAPACITY,
    shopName: profile.shopName,
  };
}

/** Open reservations only: cancelled, expired, declined and completed orders never block a time. */
const openReservation = and(eq(orders.status, "pending"), isNotNull(orders.pickupStart), isNotNull(orders.pickupEnd));

export async function readSellerLoad(reader: Reader, sellerId: string, from: Date, to: Date, excludeOrderId?: string) {
  const rows = await reader.select({ start: orders.pickupStart, end: orders.pickupEnd }).from(orders).where(and(
    eq(orders.sellersId, sellerId), openReservation,
    lt(orders.pickupStart, to), gt(orders.pickupEnd, from),
    excludeOrderId ? ne(orders.id, excludeOrderId) : undefined,
  ));
  return rows.map((row) => ({ start: row.start!, end: row.end! }));
}

export async function readBuyerConflict(reader: Reader, buyerId: string, range: Range, excludeOrderId?: string) {
  const [row] = await reader.select({ id: orders.id, start: orders.pickupStart, end: orders.pickupEnd }).from(orders).where(and(
    eq(orders.buyersId, buyerId), openReservation,
    lt(orders.pickupStart, range.end), gt(orders.pickupEnd, range.start),
    excludeOrderId ? ne(orders.id, excludeOrderId) : undefined,
  )).limit(1);
  return row ?? null;
}

/**
 * Rechecks every pickup rule on the server: hours, closed days, 30-minute closing buffer, today/tomorrow,
 * the seller's range limit, seller capacity and the buyer's own overlapping reservations (across all sellers).
 * Two locks keep simultaneous requests from slipping through: one per buyer, one per seller stall.
 */
export async function assertPickupAvailable(tx: OrderTransaction, input: {
  buyerId: string; sellerId: string; range: Range; now?: Date; excludeOrderId?: string;
}) {
  const now = input.now ?? new Date();
  await tx.execute(sql`select pg_advisory_xact_lock(hashtext('pickup-buyer'), hashtext(${input.buyerId}))`);
  await tx.execute(sql`select pg_advisory_xact_lock(hashtext('pickup-seller'), hashtext(${input.sellerId}))`);
  const rules = await readStallRules(tx, input.sellerId);
  validatePickupRange(input.range, rules, now);
  const load = await readSellerLoad(tx, input.sellerId, input.range.start, input.range.end, input.excludeOrderId);
  for (const cell of rangeCells(input.range)) {
    const cellRange = { start: cell, end: new Date(cell.getTime() + PICKUP_STEP_MINUTES * MINUTE_MS) };
    if (load.filter((other) => rangesOverlap(other, cellRange)).length >= rules.capacity) {
      throw new OrderError(409, "This stall is fully booked for part of that time. Please choose another time.");
    }
  }
  const conflict = await readBuyerConflict(tx, input.buyerId, input.range, input.excludeOrderId);
  if (conflict) {
    throw new OrderError(409, "You already have a pickup at that time. Choose a different time or cancel your other order.");
  }
  return rules;
}

/** What the reservation calendar shows: for today and tomorrow, each 15-minute cell and whether it is free. */
export async function readPickupSlots(reader: Reader, sellerId: string, buyerId: string | null, now = new Date()) {
  const rules = await readStallRules(reader, sellerId);
  const keys = bookableDateKeys(now);
  const days = [];
  for (const dateKey of keys) {
    const window = dayWindow(rules, dateKey);
    if (!window.open || !rules.hours.length) {
      days.push({ date: dateKey, open: false, reason: rules.hours.length ? window.open ? "" : window.reason : "This stall has not set its opening hours yet.", cells: [] });
      continue;
    }
    const dayStart = manilaInstant(dateKey, window.opensMinute);
    const dayEnd = manilaInstant(dateKey, window.latestEndMinute);
    const load = await readSellerLoad(reader, sellerId, dayStart, dayEnd);
    const mine = buyerId ? await reader.select({ start: orders.pickupStart, end: orders.pickupEnd }).from(orders).where(and(
      eq(orders.buyersId, buyerId), openReservation, lt(orders.pickupStart, dayEnd), gt(orders.pickupEnd, dayStart))) : [];
    const cells = [];
    for (let t = dayStart.getTime(); t + PICKUP_STEP_MINUTES * MINUTE_MS <= dayEnd.getTime(); t += PICKUP_STEP_MINUTES * MINUTE_MS) {
      const cell = { start: new Date(t), end: new Date(t + PICKUP_STEP_MINUTES * MINUTE_MS) };
      const full = load.filter((other) => rangesOverlap(other, cell)).length >= rules.capacity;
      const busy = mine.some((other) => rangesOverlap({ start: other.start!, end: other.end! }, cell));
      cells.push({ start: cell.start.toISOString(), end: cell.end.toISOString(), available: !full && !busy && cell.start.getTime() >= now.getTime(), full, busy });
    }
    days.push({ date: dateKey, open: true, reason: "", opensMinute: window.opensMinute, latestEndMinute: window.latestEndMinute, cells });
  }
  return { shopName: rules.shopName, stepMinutes: PICKUP_STEP_MINUTES, maxRangeMinutes: rules.pickupWithinMinutes, days };
}

export { addDaysKey };
