import { asc, isNull, sql } from "drizzle-orm";
import { db } from "../db";
import { buyer_listing_notices, seller_follows, seller_listing_events, user } from "../db/schema";

export async function sendSellerListingNotices(limit = 25) {
  let processedEvents = 0;
  let noticesCreated = 0;
  for (let i = 0; i < limit; i++) {
    const result = await db.transaction(async (tx) => {
      const [event] = await tx.select().from(seller_listing_events)
        .where(isNull(seller_listing_events.processedAt))
        .orderBy(asc(seller_listing_events.createdAt))
        .limit(1).for("update", { skipLocked: true });
      if (!event) return null;
      const inserted = await tx.execute(sql`
        insert into ${buyer_listing_notices} (buyer_id, event_id)
        select ${seller_follows.buyerId}, ${event.id}::uuid
        from ${seller_follows}
        inner join ${user} on ${user.id} = ${seller_follows.buyerId}
        where ${seller_follows.sellerId} = ${event.sellerId}
          and ${seller_follows.createdAt} <= ${event.createdAt}
          and ${user.isActive} = true
          and 'buyer'::"role" = any(${user.role})
        on conflict (buyer_id, event_id) do nothing
        returning id
      `);
      await tx.update(seller_listing_events).set({ processedAt: new Date() })
        .where(sql`${seller_listing_events.id} = ${event.id}`);
      return inserted.rowCount ?? 0;
    });
    if (result === null) break;
    processedEvents++;
    noticesCreated += result;
  }
  return { processedEvents, noticesCreated };
}
