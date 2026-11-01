import { and, desc, eq, gt, gte, ilike, inArray, isNotNull, lte, or, sql } from "drizzle-orm";
import { db } from "../../../db";
import { order_reviews, product_reviews, sellers_product, sellers_profile, user, vegetable_catalog } from "../../../db/schema";
import { ahpTopsisPolicyVersion } from "../../../utils/ahp-topsis";
import { OrderError } from "../../../utils/order-types";
import { marketplaceVisibilityScoreSql } from "../../../utils/visibility-score";
import { marketplacePriorCyclesSql } from "../../../utils/visibility-score";
import { getProductImageDisplayUrl } from "../../../utils/product-image";
import type { MarketplaceProductsQuery } from "../model/marketplace.products";
import { marketplaceDistanceExpression } from "./marketplace.distance";
import { marketplaceSellerVisibility } from "./marketplace.visibility";
import { rankMarketplaceProductsWithAHP } from "./marketplace.products.visibility";

type MarketplaceCursor = { evaluatedAt: Date; score: number | null; publishedAt: Date; id: string };
type MarketplaceVisibilityPolicy = "visibility-v4" | typeof ahpTopsisPolicyVersion;
const ahpCandidateLimit = 500;

function encodeCursor(value: MarketplaceCursor) {
  return Buffer.from(JSON.stringify({
    evaluatedAt: value.evaluatedAt.toISOString(), score: value.score,
    publishedAt: value.publishedAt.toISOString(), id: value.id,
  })).toString("base64url");
}

function decodeCursor(cursor: string): MarketplaceCursor {
  try {
    const value = JSON.parse(Buffer.from(cursor, "base64url").toString("utf8")) as {
      evaluatedAt?: string; score?: number | null; publishedAt?: string; id?: string;
    };
    const evaluatedAt = value.evaluatedAt ? new Date(value.evaluatedAt) : null;
    const publishedAt = value.publishedAt ? new Date(value.publishedAt) : null;
    if (!evaluatedAt || !publishedAt || Number.isNaN(evaluatedAt.getTime()) ||
      Number.isNaN(publishedAt.getTime()) || evaluatedAt.getTime() > Date.now() + 60_000 ||
      evaluatedAt.getTime() < Date.now() - 60 * 60_000 ||
      !value.id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value.id) ||
      (value.score !== null && (typeof value.score !== "number" || value.score < 0 || value.score > 1))) throw new Error();
    return { evaluatedAt, publishedAt, score: value.score ?? null, id: value.id };
  } catch {
    throw new OrderError(400, "Invalid marketplace cursor");
  }
}

function validateRanges(query: MarketplaceProductsQuery) {
  if (query.minPrice !== undefined && query.maxPrice !== undefined && query.minPrice > query.maxPrice) {
    throw new OrderError(400, "Minimum price cannot exceed maximum price");
  }
  if (query.minQuantity !== undefined && query.maxQuantity !== undefined && query.minQuantity > query.maxQuantity) {
    throw new OrderError(400, "Minimum quantity cannot exceed maximum quantity");
  }
  const hasLocation = query.latitude !== undefined || query.longitude !== undefined || query.radiusKm !== undefined;
  if (hasLocation && (query.latitude === undefined || query.longitude === undefined || query.radiusKm === undefined)) {
    throw new OrderError(400, "Latitude, longitude, and radiusKm are required together");
  }
}

function scoreTier(score: number | null, policyVersion: MarketplaceVisibilityPolicy) {
  if (score === null) return null;
  const priorityThreshold = policyVersion === ahpTopsisPolicyVersion ? .60 : .70;
  return score >= priorityThreshold ? "priority" : score >= .40 ? "standard" : "basic";
}

function cursorCondition(scoreSql: ReturnType<typeof marketplaceVisibilityScoreSql>, cursor: MarketplaceCursor) {
  const dateOrder = or(
    sql`${sellers_product.publishedAt} < ${cursor.publishedAt}`,
    and(eq(sellers_product.publishedAt, cursor.publishedAt), sql`${sellers_product.id} < ${cursor.id}`),
  );
  if (cursor.score === null) return sql`(${scoreSql} is null and ${dateOrder})`;
  return or(
    sql`${scoreSql} < ${cursor.score}`,
    sql`${scoreSql} is null`,
    and(sql`${scoreSql} = ${cursor.score}`, dateOrder),
  )!;
}

export function serializeProduct(row: any, imageUrl: string | null, distanceKm: number | null,
  rating: { average: string | null; count: number }, policyVersion: MarketplaceVisibilityPolicy,
  calculatedScore?: number | null) {
  const rawScore = calculatedScore === undefined ? row.visibilityScore : calculatedScore;
  const visibilityScore = rawScore === null ? null : Number(rawScore);
  return {
    id: row.id,
    productName: row.productName,
    imageUrl,
    productPrice: row.productPrice,
    basePrice: row.basePrice,
    productQty: row.productQty,
    scalingType: row.scalingType,
    productType: row.productType,
    condition: row.condition,
    availability: Number(row.productQty ?? 0) > 0 ? "available" : "sold_out",
    visibilityScore: visibilityScore === null ? null : Number(visibilityScore.toFixed(4)),
    visibilityTier: scoreTier(visibilityScore, policyVersion),
    visibilityPolicyVersion: policyVersion,
    averageRating: rating.average,
    reviewCount: rating.count,
    seller: {
      id: row.sellerId, name: row.sellerName, shopName: row.shopName,
      detailAddress: row.detailAddress,
      pickupInstructions: row.pickupInstructions, latitude: row.latitude,
      longitude: row.longitude, distanceKm,
    },
  };
}

export async function listMarketplaceProducts(query: MarketplaceProductsQuery) {
  validateRanges(query);
  const cursor = query.cursor ? decodeCursor(query.cursor) : null;
  const evaluatedAt = cursor?.evaluatedAt ?? new Date();
  const since = new Date(evaluatedAt.getTime() - 30 * 24 * 60 * 60 * 1000);
  const useAHP = process.env.VISIBILITY_POLICY?.trim().toLowerCase() === ahpTopsisPolicyVersion;
  const policyVersion: MarketplaceVisibilityPolicy = useAHP ? ahpTopsisPolicyVersion : "visibility-v4";
  const visibilityScore = marketplaceVisibilityScoreSql(evaluatedAt, since);
  const conditions = [
    eq(sellers_product.isActive, true), eq(sellers_product.isMarketable, true),
    gt(sellers_product.productQty, "0"), gt(sellers_product.productPrice, "0"),
    isNotNull(sellers_product.publishedAt), eq(user.isActive, true), eq(user.emailVerified, true),
    marketplaceSellerVisibility(),
  ];
  const search = query.search?.trim();
  if (query.sellerId) conditions.push(eq(sellers_profile.userId, query.sellerId));
  if (search) {
    const pattern = `%${search}%`;
    conditions.push(or(
      ilike(sellers_product.productName, pattern),
      ilike(vegetable_catalog.filipinoName, pattern),
      ilike(vegetable_catalog.englishName, pattern),
      ilike(vegetable_catalog.searchText, pattern),
    )!);
  }
  if (query.productType) conditions.push(eq(sellers_product.productType, query.productType));
  if (query.unit) conditions.push(eq(sellers_product.scalingType, query.unit));
  if (query.minPrice !== undefined) conditions.push(gte(sellers_product.productPrice, query.minPrice.toString()));
  if (query.maxPrice !== undefined) conditions.push(lte(sellers_product.productPrice, query.maxPrice.toString()));
  if (query.minQuantity !== undefined) conditions.push(gte(sellers_product.productQty, query.minQuantity.toString()));
  if (query.maxQuantity !== undefined) conditions.push(lte(sellers_product.productQty, query.maxQuantity.toString()));
  const distanceKm = query.latitude !== undefined && query.longitude !== undefined
    ? marketplaceDistanceExpression(query.latitude, query.longitude) : null;
  if (distanceKm && query.radiusKm !== undefined) conditions.push(lte(distanceKm, query.radiusKm));
  if (cursor && !useAHP) conditions.push(cursorCondition(visibilityScore, cursor));

  const limit = query.limit ?? 20;
  const rows = await db.select({
    id: sellers_product.id, productName: sellers_product.productName, imagUrl: sellers_product.imagUrl,
    productPrice: sellers_product.productPrice, basePrice: sellers_product.basePrice,
    productQty: sellers_product.productQty, originalQty: sellers_product.originalQty, scalingType: sellers_product.scalingType,
    productType: sellers_product.productType, condition: sellers_product.condition,
    publishedAt: sellers_product.publishedAt, visibilityScore,
    ahpPriorCycles: useAHP ? marketplacePriorCyclesSql(evaluatedAt, since) : sql<number>`0`,
    sellerReliability: useAHP ? sql<number>`coalesce((
      select avg(${order_reviews.rating})::double precision / 5.0
      from ${order_reviews}
      where ${order_reviews.sellerId} = ${sellers_product.userId}
    ), 0.5)` : sql<number>`0.5`,
    sellerId: sellers_profile.userId, sellerName: user.name, shopName: sellers_profile.shopName,
    detailAddress: sellers_profile.detailAddress,
    pickupInstructions: sellers_profile.pickupInstructions, latitude: sellers_profile.latitude,
    longitude: sellers_profile.longitude, distanceKm: distanceKm ?? sql<null>`null`,
  }).from(sellers_product).innerJoin(user, eq(user.id, sellers_product.userId))
    .innerJoin(sellers_profile, eq(sellers_profile.userId, sellers_product.userId))
    .leftJoin(vegetable_catalog, eq(vegetable_catalog.id, sellers_product.vegetableCatalogId))
    .where(and(...conditions))
    .orderBy(...(useAHP
      ? [desc(sellers_product.publishedAt), desc(sellers_product.id)]
      : [sql`${visibilityScore} desc nulls last`, desc(sellers_product.publishedAt), desc(sellers_product.id)]))
    .limit(useAHP ? ahpCandidateLimit : limit + 1);

  const ahpRanking = useAHP ? rankMarketplaceProductsWithAHP(rows, evaluatedAt, cursor) : null;
  const orderedRows = ahpRanking?.orderedRows ?? rows;
  const ahpScores = ahpRanking?.scores ?? new Map<string, number>();
  const page = orderedRows.slice(0, limit);
  const ratingRows = page.length ? await db.select({
    productId: product_reviews.productId,
    count: sql<number>`count(*)::int`,
    average: sql<string>`round(avg(${product_reviews.rating})::numeric, 1)::text`,
  }).from(product_reviews).where(inArray(product_reviews.productId, page.map((row) => row.id)))
    .groupBy(product_reviews.productId) : [];
  const ratingsByProduct = new Map(ratingRows.map((rating) => [rating.productId, rating]));
  const products = await Promise.all(page.map(async (row) => serializeProduct(
    row,
    await getProductImageDisplayUrl(row.imagUrl, row.sellerId),
    row.distanceKm === null ? null : Number(row.distanceKm),
    { average: ratingsByProduct.get(row.id)?.average ?? null, count: ratingsByProduct.get(row.id)?.count ?? 0 },
    policyVersion,
    useAHP ? ahpScores.get(row.id) ?? null : undefined,
  )));
  const last = page[page.length - 1];
  return {
    products,
    nextCursor: orderedRows.length > page.length && last && last.publishedAt
      ? encodeCursor({ evaluatedAt, id: last.id, score: useAHP ? ahpScores.get(last.id) ?? null : last.visibilityScore, publishedAt: last.publishedAt })
      : null,
    evaluatedAt: evaluatedAt.toISOString(),
  };
}
