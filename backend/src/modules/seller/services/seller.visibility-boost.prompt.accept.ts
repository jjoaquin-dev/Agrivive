import { and, eq } from "drizzle-orm";
import { db } from "../../../db";
import { seller_visibility_boosts } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";
import { requireVerifiedSeller } from "../../../utils/seller-access";
import { queueSellerVisibilityBoost } from "./seller.visibility-boost.queue";

export async function acceptSellerVisibilityBoostPrompt(sellerId: string, promptId: string) {
  const prompt = await db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId);
    const [row] = await tx.select({ productId: seller_visibility_boosts.productId })
      .from(seller_visibility_boosts).where(and(
        eq(seller_visibility_boosts.id, promptId),
        eq(seller_visibility_boosts.sellerId, sellerId),
        eq(seller_visibility_boosts.status, "prompt"),
      )).limit(1);
    if (!row) throw new OrderError(404, "Boost prompt not found");
    return row;
  });
  return queueSellerVisibilityBoost(sellerId, prompt.productId, "price_reduction", promptId);
}
