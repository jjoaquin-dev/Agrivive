import { and, eq } from "drizzle-orm";
import { db } from "../../../db";
import { buyer_listing_notices, seller_listing_events, trust_notices } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";

export async function readBuyerNotice(buyerId: string, noticeId: string) {
  const listing = noticeId.startsWith("listing:");
  const rawId = listing ? noticeId.slice("listing:".length) : noticeId;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(rawId)) {
    throw new OrderError(400, "Invalid notice ID");
  }
  return db.transaction(async (tx) => {
    if (listing) {
      const [notice] = await tx.select({ id: buyer_listing_notices.id,
        readAt: buyer_listing_notices.readAt, createdAt: buyer_listing_notices.createdAt,
        productId: seller_listing_events.productId, sellerId: seller_listing_events.sellerId,
        productName: seller_listing_events.productName, shopName: seller_listing_events.shopName,
      }).from(buyer_listing_notices)
        .innerJoin(seller_listing_events, eq(seller_listing_events.id, buyer_listing_notices.eventId))
        .where(and(eq(buyer_listing_notices.id, rawId), eq(buyer_listing_notices.buyerId, buyerId)))
        .for("update").limit(1);
      if (!notice) throw new OrderError(404, "Notice not found");
      if (!notice.readAt) {
        const [updated] = await tx.update(buyer_listing_notices).set({ readAt: new Date() })
          .where(eq(buyer_listing_notices.id, rawId)).returning({ readAt: buyer_listing_notices.readAt });
        notice.readAt = updated?.readAt ?? notice.readAt;
      }
      return { ...notice, id: `listing:${notice.id}`, kind: "seller_new_listing",
        orderId: null, sentAt: null };
    }
    const [notice] = await tx.select({
      id: trust_notices.id,
      orderId: trust_notices.orderId,
      kind: trust_notices.kind,
      createdAt: trust_notices.createdAt,
      readAt: trust_notices.readAt,
    }).from(trust_notices).where(and(
      eq(trust_notices.id, rawId),
      eq(trust_notices.recipientId, buyerId),
    )).for("update").limit(1);

    if (!notice) throw new OrderError(404, "Notice not found");
    if (notice.readAt) return notice;

    const [updated] = await tx.update(trust_notices).set({ readAt: new Date() })
      .where(eq(trust_notices.id, rawId)).returning({
        id: trust_notices.id,
        orderId: trust_notices.orderId,
        kind: trust_notices.kind,
        createdAt: trust_notices.createdAt,
        readAt: trust_notices.readAt,
      });
    return updated ?? notice;
  });
}
