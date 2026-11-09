import { and, eq, isNotNull } from "drizzle-orm";
import { db } from "../../../db";
import { seller_visibility_boosts, sellers_product } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";
import { requireVerifiedSeller } from "../../../utils/seller-access";

/**
 * The seller's yes or no to automatic follow-up posts for one listing: the 6-hour price drop post and
 * posting again when the listing ranks again. The first post stays manual. Off stops any waiting follow-up.
 */
export async function setSellerAutoPost(sellerId: string, productId: string, enabled: boolean) {
  return db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId);
    const now = new Date();
    const [updated] = await tx.update(sellers_product).set({
      autoPostEnabled: enabled,
      ...(enabled ? { autoPostAcceptedAt: now } : {}),
      updatedAt: now,
    }).where(and(eq(sellers_product.id, productId), eq(sellers_product.userId, sellerId)))
      .returning({ id: sellers_product.id });
    if (!updated) throw new OrderError(404, "Product not found");
    if (!enabled) {
      await tx.update(seller_visibility_boosts).set({ followUpDueAt: null }).where(and(
        eq(seller_visibility_boosts.productId, productId),
        isNotNull(seller_visibility_boosts.followUpDueAt),
      ));
    }
    return { productId, enabled };
  });
}
