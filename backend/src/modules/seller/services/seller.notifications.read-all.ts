import { and, eq, isNull } from "drizzle-orm";
import { db } from "../../../db";
import { seller_notifications, trust_notices } from "../../../db/schema";
import { requireVerifiedSeller } from "../../../utils/seller-access";

export async function readAllSellerNotifications(sellerId: string) {
  return db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId, true, true);
    const now = new Date();

    const alerts = await tx.update(seller_notifications).set({ readAt: now })
      .where(and(
        eq(seller_notifications.sellerId, sellerId),
        isNull(seller_notifications.readAt),
      )).returning({ id: seller_notifications.id });
    const notices = await tx.update(trust_notices).set({ readAt: now })
      .where(and(
        eq(trust_notices.recipientId, sellerId),
        isNull(trust_notices.readAt),
      )).returning({ id: trust_notices.id });

    return { updatedCount: alerts.length + notices.length };
  });
}
