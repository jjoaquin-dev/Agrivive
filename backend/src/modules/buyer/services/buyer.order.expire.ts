import { and, eq, lte } from "drizzle-orm";
import { db } from "../../../db";
import { orders } from "../../../db/schema";
import { expireOrderRow } from "../../../utils/pickup/expire-order";

/** Ends open reservations whose QR ran out (15 minutes after the pickup range). Points come from the no-show step, not from here. */
export async function expirePendingOrders(limit = 100) {
  const due = await db
    .select({ id: orders.id })
    .from(orders)
    .where(and(eq(orders.status, "pending"), lte(orders.expiresAt, new Date())))
    .orderBy(orders.expiresAt)
    .limit(limit);
  let expiredCount = 0;
  for (const row of due) {
    if (await db.transaction((tx) => expireOrderRow(tx, row.id))) expiredCount++;
  }
  return expiredCount;
}
