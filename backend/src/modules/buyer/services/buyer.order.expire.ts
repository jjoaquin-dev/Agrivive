import { and, eq, lte } from "drizzle-orm";
import { db } from "../../../db";
import { orders } from "../../../db/schema";
import { restoreOrderStock } from "../../../utils/order-stock";
import { queueTrustNotice, recordTrustEvent } from "../../../utils/trust";
import { evaluateTrustAction } from "../../../utils/trust/evaluate-action";
import { createSellerNotification } from "../../../utils/seller-notifications";

export async function expirePendingOrders(limit = 100) {
  const due = await db
    .select({ id: orders.id, buyersId: orders.buyersId, sellersId: orders.sellersId })
    .from(orders)
    .where(and(eq(orders.status, "pending"), lte(orders.expiresAt, new Date())))
    .orderBy(orders.expiresAt)
    .limit(limit);

  let expiredCount = 0;
  for (const row of due) {
    const expired = await db.transaction(async (tx) => {
      const [updated] = await tx
        .update(orders)
        .set({ status: "expired", expiredAt: new Date(), updatedAt: new Date() })
        .where(
          and(
            eq(orders.id, row.id),
            eq(orders.status, "pending"),
            lte(orders.expiresAt, new Date()),
          ),
        )
        .returning({ id: orders.id, buyersId: orders.buyersId, sellersId: orders.sellersId });

      if (!updated) return null;
      await restoreOrderStock(tx, updated.id);

      // FTM-09: Record confirmed reservation violation for buyer no-show
      const eventKey = `buyer-expired:${updated.id}`;
      await recordTrustEvent(tx, {
        eventKey,
        orderId: updated.id,
        subjectId: updated.buyersId,
        kind: "buyer_failed_reservation",
        classification: "verified",
        sourceId: updated.id,
      });

      await queueTrustNotice(tx, {
        noticeKey: `buyer-expired-notice:${updated.id}`,
        recipientId: updated.buyersId,
        orderId: updated.id,
        kind: "buyer_failed_reservation_warning",
      });

      await createSellerNotification(tx, {
        sellerId: updated.sellersId,
        kind: "reservation_ended",
        dedupeKey: `reservation-ended:${updated.id}`,
        orderId: updated.id,
      });

      return { buyerId: updated.buyersId, orderId: updated.id, eventKey };
    });

    if (expired) {
      expiredCount++;
      await evaluateTrustAction(expired.buyerId, expired.orderId, expired.eventKey, "buyer_failed_reservation");
    }
  }
  return expiredCount;
}
