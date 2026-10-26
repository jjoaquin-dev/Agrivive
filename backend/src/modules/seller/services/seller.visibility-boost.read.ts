import { and, desc, eq, inArray, lte } from "drizzle-orm";
import { db } from "../../../db";
import { listing_cycles, seller_social_campaigns, seller_visibility_boosts, sellers_product } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";
import { requireVerifiedSeller } from "../../../utils/seller-access";

function errorMessage(status: string) {
  return status === "failed" ? "We could not send this boost. You can try again." : null;
}

export async function readSellerVisibilityBoost(sellerId: string, productId: string) {
  return db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId);
    const now = new Date();
    const [product] = await tx.select({
      id: sellers_product.id,
      productName: sellers_product.productName,
      imageUrl: sellers_product.imagUrl,
      currentPrice: sellers_product.productPrice,
      basePrice: sellers_product.basePrice,
      priceReductionPercent: sellers_product.priceReductionPercent,
      priceReductionPeriodsApplied: sellers_product.priceReductionPeriodsApplied,
    }).from(sellers_product).where(and(
      eq(sellers_product.id, productId),
      eq(sellers_product.userId, sellerId),
    )).limit(1);
    if (!product) throw new OrderError(404, "Product not found");

    const [cycle] = await tx.select({ id: listing_cycles.id }).from(listing_cycles).where(and(
      eq(listing_cycles.productId, productId),
      lte(listing_cycles.startedAt, now),
    )).orderBy(desc(listing_cycles.startedAt)).limit(1);

    const [boost] = await tx.select({
      id: seller_visibility_boosts.id,
      productId: seller_visibility_boosts.productId,
      productName: sellers_product.productName,
      imageUrl: sellers_product.imagUrl,
      reason: seller_visibility_boosts.reason,
      reductionPeriod: seller_visibility_boosts.reductionPeriod,
      status: seller_visibility_boosts.status,
      priceBefore: seller_visibility_boosts.priceBefore,
      priceAfter: seller_visibility_boosts.priceAfter,
      createdAt: seller_visibility_boosts.createdAt,
      sentAt: seller_visibility_boosts.sentAt,
    }).from(seller_visibility_boosts)
      .innerJoin(sellers_product, eq(sellers_product.id, seller_visibility_boosts.productId))
      .where(and(
        eq(seller_visibility_boosts.sellerId, sellerId),
        eq(seller_visibility_boosts.productId, productId),
      )).orderBy(desc(seller_visibility_boosts.createdAt)).limit(1);

    const publishedCampaigns = cycle ? await tx.select({ id: seller_social_campaigns.id })
      .from(seller_social_campaigns).where(and(
        eq(seller_social_campaigns.productId, productId),
        eq(seller_social_campaigns.listingCycleId, cycle.id),
        inArray(seller_social_campaigns.status, ["published", "queued", "publishing", "processing"]),
      )) : [];

    const periodsApplied = product.priceReductionPeriodsApplied ?? 0;
    const maxAllowed = periodsApplied + 1;
    const usedPosts = publishedCampaigns.length;
    const canBoost = usedPosts < maxAllowed;
    const currentPriceNum = Number(product.currentPrice ?? 0);
    const basePriceNum = Number(product.basePrice ?? product.currentPrice ?? 0);
    const hasDiscount = currentPriceNum < basePriceNum;

    const headline = periodsApplied === 0
      ? canBoost ? "Initial Post Available" : "Initial Post Already Sent"
      : canBoost ? "12-Hour Price Drop Ready to Boost" : "Price Drop Boost Sent";

    const message = periodsApplied === 0
      ? canBoost
        ? "Post this new listing 1 time to Agrivive official pages."
        : "Initial post already sent (1 of 1 used). Next boost unlocks when price drops after 12 hours."
      : canBoost
        ? `12-Hour price drop applied (₱${basePriceNum.toFixed(2)} → ₱${currentPriceNum.toFixed(2)})! Ready to boost (1 time for this price drop).`
        : `Already boosted for Price Drop #${periodsApplied}. Next boost unlocks on the next price reduction.`;

    return {
      product: {
        id: product.id,
        productName: product.productName,
        imageUrl: product.imageUrl,
        currentPrice: currentPriceNum,
        basePrice: basePriceNum,
        priceReductionPercent: Number(product.priceReductionPercent ?? 0),
        priceReductionPeriodsApplied: periodsApplied,
      },
      pricing: {
        currentPrice: currentPriceNum,
        basePrice: basePriceNum,
        priceBefore: boost?.priceBefore ? Number(boost.priceBefore) : basePriceNum,
        priceAfter: boost?.priceAfter ? Number(boost.priceAfter) : currentPriceNum,
        hasDiscount,
        reductionPeriodsApplied: periodsApplied,
      },
      eligibility: {
        canBoost,
        hasInitialBoost: usedPosts >= 1,
        usedPosts,
        maxAllowedPosts: maxAllowed,
        stage: periodsApplied > 0 ? ("price_reduction" as const) : ("initial" as const),
        headline,
        message,
        badge: canBoost ? ("available" as const) : ("boosted" as const),
      },
      boost: boost ? { ...boost, errorMessage: errorMessage(boost.status) } : null,
    };
  });
}
