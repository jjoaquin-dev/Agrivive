import { and, eq, isNull } from "drizzle-orm";
import { db } from "../../../db";
import { buyer_listing_notices, trust_notices } from "../../../db/schema";

export async function readAllBuyerNotices(buyerId: string) {
  return db.transaction(async (tx) => {
    const now = new Date();
    const orders = await tx.update(trust_notices).set({ readAt: now })
      .where(and(eq(trust_notices.recipientId, buyerId), isNull(trust_notices.readAt)))
      .returning({ id: trust_notices.id });
    const listings = await tx.update(buyer_listing_notices).set({ readAt: now })
      .where(and(eq(buyer_listing_notices.buyerId, buyerId), isNull(buyer_listing_notices.readAt)))
      .returning({ id: buyer_listing_notices.id });
    return { updatedCount: orders.length + listings.length };
  });
}
