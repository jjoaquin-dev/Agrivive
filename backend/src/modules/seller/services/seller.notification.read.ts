import { and, eq } from "drizzle-orm";
import { db } from "../../../db";
import { trust_notices } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";
import { requireVerifiedSeller } from "../../../utils/seller-access";

export async function readSellerNotification(sellerId: string, notificationId: string) {
  return db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId);

    const [notification] = await tx.select({
      id: trust_notices.id,
      kind: trust_notices.kind,
      orderId: trust_notices.orderId,
      createdAt: trust_notices.createdAt,
      readAt: trust_notices.readAt,
    }).from(trust_notices).where(and(
      eq(trust_notices.id, notificationId),
      eq(trust_notices.recipientId, sellerId),
    )).for("update").limit(1);

    if (!notification) throw new OrderError(404, "Notification not found");
    if (notification.readAt) return notification;

    const [updated] = await tx.update(trust_notices).set({ readAt: new Date() })
      .where(eq(trust_notices.id, notificationId)).returning({
        id: trust_notices.id,
        kind: trust_notices.kind,
        orderId: trust_notices.orderId,
        createdAt: trust_notices.createdAt,
        readAt: trust_notices.readAt,
      });
    return updated ?? notification;
  });
}
