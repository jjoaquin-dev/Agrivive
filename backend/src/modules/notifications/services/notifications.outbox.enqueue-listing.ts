import { and, eq, lte, sql } from "drizzle-orm";
import { seller_follows, seller_listing_events, user, notification_outbox } from "../../../db/schema";

type TransactionLike = {
  select: (...args: any[]) => any;
  insert: (table: typeof notification_outbox) => any;
};

export async function enqueueSellerListingNotifications(
  tx: TransactionLike,
  event: typeof seller_listing_events.$inferSelect,
) {
  const followers = await tx.select({ buyerId: seller_follows.buyerId })
    .from(seller_follows)
    .innerJoin(user, eq(user.id, seller_follows.buyerId))
    .where(and(
      eq(seller_follows.sellerId, event.sellerId),
      lte(seller_follows.createdAt, event.createdAt),
      eq(user.isActive, true),
      sql`'buyer'::"role" = any(${user.role})`,
    ));

  if (!followers.length) return 0;

  await tx.insert(notification_outbox).values(followers.map(({ buyerId }: { buyerId: string }) => ({
    recipientUserId: buyerId,
    type: "seller_listing" as const,
    aggregationKey: `seller-listing:${event.sellerId}`,
    dedupeKey: `${buyerId}:seller-listing:${event.id}`,
    referenceId: event.id,
    itemCount: 1,
    payload: {
      eventId: event.id,
      sellerId: event.sellerId,
      productId: event.productId,
      shopName: event.shopName,
      productName: event.productName,
    },
    createdAt: event.createdAt,
    updatedAt: event.createdAt,
  }))).onConflictDoNothing({ target: notification_outbox.dedupeKey });

  return followers.length;
}
