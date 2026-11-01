import { and, desc, eq, isNotNull, isNull, sql } from "drizzle-orm";
import { db } from "../../../db";
import { fb_post_logs, seller_visibility_boosts, sellers_product } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";
import { validatePriceReductionConfig } from "../../../utils/price-reduction";
import { requireVerifiedSeller } from "../../../utils/seller-access";
import { rearmBoostFollowUp } from "../../integrations/services/integrations.visibility-boost.follow-up.rearm";

type DropSetup = { amount?: number; minimumPrice?: number };

/**
 * Turns the automatic 6-hour price drops on or off for one product. A drop amount and a final price can be sent
 * along; otherwise the saved ones are used. Price drops need a Priority Boost first post (saved when it posted).
 */
export async function setSellerPriceReductionEnabled(sellerId: string, productId: string, enabled: boolean, setup: DropSetup = {}) {
  const result = await db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId);
    const [product] = await tx.select().from(sellers_product).where(and(
      eq(sellers_product.id, productId), eq(sellers_product.userId, sellerId),
    )).for("update").limit(1);
    if (!product) throw new OrderError(404, "Product not found");

    const amount = setup.amount ?? Number(product.priceReductionAmount ?? 0);
    const minimumPrice = setup.minimumPrice ?? (product.minimumPrice === null ? null : Number(product.minimumPrice));
    if (setup.amount !== undefined || setup.minimumPrice !== undefined) {
      validatePriceReductionConfig(Number(product.productPrice ?? product.basePrice ?? 0), amount, minimumPrice);
    }
    if (enabled && (amount <= 0 || minimumPrice === null)) {
      throw new OrderError(409, "Set a drop amount and a final price first");
    }

    // The newest first post that went out. Boosts saved before the tier was recorded have no tier and keep working.
    const [boost] = await tx.select({
      id: seller_visibility_boosts.id,
      tier: seller_visibility_boosts.priorityTier,
      setupAt: seller_visibility_boosts.priceDropSetupAt,
      dueAt: seller_visibility_boosts.followUpDueAt,
    }).from(seller_visibility_boosts).where(and(
      eq(seller_visibility_boosts.productId, productId),
      eq(seller_visibility_boosts.reason, "initial"),
      eq(seller_visibility_boosts.status, "sent"),
      sql`exists (select 1 from ${fb_post_logs} where ${fb_post_logs.productId} = ${productId}
        and ${fb_post_logs.status} = 'success' and ${fb_post_logs.postedAt} >= ${seller_visibility_boosts.createdAt})`,
    )).orderBy(desc(seller_visibility_boosts.createdAt)).limit(1);
    if (enabled && boost?.tier && boost.tier !== "Priority Boost") {
      throw new OrderError(409, `Price drops need Priority Boost. This listing was ${boost.tier} when it posted.`);
    }

    await tx.update(sellers_product).set({
      priceReductionEnabled: enabled,
      ...(setup.amount !== undefined ? { priceReductionAmount: amount.toString() } : {}),
      ...(setup.minimumPrice !== undefined ? { minimumPrice: String(minimumPrice) } : {}),
      updatedAt: new Date(),
    }).where(eq(sellers_product.id, productId));

    // Off: the worker must not send the next 6-hour call.
    if (!enabled) {
      await tx.update(seller_visibility_boosts).set({ followUpDueAt: null }).where(and(
        eq(seller_visibility_boosts.productId, productId),
        isNotNull(seller_visibility_boosts.followUpDueAt),
      ));
      return { productId, enabled, boostId: null, dropNow: false };
    }
    if (!boost || boost.dueAt) return { productId, enabled, boostId: null, dropNow: false };

    // Priority listing waiting for its setup: the first drop runs once the 6 hours after the post are up (now, if they are).
    if (boost.setupAt) {
      const now = new Date();
      const dropNow = boost.setupAt <= now;
      await tx.update(seller_visibility_boosts).set({ followUpDueAt: dropNow ? now : boost.setupAt, followUpAttempts: 0, priceDropSetupAt: null })
        .where(and(eq(seller_visibility_boosts.id, boost.id), isNull(seller_visibility_boosts.followUpDueAt)));
      return { productId, enabled, boostId: null, dropNow };
    }
    // An older boost with no setup time: the next drop is 6 hours from now.
    return { productId, enabled, boostId: boost.id, dropNow: false };
  });
  if (result.boostId) await rearmBoostFollowUp(result.boostId);
  return { productId: result.productId, enabled: result.enabled, dropNow: result.dropNow };
}
