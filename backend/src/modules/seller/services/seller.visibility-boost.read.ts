import { and, desc, eq, lte } from "drizzle-orm";
import { db } from "../../../db";
import { listing_cycles, seller_visibility_boosts, sellers_product } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";
import { getFirstPostCooldownEnd, getPriceDropPostCooldownEnd } from "../../../utils/boost-cooldown";
import { countUsedBoosts } from "./seller.visibility-boost.used";
import { readBoostProgress } from "./seller.visibility-boost.progress";
import { readBoostChannels } from "./seller.visibility-boost.channels";
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
      minimumPrice: sellers_product.minimumPrice,
      quantity: sellers_product.productQty,
      unit: sellers_product.scalingType,
      priceReductionAmount: sellers_product.priceReductionAmount,
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
      followUpDueAt: seller_visibility_boosts.followUpDueAt,
    }).from(seller_visibility_boosts)
      .innerJoin(sellers_product, eq(sellers_product.id, seller_visibility_boosts.productId))
      .where(and(
        eq(seller_visibility_boosts.sellerId, sellerId),
        eq(seller_visibility_boosts.productId, productId),
      )).orderBy(desc(seller_visibility_boosts.createdAt)).limit(1);

    const usedPosts = cycle ? await countUsedBoosts(tx, productId, cycle.id) : 0;

    const periodsApplied = product.priceReductionPeriodsApplied ?? 0;
    const maxAllowed = periodsApplied + 1;
    const hasRoom = usedPosts < maxAllowed;
    // Posting is blocked for a few hours after the last post. Say so up front instead of failing on tap.
    const waitUntil = !hasRoom ? null
      : periodsApplied > 0 ? await getPriceDropPostCooldownEnd(tx, productId)
      : boost ? null : await getFirstPostCooldownEnd(tx, productId);
    const waitHours = waitUntil ? Math.max(1, Math.ceil((waitUntil.getTime() - Date.now()) / 3_600_000)) : 0;
    const canBoost = hasRoom && !waitUntil;
    const currentPriceNum = Number(product.currentPrice ?? 0);
    const basePriceNum = Number(product.basePrice ?? product.currentPrice ?? 0);
    const hasDiscount = currentPriceNum < basePriceNum;

    const dropAmount = Number(product.priceReductionAmount ?? 0);
    const dropsOn = dropAmount > 0 && product.minimumPrice !== null;
    const headline = waitUntil ? "Almost Time" : periodsApplied === 0
      ? canBoost ? "Ready to Boost" : "Boost Is Running"
      : canBoost ? "Price Dropped" : "New Price Posted";

    const message = waitUntil
      ? `You just boosted this product. You can boost again in about ${waitHours} hour${waitHours === 1 ? "" : "s"}.`
      : periodsApplied === 0
      ? canBoost
        ? "Post this listing on the Agrivive Facebook Page."
        : dropsOn
          ? "Your listing was posted. The price drops every 6 hours until it reaches your final price."
          : "Your listing was posted on the Agrivive Facebook Page."
      : canBoost
        ? `The price went from ₱${basePriceNum.toFixed(2)} to ₱${currentPriceNum.toFixed(2)}. Post the new price.`
        : "Your new price was posted. The next drop comes by itself.";

    const progress = boost ? (await readBoostProgress(tx, [boost])).get(boost.id) ?? null : null;

    const channels = boost ? await readBoostChannels(tx, boost) : null;

    return {
      product: {
        id: product.id,
        productName: product.productName,
        imageUrl: product.imageUrl,
        currentPrice: currentPriceNum,
        basePrice: basePriceNum,
        quantity: product.quantity === null ? null : Number(product.quantity),
        unit: product.unit,
        priceReductionAmount: dropAmount,
        lowestPrice: product.minimumPrice ? Number(product.minimumPrice) : null,
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
        waitUntil: waitUntil ? waitUntil.toISOString() : null,
      },
      boost: boost ? { ...boost, errorMessage: errorMessage(boost.status), progress, channels } : null,
    };
  });
}
