import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { seller_visibility_boosts } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";
import { requireVerifiedSeller } from "../../../utils/seller-access";
import { readPriceDropNow } from "./seller.price-reduction.drop-now.read";

/**
 * Brings the next 6-hour round forward to now. The worker then sends the same `follow_up` call
 * it would send later, so n8n lowers the price by the seller's amount and posts it.
 */
export async function requestSellerPriceDropNow(sellerId: string, productId: string) {
  return db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId);
    const check = await readPriceDropNow(tx, sellerId, productId);
    if (!check.available) throw new OrderError(check.message === "Product not found" ? 404 : 409, check.message);
    await tx.update(seller_visibility_boosts).set({ followUpDueAt: new Date(), followUpAttempts: 0 })
      .where(eq(seller_visibility_boosts.id, check.boostId));
    return { boostId: check.boostId, productId };
  });
}
