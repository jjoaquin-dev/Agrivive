import { and, eq, isNull } from "drizzle-orm";
import { db } from "../../../db";
import { trust_notices } from "../../../db/schema";
import { requireVerifiedSeller } from "../../../utils/seller-access";

export async function readAllSellerNotifications(sellerId: string) {
  return db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId);

    const updated = await tx.update(trust_notices).set({ readAt: new Date() })
      .where(and(
        eq(trust_notices.recipientId, sellerId),
        isNull(trust_notices.readAt),
      )).returning({ id: trust_notices.id });

    return { updatedCount: updated.length };
  });
}
