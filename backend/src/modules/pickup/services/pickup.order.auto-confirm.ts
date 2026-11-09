import { and, eq, gt, isNull, isNotNull, lte } from "drizzle-orm";
import { db } from "../../../db";
import { orders } from "../../../db/schema";
import { AUTO_CONFIRM_HOURS } from "../../../utils/pickup/qr-window";
import { confirmOrderRow } from "./pickup.order.confirm";

/** Scheduled: confirms orders the seller left unanswered for 3 hours. Each order is confirmed once, even if two workers run. */
export async function autoConfirmOrders(limit = 100) {
  const cutoff = new Date(Date.now() - AUTO_CONFIRM_HOURS * 3_600_000);
  const due = await db.select({ id: orders.id }).from(orders).where(and(
    eq(orders.status, "pending"), isNull(orders.confirmedAt), isNotNull(orders.pickupStart),
    lte(orders.createdAt, cutoff), gt(orders.expiresAt, new Date()),
  )).limit(limit);
  let confirmed = 0;
  for (const row of due) {
    if (await db.transaction((tx) => confirmOrderRow(tx, row.id, "auto"))) confirmed++;
  }
  return confirmed;
}
