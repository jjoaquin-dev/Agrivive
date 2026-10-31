import { and, desc, eq, isNull, lt, or, sql } from "drizzle-orm";
import { db } from "../../../db";
import { seller_notifications, trust_notices } from "../../../db/schema";
import { requireVerifiedSeller } from "../../../utils/seller-access";
import { OrderError } from "../../../utils/order-types";
import { toSellerNotificationItem } from "../../../utils/seller-notifications/to-item";
import type { SellerNotificationListQuery } from "../model/seller.notifications";

export async function listSellerNotifications(
  sellerId: string,
  query: SellerNotificationListQuery = {},
) {
  const limit = query.limit ?? 20;

  return db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId, true, true);

    let anchor: { id: string; createdAt: Date } | undefined;
    if (query.cursor) {
      [anchor] = await tx.select({ id: seller_notifications.id, createdAt: seller_notifications.createdAt })
        .from(seller_notifications).where(and(
          eq(seller_notifications.id, query.cursor), eq(seller_notifications.sellerId, sellerId),
        )).limit(1);
      if (!anchor) {
        [anchor] = await tx.select({ id: trust_notices.id, createdAt: trust_notices.createdAt })
          .from(trust_notices).where(and(
            eq(trust_notices.id, query.cursor), eq(trust_notices.recipientId, sellerId),
          )).limit(1);
      }
      if (!anchor) throw new OrderError(400, "Invalid notification cursor");
    }

    const alertRows = await tx.select().from(seller_notifications).where(and(
      eq(seller_notifications.sellerId, sellerId),
      query.unreadOnly ? isNull(seller_notifications.readAt) : undefined,
      anchor ? or(
        lt(seller_notifications.createdAt, anchor.createdAt),
        and(eq(seller_notifications.createdAt, anchor.createdAt), lt(seller_notifications.id, anchor.id)),
      ) : undefined,
    )).orderBy(desc(seller_notifications.createdAt), desc(seller_notifications.id)).limit(limit + 1);

    const trustRows = await tx.select({
      id: trust_notices.id,
      kind: trust_notices.kind,
      orderId: trust_notices.orderId,
      createdAt: trust_notices.createdAt,
      readAt: trust_notices.readAt,
    }).from(trust_notices).where(and(
      eq(trust_notices.recipientId, sellerId),
      query.unreadOnly ? isNull(trust_notices.readAt) : undefined,
      anchor ? or(
        lt(trust_notices.createdAt, anchor.createdAt),
        and(eq(trust_notices.createdAt, anchor.createdAt), lt(trust_notices.id, anchor.id)),
      ) : undefined,
    )).orderBy(desc(trust_notices.createdAt), desc(trust_notices.id)).limit(limit + 1);

    const merged = [
      ...alertRows.map((row) => toSellerNotificationItem("alert", row)),
      ...trustRows.map((row) => toSellerNotificationItem("trust", row)),
    ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime() || (a.id < b.id ? 1 : -1));

    const page = merged.slice(0, limit);
    const [alertUnread] = await tx.select({ count: sql<number>`count(*)::int` }).from(seller_notifications)
      .where(and(eq(seller_notifications.sellerId, sellerId), isNull(seller_notifications.readAt)));
    const [trustUnread] = await tx.select({ count: sql<number>`count(*)::int` }).from(trust_notices)
      .where(and(eq(trust_notices.recipientId, sellerId), isNull(trust_notices.readAt)));

    return {
      items: page,
      nextCursor: merged.length > limit && page.length > 0 ? page[page.length - 1].id : null,
      unreadCount: Number(alertUnread?.count ?? 0) + Number(trustUnread?.count ?? 0),
    };
  });
}
