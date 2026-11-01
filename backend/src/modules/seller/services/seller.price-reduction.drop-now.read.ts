import { and, desc, eq, gte, isNotNull, lte } from "drizzle-orm";
import { fb_post_logs, listing_cycles, seller_visibility_boosts, sellers_product } from "../../../db/schema";
import { getPriceDropPostCooldownEnd } from "../../../utils/boost-cooldown";
import type { OrderTransaction } from "../../../utils/order-types";

export type DropNow =
  | { available: true; boostId: string; message: null; waitUntil: null }
  | { available: false; boostId: null; message: string; waitUntil: string | null };

const no = (message: string, waitUntil: Date | null = null): DropNow =>
  ({ available: false, boostId: null, message, waitUntil: waitUntil ? waitUntil.toISOString() : null });

/** Can the seller lower the price right now, instead of waiting for the next 6-hour round? */
export async function readPriceDropNow(tx: OrderTransaction, sellerId: string, productId: string): Promise<DropNow> {
  const [product] = await tx.select().from(sellers_product).where(and(
    eq(sellers_product.id, productId), eq(sellers_product.userId, sellerId),
  )).limit(1);
  if (!product) return no("Product not found");
  if (!product.isActive || !product.isMarketable || Number(product.productQty ?? 0) <= 0) return no("This listing is not available");
  if (!product.priceReductionEnabled || Number(product.priceReductionAmount ?? 0) <= 0 || !product.minimumPrice) {
    return no("Automatic price drops are off for this listing");
  }
  if (Number(product.productPrice ?? 0) <= Number(product.minimumPrice)) return no("The price is already at your final price");

  const [cycle] = await tx.select({ id: listing_cycles.id }).from(listing_cycles).where(and(
    eq(listing_cycles.productId, productId), lte(listing_cycles.startedAt, new Date()),
  )).orderBy(desc(listing_cycles.startedAt)).limit(1);
  if (!cycle) return no("Boost this listing first");

  // The boost whose 6-hour rule is running, and it must already have its first post out.
  const [boost] = await tx.select({ id: seller_visibility_boosts.id, createdAt: seller_visibility_boosts.createdAt })
    .from(seller_visibility_boosts).where(and(
      eq(seller_visibility_boosts.productId, productId),
      eq(seller_visibility_boosts.listingCycleId, cycle.id),
      eq(seller_visibility_boosts.reason, "initial"),
      eq(seller_visibility_boosts.status, "sent"),
    )).orderBy(desc(seller_visibility_boosts.createdAt)).limit(1);
  if (!boost) return no("Boost this listing first");
  const [firstPost] = await tx.select({ id: fb_post_logs.id }).from(fb_post_logs).where(and(
    eq(fb_post_logs.productId, productId), eq(fb_post_logs.postType, "first_post"),
    eq(fb_post_logs.status, "success"), gte(fb_post_logs.postedAt, boost.createdAt), isNotNull(fb_post_logs.facebookPostId),
  )).limit(1);
  if (!firstPost) return no("Wait for your first post to go out");

  const waitUntil = await getPriceDropPostCooldownEnd(tx, productId);
  if (waitUntil) {
    const hours = Math.max(1, Math.ceil((waitUntil.getTime() - Date.now()) / 3_600_000));
    return no(`A lower price was just posted. You can lower it again in about ${hours} hour${hours === 1 ? "" : "s"}.`, waitUntil);
  }
  return { available: true, boostId: boost.id, message: null, waitUntil: null };
}
