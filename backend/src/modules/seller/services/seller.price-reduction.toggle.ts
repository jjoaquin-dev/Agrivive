import { and, desc, eq, isNotNull, isNull, sql } from "drizzle-orm";
import { db } from "../../../db";
import { fb_post_logs, seller_visibility_boosts, sellers_product } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";
import { requireVerifiedSeller } from "../../../utils/seller-access";
import { rearmBoostFollowUp } from "../../integrations/services/integrations.visibility-boost.follow-up.rearm";

/** Turns the automatic 6-hour price drops on or off for one product. The amount and final price are kept. */
export async function setSellerPriceReductionEnabled(sellerId: string, productId: string, enabled: boolean) {
  const result = await db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId);
    const [product] = await tx.select().from(sellers_product).where(and(
      eq(sellers_product.id, productId), eq(sellers_product.userId, sellerId),
    )).for("update").limit(1);
    if (!product) throw new OrderError(404, "Product not found");
    if (enabled && (Number(product.priceReductionAmount ?? 0) <= 0 || !product.minimumPrice)) {
      throw new OrderError(409, "Set a drop amount and a final price in Edit Listing first");
    }

    await tx.update(sellers_product).set({ priceReductionEnabled: enabled, updatedAt: new Date() })
      .where(eq(sellers_product.id, productId));
    // Off: the worker must not send the next 6-hour call.
    if (!enabled) {
      await tx.update(seller_visibility_boosts).set({ followUpDueAt: null }).where(and(
        eq(seller_visibility_boosts.productId, productId),
        isNotNull(seller_visibility_boosts.followUpDueAt),
      ));
      return { productId, enabled, boostId: null };
    }

    // On: the newest first boost that already posted and has no timer waits 6 hours from now.
    const [boost] = await tx.select({ id: seller_visibility_boosts.id }).from(seller_visibility_boosts).where(and(
      eq(seller_visibility_boosts.productId, productId),
      eq(seller_visibility_boosts.reason, "initial"),
      eq(seller_visibility_boosts.status, "sent"),
      isNull(seller_visibility_boosts.followUpDueAt),
      sql`exists (select 1 from ${fb_post_logs} where ${fb_post_logs.productId} = ${productId}
        and ${fb_post_logs.status} = 'success' and ${fb_post_logs.postedAt} >= ${seller_visibility_boosts.createdAt})`,
    )).orderBy(desc(seller_visibility_boosts.createdAt)).limit(1);
    return { productId, enabled, boostId: boost?.id ?? null };
  });
  if (result.boostId) await rearmBoostFollowUp(result.boostId);
  return { productId: result.productId, enabled: result.enabled };
}
