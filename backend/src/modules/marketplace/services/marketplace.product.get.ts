import { and, eq, gt, gte, isNotNull, lte, sql } from "drizzle-orm";
import { db } from "../../../db";
import { listing_cycles, sellers_product, sellers_profile, user } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";
import { getProductImageDisplayUrl } from "../../../utils/product-image";
import { calculateVisibilityScore } from "../../../utils/visibility-score";
import { normalizeVegetableName } from "../../../utils/vegetable-identity";

export async function getMarketplaceProduct(productId: string) {
  const rows = await db.select({ id: sellers_product.id })
    .from(sellers_product)
    .innerJoin(user, eq(user.id, sellers_product.userId))
    .innerJoin(sellers_profile, eq(sellers_profile.userId, sellers_product.userId))
    .where(and(
      eq(sellers_product.id, productId),
      eq(sellers_product.isActive, true),
      eq(sellers_product.isMarketable, true),
      isNotNull(sellers_product.productPrice),
      gt(sellers_product.productPrice, "0"),
      eq(user.isActive, true),
      eq(user.emailVerified, true),
      sql`'seller' = ANY(coalesce(${user.role}, ARRAY[]::"role"[]))`,
      eq(sellers_profile.isCurrent, true),
      sql`length(btrim(${sellers_profile.shopName})) > 0`,
      sql`length(btrim(${sellers_profile.detailAddress})) > 0`,
      sql`length(btrim(coalesce(${sellers_profile.phoneNumber}, ''))) >= 7`,
      isNotNull(sellers_profile.latitude),
      isNotNull(sellers_profile.longitude),
    ))
    .limit(1);
  if (!rows[0]) throw new OrderError(404, "Marketplace product not found");

  const [detail] = await db.select()
    .from(sellers_product)
    .innerJoin(user, eq(user.id, sellers_product.userId))
    .innerJoin(sellers_profile, eq(sellers_profile.userId, sellers_product.userId))
    .where(eq(sellers_product.id, productId))
    .limit(1);
  if (!detail) throw new OrderError(404, "Marketplace product not found");
  const productRow = detail.sellers_product;
  const profile = detail.sellers_profile;
  const evaluatedAt = new Date();
  const since = new Date(evaluatedAt.getTime() - 30 * 24 * 60 * 60 * 1000);
  const cycles = await db.select({
    id: listing_cycles.id,
    productId: listing_cycles.productId,
    vegetableKey: listing_cycles.vegetableKey,
    startedAt: listing_cycles.startedAt,
  }).from(listing_cycles).innerJoin(sellers_product, eq(listing_cycles.productId, sellers_product.id))
    .where(and(
      eq(sellers_product.userId, profile.userId),
      gte(listing_cycles.startedAt, since),
      lte(listing_cycles.startedAt, evaluatedAt),
    ));
  const currentCycle = cycles.filter((cycle) => cycle.productId === productId &&
    productRow.publishedAt && cycle.startedAt <= evaluatedAt)
    .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())[0];
  const vegetableKey = currentCycle?.vegetableKey ?? normalizeVegetableName(productRow.productName);
  const priorCycles = cycles.filter((cycle) => cycle.vegetableKey === vegetableKey &&
    cycle.startedAt < (productRow.publishedAt ?? evaluatedAt) && cycle.id !== currentCycle?.id).length;
  const visibility = calculateVisibilityScore({
    evaluatedAt,
    publishedAt: productRow.publishedAt,
    quantity: Number(productRow.productQty),
    originalQuantity: Number(productRow.originalQty),
    priorCycles,
  });
  return {
    id: productRow.id,
    productName: productRow.productName,
    imageUrl: await getProductImageDisplayUrl(productRow.imagUrl, profile.userId),
    productPrice: productRow.productPrice,
    basePrice: productRow.basePrice,
    productQty: productRow.productQty,
    scalingType: productRow.scalingType,
    productType: productRow.productType,
    condition: productRow.condition,
    visibilityScore: visibility ? Number(visibility.score.toFixed(4)) : null,
    visibilityTier: visibility?.tier ?? null,
    visibilityEvaluatedAt: evaluatedAt.toISOString(),
    availability: Number(productRow.productQty ?? 0) > 0 ? "available" : "sold_out",
    seller: {
      id: profile.userId,
      name: detail.user.name,
      shopName: profile.shopName,
      sellerType: profile.sellerType,
      detailAddress: profile.detailAddress,
      pickupInstructions: profile.pickupInstructions,
      latitude: profile.latitude,
      longitude: profile.longitude,
      distanceKm: null,
    },
  };
}
