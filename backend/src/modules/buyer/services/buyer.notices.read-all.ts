import { and, eq, isNull } from "drizzle-orm";
import { db } from "../../../db";
import { trust_notices } from "../../../db/schema";

export async function readAllBuyerNotices(buyerId: string) {
  const updated = await db.update(trust_notices).set({ readAt: new Date() })
    .where(and(
      eq(trust_notices.recipientId, buyerId),
      isNull(trust_notices.readAt),
    )).returning({ id: trust_notices.id });
  return { updatedCount: updated.length };
}
