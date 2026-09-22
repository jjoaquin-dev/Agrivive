import { and, eq, lte } from "drizzle-orm";
import { db } from "../../../db";
import { orders } from "../../../db/schema";
import { restoreOrderStock } from "../../../utils/order-stock";

export async function expirePendingOrders(limit = 100) {
  const due = await db
    .select({ id: orders.id })
    .from(orders)
    .where(and(eq(orders.status, "pending"), lte(orders.expiresAt, new Date())))
    .orderBy(orders.expiresAt)
    .limit(limit);
  let expiredCount = 0;
  for (const row of due) {
    const expired = await db.transaction(async (tx) => {
      const [updated] = await tx
        .update(orders)
        .set({ status: "expired", updatedAt: new Date() })
        .where(
          and(
            eq(orders.id, row.id),
            eq(orders.status, "pending"),
            lte(orders.expiresAt, new Date()),
          ),
        )
        .returning({ id: orders.id });
      if (!updated) return false;
      await restoreOrderStock(tx, updated.id);
      return true;
    });
    if (expired) expiredCount++;
  }
  return expiredCount;
}
