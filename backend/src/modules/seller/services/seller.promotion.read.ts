import { and, eq, isNull } from "drizzle-orm";
import { db } from "../../../db";
import { seller_promotion_jobs } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";
import { requireVerifiedSeller } from "../../../utils/seller-access";

export async function readSellerPromotion(sellerId: string, promotionId: string) {
  return db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId);
    const [row] = await tx.update(seller_promotion_jobs).set({ readAt: new Date(), updatedAt: new Date() })
      .where(and(
        eq(seller_promotion_jobs.id, promotionId),
        eq(seller_promotion_jobs.sellerId, sellerId),
        eq(seller_promotion_jobs.status, "ready"),
        isNull(seller_promotion_jobs.readAt),
      )).returning({ id: seller_promotion_jobs.id, readAt: seller_promotion_jobs.readAt });
    if (row) return row;
    const [existing] = await tx.select({ id: seller_promotion_jobs.id, readAt: seller_promotion_jobs.readAt })
      .from(seller_promotion_jobs).where(and(
        eq(seller_promotion_jobs.id, promotionId),
        eq(seller_promotion_jobs.sellerId, sellerId),
        eq(seller_promotion_jobs.status, "ready"),
      )).limit(1);
    if (!existing) throw new OrderError(404, "Promotion draft not found");
    return existing;
  });
}
