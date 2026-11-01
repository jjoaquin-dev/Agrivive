import { and, eq } from "drizzle-orm";
import { db } from "../../../db";
import { seller_notifications, trust_notices } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";
import { requireVerifiedSeller } from "../../../utils/seller-access";
import { toSellerNotificationItem } from "../../../utils/seller-notifications/to-item";

export async function readSellerNotification(sellerId: string, notificationId: string) {
  return db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId, true, true);

    const [alert] = await tx.select().from(seller_notifications).where(and(
      eq(seller_notifications.id, notificationId),
      eq(seller_notifications.sellerId, sellerId),
    )).for("update").limit(1);
    if (alert) {
      if (alert.readAt) return toSellerNotificationItem("alert", alert);
      const [updated] = await tx.update(seller_notifications).set({ readAt: new Date() })
        .where(eq(seller_notifications.id, alert.id)).returning();
      return toSellerNotificationItem("alert", updated ?? alert);
    }

    const [notice] = await tx.select({
      id: trust_notices.id,
      kind: trust_notices.kind,
      orderId: trust_notices.orderId,
      createdAt: trust_notices.createdAt,
      readAt: trust_notices.readAt,
    }).from(trust_notices).where(and(
      eq(trust_notices.id, notificationId),
      eq(trust_notices.recipientId, sellerId),
    )).for("update").limit(1);
    if (!notice) throw new OrderError(404, "Notification not found");
    if (notice.readAt) return toSellerNotificationItem("trust", notice);

    const [updated] = await tx.update(trust_notices).set({ readAt: new Date() })
      .where(eq(trust_notices.id, notificationId)).returning({
        id: trust_notices.id,
        kind: trust_notices.kind,
        orderId: trust_notices.orderId,
        createdAt: trust_notices.createdAt,
        readAt: trust_notices.readAt,
      });
    return toSellerNotificationItem("trust", updated ?? notice);
  });
}
