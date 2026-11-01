import { and, desc, eq, lte } from "drizzle-orm";
import { db } from "../../../db";
import { listing_cycles, seller_visibility_boosts, sellers_product } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";
import { getFirstPostCooldownEnd } from "../../../utils/boost-cooldown";
import { isBoostStuck } from "./seller.visibility-boost.used";
import { requireVerifiedSeller } from "../../../utils/seller-access";

// A second first post soon after the last one looks like spam on the Page.
async function requireFirstPostGap(tx: Parameters<typeof getFirstPostCooldownEnd>[0], productId: string) {
  const waitUntil = await getFirstPostCooldownEnd(tx, productId);
  if (!waitUntil) return;
  const hours = Math.max(1, Math.ceil((waitUntil.getTime() - Date.now()) / 3_600_000));
  throw new OrderError(409, `You just boosted this product. Please wait about ${hours} hour${hours === 1 ? "" : "s"} before you boost it again.`);
}

/** One manual Boost per listing cycle. Later price drops are the 6-hour rule's job, not another boost. */
export async function queueSellerVisibilityBoost(sellerId: string, productId: string) {
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

    const currentPeriod = product.priceReductionPeriodsApplied ?? 0;
    const boostKey = `${cycle.id}:initial`;

    const [created] = await tx.insert(seller_visibility_boosts).values({
      listingCycleId: cycle.id,
      productId,
      sellerId,
      reason: "initial",
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
      await requireFirstPostGap(tx, productId);
      return { boostId: created.id, status: created.status, reason: "initial" as const, productId };
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
      if (retried) return { boostId: retried.id, status: retried.status, reason: "initial" as const, productId };
    }

    // Sent to n8n a while ago but nothing was posted (and no post is in progress): send it again.
    if (existing.status === "sent" && await isBoostStuck(tx, { productId, createdAt: existing.createdAt, sentAt: existing.sentAt })) {
      const [resent] = await tx.update(seller_visibility_boosts).set({
        status: "queued", retryCount: 0, nextAttemptAt: now, leaseUntil: null, lastError: null, updatedAt: now,
      }).where(and(
        eq(seller_visibility_boosts.id, existing.id),
        eq(seller_visibility_boosts.status, "sent"),
      )).returning({ id: seller_visibility_boosts.id, status: seller_visibility_boosts.status });
      if (resent) return { boostId: resent.id, status: resent.status, reason: "initial" as const, productId };
    }

    return { boostId: existing.id, status: existing.status, reason: "initial" as const, productId };
  });
}
