import { and, desc, eq, lte } from "drizzle-orm";
import { db } from "../../../db";
import { listing_cycles, seller_visibility_boosts, sellers_product } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";
import { getFirstPostCooldownEnd } from "../../../utils/boost-cooldown";
import { countUsedBoosts } from "./seller.visibility-boost.used";
import { readPriceDropNow } from "./seller.price-reduction.drop-now.read";
import { readBoostProgress } from "./seller.visibility-boost.progress";
import { readBoostChannels } from "./seller.visibility-boost.channels";
import { requireVerifiedSeller } from "../../../utils/seller-access";
import { checkPriorityBoostGate } from "../../../utils/visibility-ranking/boost-gate";

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
      priceReductionEnabled: sellers_product.priceReductionEnabled,
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
    // One manual Boost per listing. Price drops after it are the 6-hour rule's job.
    const hasRoom = usedPosts < 1;
    // Posting is blocked for a few hours after the last first post. Say so up front instead of failing on tap.
    const waitUntil = hasRoom && !boost ? await getFirstPostCooldownEnd(tx, productId) : null;
    const waitHours = waitUntil ? Math.max(1, Math.ceil((waitUntil.getTime() - Date.now()) / 3_600_000)) : 0;
    // Only a Priority Boost listing can start a boost. A boost that already exists for this cycle (for example a failed one) can still be retried.
    const [started] = cycle ? await tx.select({ id: seller_visibility_boosts.id }).from(seller_visibility_boosts)
      .where(eq(seller_visibility_boosts.boostKey, `${cycle.id}:initial`)).limit(1) : [];
    const gate = hasRoom && !waitUntil && !started ? await checkPriorityBoostGate(productId, now) : null;
    const canBoost = hasRoom && !waitUntil && (gate ? gate.allowed : true);
    const currentPriceNum = Number(product.currentPrice ?? 0);
    const basePriceNum = Number(product.basePrice ?? product.currentPrice ?? 0);
    const hasDiscount = currentPriceNum < basePriceNum;

    const dropAmount = product.priceReductionEnabled ? Number(product.priceReductionAmount ?? 0) : 0;
    const dropsOn = dropAmount > 0 && product.minimumPrice !== null;
    const headline = waitUntil ? "Almost Time" : gate && !gate.allowed ? gate.headline : canBoost ? "Ready to Boost" : "Boost Is Running";

    const message = waitUntil
      ? `You just boosted this product. You can boost again in about ${waitHours} hour${waitHours === 1 ? "" : "s"}.`
      : gate && !gate.allowed
        ? gate.message
      : canBoost
        ? "Post this listing on the Agrivive Facebook Page."
        : dropsOn
          ? "Your listing was posted. The price drops every 6 hours until it reaches your final price."
          : "Your listing was posted on the Agrivive Facebook Page.";

    const priceDrop = await readPriceDropNow(tx, sellerId, productId);

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
        maxAllowedPosts: 1,
        headline,
        message,
        badge: canBoost ? ("available" as const) : ("boosted" as const),
        waitUntil: waitUntil ? waitUntil.toISOString() : null,
        priceDrop: { available: priceDrop.available, message: priceDrop.message, waitUntil: priceDrop.waitUntil },
      },
      boost: boost ? { ...boost, errorMessage: errorMessage(boost.status), progress, channels } : null,
    };
  });
}
