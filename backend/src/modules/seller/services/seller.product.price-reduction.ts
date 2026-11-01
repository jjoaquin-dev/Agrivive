import { and, asc, eq, isNotNull } from "drizzle-orm";
import { seller_visibility_boosts, sellers_product } from "../../../db/schema";
import type { OrderTransaction } from "../../../utils/order-types";

/**
 * Reads a product with the time of its next price drop.
 * Prices only drop through the 6-hour Boost rule, so the next drop is the
 * earliest pending boost follow-up, or null when nothing is scheduled.
 */
export async function readSellerProductPriceDrop(tx: OrderTransaction, productId: string) {
  const [product] = await tx.select().from(sellers_product)
    .where(eq(sellers_product.id, productId)).limit(1);
  if (!product) return null;

  const [next] = await tx.select({ dueAt: seller_visibility_boosts.followUpDueAt })
    .from(seller_visibility_boosts)
    .where(and(
      eq(seller_visibility_boosts.productId, productId),
      isNotNull(seller_visibility_boosts.followUpDueAt),
    ))
    .orderBy(asc(seller_visibility_boosts.followUpDueAt)).limit(1);

  return { ...product, nextPriceReductionAt: next?.dueAt ? next.dueAt.toISOString() : null };
}
