import { and, desc, eq, gt, isNotNull, lte, sql } from "drizzle-orm";
import { db } from "../db";
import {
  listing_cycles,
  seller_visibility_boosts,
  sellers_product,
} from "../db/schema";
import { applySellerProductPriceReduction } from "../modules/seller/services/seller.product.price-reduction";
import { createSellerNotification } from "../utils/seller-notifications";

const batchSize = 100;

export async function applySellerPriceReductions() {
  const products = await db.select({ id: sellers_product.id })
    .from(sellers_product)
    .where(and(
      eq(sellers_product.isActive, true),
      eq(sellers_product.isMarketable, true),
      gt(sellers_product.productQty, "0"),
      gt(sellers_product.priceReductionPercent, "0"),
      isNotNull(sellers_product.minimumPrice),
      isNotNull(sellers_product.priceScheduleStartedAt),
      lte(sql`${sellers_product.priceScheduleStartedAt} + (${sellers_product.priceReductionPeriodsApplied} + 1) * interval '12 hours'`, sql`now()`),
    )).limit(batchSize);

  let checked = 0;
  let reduced = 0;
  let promptsCreated = 0;

  for (const product of products) {
    const result = await db.transaction(async (tx) => {
      const [before] = await tx.select().from(sellers_product)
        .where(eq(sellers_product.id, product.id)).for("update").limit(1);
      if (!before || !before.isActive || !before.isMarketable || Number(before.productQty ?? 0) <= 0) return null;

      const updated = await applySellerProductPriceReduction(tx, product.id);
      if (!updated || updated.priceReductionPeriodsApplied <= before.priceReductionPeriodsApplied ||
        Number(updated.productPrice ?? 0) >= Number(before.productPrice ?? 0)) return { reduced: false, prompt: false };

      await createSellerNotification(tx, {
        sellerId: before.userId,
        kind: "price_lowered",
        dedupeKey: `price-lowered:${product.id}:${updated.priceReductionPeriodsApplied}`,
        productId: product.id,
        payload: { productName: before.productName, priceAfter: updated.productPrice },
      });

      const [cycle] = await tx.select({ id: listing_cycles.id }).from(listing_cycles)
        .where(eq(listing_cycles.productId, product.id))
        .orderBy(desc(listing_cycles.startedAt)).limit(1);
      if (!cycle) return { reduced: true, prompt: false };

      const boostKey = `${cycle.id}:reduction:${updated.priceReductionPeriodsApplied}`;
      const [prompt] = await tx.insert(seller_visibility_boosts).values({
        listingCycleId: cycle.id,
        productId: product.id,
        sellerId: before.userId,
        reason: "price_reduction",
        reductionPeriod: updated.priceReductionPeriodsApplied,
        boostKey,
        status: "prompt",
        nextAttemptAt: new Date(),
        priceBefore: before.productPrice,
        priceAfter: updated.productPrice,
      }).onConflictDoNothing({ target: seller_visibility_boosts.boostKey }).returning({
        id: seller_visibility_boosts.id,
      });
      if (!prompt) return { reduced: true, prompt: false };

      return { reduced: true, prompt: true };
    });

    if (result === null) continue;
    checked++;
    if (result.reduced) reduced++;
    if (result.prompt) promptsCreated++;
  }

  return { checked, reduced, promptsCreated };
}
