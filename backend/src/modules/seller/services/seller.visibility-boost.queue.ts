import { and, desc, eq, lte } from "drizzle-orm";
import { db } from "../../../db";
import { listing_cycles, seller_visibility_boosts, sellers_product } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";
import { getFirstPostCooldownEnd, getPriceDropPostCooldownEnd } from "../../../utils/boost-cooldown";
import { isBoostStuck } from "./seller.visibility-boost.used";
import { requireVerifiedSeller } from "../../../utils/seller-access";

type BoostReason = "initial" | "price_reduction";

// Two price drop posts too close together look like spam on the Page.
async function requirePriceDropGap(tx: Parameters<typeof getPriceDropPostCooldownEnd>[0], productId: string) {
  const waitUntil = await getPriceDropPostCooldownEnd(tx, productId);
  if (!waitUntil) return;
  const hours = Math.max(1, Math.ceil((waitUntil.getTime() - Date.now()) / 3_600_000));
  throw new OrderError(409, `You just boosted the lower price of this product. Please wait about ${hours} hour${hours === 1 ? "" : "s"} before you boost it again.`);
}

// A second first post soon after the last one looks like spam on the Page.
async function requireFirstPostGap(tx: Parameters<typeof getFirstPostCooldownEnd>[0], productId: string) {
  const waitUntil = await getFirstPostCooldownEnd(tx, productId);
  if (!waitUntil) return;
  const hours = Math.max(1, Math.ceil((waitUntil.getTime() - Date.now()) / 3_600_000));
  throw new OrderError(409, `You just boosted this product. Please wait about ${hours} hour${hours === 1 ? "" : "s"} before you boost it again.`);
}

export async function queueSellerVisibilityBoost(
  sellerId: string,
  productId: string,
  reason: BoostReason = "initial",
  promptId?: string,
) {
  return db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId);
    const now = new Date();
    const [product] = await tx.select().from(sellers_product).where(and(
      eq(sellers_product.id, productId),
      eq(sellers_product.userId, sellerId),
    )).for("update").limit(1);
    if (!product) throw new OrderError(404, "Product not found");
    if (!product.isActive || !product.isMarketable || Number(product.productQty ?? 0) <= 0) {
      throw new OrderError(409, "This listing is not available to boost");
    }
    if (!product.imagUrl) throw new OrderError(409, "Add a product photo before boosting visibility");

    const [cycle] = await tx.select({ id: listing_cycles.id }).from(listing_cycles).where(and(
      eq(listing_cycles.productId, productId),
      lte(listing_cycles.startedAt, now),
    )).orderBy(desc(listing_cycles.startedAt)).limit(1);
    if (!cycle) throw new OrderError(409, "This listing cycle is not ready to boost");

    if (promptId) {
      const [prompt] = await tx.select().from(seller_visibility_boosts).where(and(
        eq(seller_visibility_boosts.id, promptId),
        eq(seller_visibility_boosts.sellerId, sellerId),
        eq(seller_visibility_boosts.productId, productId),
        eq(seller_visibility_boosts.status, "prompt"),
      )).for("update").limit(1);
      if (!prompt) throw new OrderError(404, "Boost prompt not found");
      if (prompt.reason === "price_reduction") await requirePriceDropGap(tx, productId);
      const [queued] = await tx.update(seller_visibility_boosts).set({
        status: "queued",
        readAt: now,
        nextAttemptAt: now,
        leaseUntil: null,
        lastError: null,
        updatedAt: now,
      }).where(and(
        eq(seller_visibility_boosts.id, prompt.id),
        eq(seller_visibility_boosts.status, "prompt"),
      )).returning({ id: seller_visibility_boosts.id, status: seller_visibility_boosts.status });
      if (!queued) throw new OrderError(409, "This boost prompt was already handled");
      return { boostId: queued.id, status: queued.status, reason: prompt.reason, productId };
    }

    const currentPeriod = product.priceReductionPeriodsApplied ?? 0;
    const boostKey = currentPeriod === 0 ? `${cycle.id}:initial` : `${cycle.id}:reduction:${currentPeriod}`;
    const boostReason = currentPeriod === 0 ? "initial" : "price_reduction";
    if (boostReason === "price_reduction") await requirePriceDropGap(tx, productId);

    const [created] = await tx.insert(seller_visibility_boosts).values({
      listingCycleId: cycle.id,
      productId,
      sellerId,
      reason: boostReason,
      reductionPeriod: currentPeriod,
      boostKey,
      status: "queued",
      nextAttemptAt: now,
      priceAfter: product.productPrice,
    }).onConflictDoNothing({ target: seller_visibility_boosts.boostKey }).returning({
      id: seller_visibility_boosts.id,
      status: seller_visibility_boosts.status,
    });
    if (created) {
      // Throwing here rolls the new boost back, so nothing is queued.
      if (boostReason === "initial") await requireFirstPostGap(tx, productId);
      return { boostId: created.id, status: created.status, reason: boostReason, productId };
    }

    const [existing] = await tx.select({
      id: seller_visibility_boosts.id,
      status: seller_visibility_boosts.status,
      createdAt: seller_visibility_boosts.createdAt,
      sentAt: seller_visibility_boosts.sentAt,
    }).from(seller_visibility_boosts).where(eq(seller_visibility_boosts.boostKey, boostKey)).limit(1);
    if (!existing) throw new Error("Boost request could not be saved");

    if (existing.status === "failed") {
      const [retried] = await tx.update(seller_visibility_boosts).set({
        status: "queued",
        retryCount: 0,
        nextAttemptAt: now,
        leaseUntil: null,
        lastError: null,
        updatedAt: now,
      }).where(and(
        eq(seller_visibility_boosts.id, existing.id),
        eq(seller_visibility_boosts.status, "failed"),
      )).returning({ id: seller_visibility_boosts.id, status: seller_visibility_boosts.status });
      if (retried) return { boostId: retried.id, status: retried.status, reason: boostReason, productId };
    }

    // Sent to n8n a while ago but nothing was posted (and no post is in progress): send it again.
    if (existing.status === "sent" && await isBoostStuck(tx, { productId, reason: boostReason, createdAt: existing.createdAt, sentAt: existing.sentAt })) {
      const [resent] = await tx.update(seller_visibility_boosts).set({
        status: "queued", retryCount: 0, nextAttemptAt: now, leaseUntil: null, lastError: null, updatedAt: now,
      }).where(and(
        eq(seller_visibility_boosts.id, existing.id),
        eq(seller_visibility_boosts.status, "sent"),
      )).returning({ id: seller_visibility_boosts.id, status: seller_visibility_boosts.status });
      if (resent) return { boostId: resent.id, status: resent.status, reason: boostReason, productId };
    }

    if (existing.status === "prompt") {
      const [accepted] = await tx.update(seller_visibility_boosts).set({
        status: "queued",
        readAt: now,
        nextAttemptAt: now,
        leaseUntil: null,
        lastError: null,
        updatedAt: now,
      }).where(eq(seller_visibility_boosts.id, existing.id)).returning({ id: seller_visibility_boosts.id, status: seller_visibility_boosts.status });
      if (accepted) return { boostId: accepted.id, status: accepted.status, reason: boostReason, productId };
    }

    return { boostId: existing.id, status: existing.status, reason: boostReason, productId };
  });
}
