import { and, eq, inArray, sql } from "drizzle-orm";
import { db } from "../../../db";
import { product_reviews, sellers_product, sellers_profile, user } from "../../../db/schema";
import { ahpTopsisPolicyVersion } from "../../../utils/ahp-topsis";
import { getProductImageDisplayUrl } from "../../../utils/product-image";
import { loadEligibleVisibilityCandidates } from "../../../utils/visibility-ranking/load";
import { rankVisibilityCandidates } from "../../../utils/visibility-ranking";
import { serializeProduct } from "./marketplace.products.list";

// A deal is priced at most 70% of the base price (30%+ off).
const dealPriceRatio = 0.7;

export async function listMarketplaceDeals(limit: number) {
  const evaluatedAt = new Date();
  const candidates = await loadEligibleVisibilityCandidates(evaluatedAt);
  if (!candidates.length) return { products: [], evaluatedAt: evaluatedAt.toISOString() };

  const ranking = rankVisibilityCandidates(candidates.map((candidate) => ({
    id: candidate.cycleId, publishedAt: candidate.publishedAt, criteria: candidate.criteria,
  })));
  const productIdByCycle = new Map(candidates.map((candidate) => [candidate.cycleId, candidate.productId]));
  const priorityResults = ranking.results.filter((result) => result.tier === "Priority Boost");
  const scoreByProduct = new Map(priorityResults.map((result) => [productIdByCycle.get(result.id)!, result.score]));
  const orderedProductIds = priorityResults.map((result) => productIdByCycle.get(result.id)!);

  const rows = orderedProductIds.length ? await db.select({
    id: sellers_product.id, productName: sellers_product.productName, imagUrl: sellers_product.imagUrl,
    productPrice: sellers_product.productPrice, basePrice: sellers_product.basePrice,
    productQty: sellers_product.productQty, scalingType: sellers_product.scalingType,
    productType: sellers_product.productType, condition: sellers_product.condition,
    sellerId: sellers_profile.userId, sellerName: user.name, shopName: sellers_profile.shopName,
    detailAddress: sellers_profile.detailAddress, pickupInstructions: sellers_profile.pickupInstructions,
    latitude: sellers_profile.latitude, longitude: sellers_profile.longitude,
  }).from(sellers_product)
    .innerJoin(user, eq(user.id, sellers_product.userId))
    .innerJoin(sellers_profile, and(eq(sellers_profile.userId, sellers_product.userId), eq(sellers_profile.isCurrent, true)))
    .where(inArray(sellers_product.id, orderedProductIds)) : [];
  const rowsById = new Map(rows.map((row) => [row.id, row]));

  // Keep AHP order; drop anything not priced low enough.
  const deals = orderedProductIds.flatMap((id) => {
    const row = rowsById.get(id);
    if (!row || !row.basePrice || Number(row.productPrice) > Number(row.basePrice) * dealPriceRatio) return [];
    return [row];
  }).slice(0, limit);

  const ratingRows = deals.length ? await db.select({
    productId: product_reviews.productId,
    count: sql<number>`count(*)::int`,
    average: sql<string>`round(avg(${product_reviews.rating})::numeric, 1)::text`,
  }).from(product_reviews).where(inArray(product_reviews.productId, deals.map((row) => row.id)))
    .groupBy(product_reviews.productId) : [];
  const ratingsByProduct = new Map(ratingRows.map((rating) => [rating.productId, rating]));

  const products = await Promise.all(deals.map(async (row) => {
    const rating = ratingsByProduct.get(row.id);
    return serializeProduct(
      row,
      await getProductImageDisplayUrl(row.imagUrl, row.sellerId),
      null,
      { average: rating?.average ?? null, count: rating?.count ?? 0 },
      ahpTopsisPolicyVersion,
      scoreByProduct.get(row.id) ?? null,
    );
  }));
  return { products, evaluatedAt: evaluatedAt.toISOString() };
}
