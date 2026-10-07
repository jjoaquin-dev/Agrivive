import { and, eq, isNull } from "drizzle-orm";
import { db } from "../../../db";
import { seller_promotion_jobs } from "../../../db/schema";
import { requireVerifiedSeller } from "../../../utils/seller-access";

export async function readAllSellerPromotions(sellerId: string) {
  return db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId);
    const rows = await tx.update(seller_promotion_jobs)
      .set({ readAt: new Date(), updatedAt: new Date() })
      .where(and(
        eq(seller_promotion_jobs.sellerId, sellerId),
        eq(seller_promotion_jobs.status, "ready"),
        isNull(seller_promotion_jobs.readAt),
      )).returning({ id: seller_promotion_jobs.id });
    return { updatedCount: rows.length };
  });
}
