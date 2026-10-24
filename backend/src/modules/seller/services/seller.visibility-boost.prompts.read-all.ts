import { and, eq, isNull } from "drizzle-orm";
import { db } from "../../../db";
import { seller_visibility_boosts } from "../../../db/schema";
import { requireVerifiedSeller } from "../../../utils/seller-access";

export async function readAllSellerVisibilityBoostPrompts(sellerId: string) {
  return db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId);
    const rows = await tx.update(seller_visibility_boosts)
      .set({
        readAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(
        eq(seller_visibility_boosts.sellerId, sellerId),
        isNull(seller_visibility_boosts.readAt),
      ))
      .returning({ id: seller_visibility_boosts.id });
    return { updatedCount: rows.length };
  });
}
