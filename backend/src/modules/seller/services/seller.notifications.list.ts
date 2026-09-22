import { and, desc, eq, isNull, lt, or, sql } from "drizzle-orm";
import { db } from "../../../db";
import { trust_notices } from "../../../db/schema";
import { requireVerifiedSeller } from "../../../utils/seller-access";
import { OrderError } from "../../../utils/order-types";
import type { SellerNotificationListQuery } from "../model/seller.notifications";

export async function listSellerNotifications(
  sellerId: string,
  query: SellerNotificationListQuery = {},
) {
  const limit = query.limit ?? 20;

  return db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId);

    const unreadCondition = query.unreadOnly ? isNull(trust_notices.readAt) : undefined;
    let before;

    if (query.cursor) {
      const [anchor] = await tx.select({
        id: trust_notices.id,
        createdAt: trust_notices.createdAt,
      }).from(trust_notices).where(and(
        eq(trust_notices.id, query.cursor),
        eq(trust_notices.recipientId, sellerId),
      )).limit(1);

      if (!anchor) throw new OrderError(400, "Invalid notification cursor");
      before = or(
        lt(trust_notices.createdAt, anchor.createdAt),
        and(eq(trust_notices.createdAt, anchor.createdAt), lt(trust_notices.id, anchor.id)),
      );
    }

    const rows = await tx.select({
      id: trust_notices.id,
      kind: trust_notices.kind,
      orderId: trust_notices.orderId,
      createdAt: trust_notices.createdAt,
      readAt: trust_notices.readAt,
    }).from(trust_notices).where(and(
      eq(trust_notices.recipientId, sellerId),
      unreadCondition,
      before,
    )).orderBy(desc(trust_notices.createdAt), desc(trust_notices.id)).limit(limit + 1);

    const page = rows.slice(0, limit);
    const [unread] = await tx.select({
      count: sql<number>`count(*)::int`,
    }).from(trust_notices).where(and(
      eq(trust_notices.recipientId, sellerId),
      isNull(trust_notices.readAt),
    ));

    return {
      items: page,
      nextCursor: rows.length > limit && page.length > 0 ? page[page.length - 1].id : null,
      unreadCount: Number(unread?.count ?? 0),
    };
  });
}
