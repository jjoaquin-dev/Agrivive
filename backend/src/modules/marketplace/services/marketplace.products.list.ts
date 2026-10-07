import { and, desc, eq, gt, gte, ilike, inArray, isNotNull, lte, or, sql } from "drizzle-orm";
import { db } from "../../../db";
import { product_reviews, sellers_product, sellers_profile, user } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";
import { marketplaceVisibilityScoreSql } from "../../../utils/visibility-score";
import { getProductImageDisplayUrl } from "../../../utils/product-image";
import type { MarketplaceProductsQuery } from "../model/marketplace.products";
import { marketplaceDistanceExpression } from "./marketplace.distance";
import { marketplaceSellerVisibility } from "./marketplace.visibility";

type MarketplaceCursor = { evaluatedAt: Date; score: number | null; publishedAt: Date; id: string };

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

function scoreTier(score: number | null) {
  if (score === null) return null;
  return score >= .70 ? "priority" : score >= .40 ? "standard" : "basic";
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

function serializeProduct(row: any, imageUrl: string | null, distanceKm: number | null,
  rating: { average: string | null; count: number }) {
  const visibilityScore = row.visibilityScore === null ? null : Number(row.visibilityScore);
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
    visibilityTier: scoreTier(visibilityScore),
    averageRating: rating.average,
    reviewCount: rating.count,
    seller: {
      id: row.sellerId, name: row.sellerName, shopName: row.shopName,
      sellerType: row.sellerType, detailAddress: row.detailAddress,
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
  const visibilityScore = marketplaceVisibilityScoreSql(evaluatedAt, since);
  const conditions = [
    eq(sellers_product.isActive, true), eq(sellers_product.isMarketable, true),
    gt(sellers_product.productQty, "0"), gt(sellers_product.productPrice, "0"),
    isNotNull(sellers_product.publishedAt), eq(user.isActive, true), eq(user.emailVerified, true),
    marketplaceSellerVisibility(),
  ];
  const search = query.search?.trim();
  if (query.sellerId) conditions.push(eq(sellers_profile.userId, query.sellerId));
  if (search) conditions.push(ilike(sellers_product.productName, `%${search}%`));
  if (query.productType) conditions.push(eq(sellers_product.productType, query.productType));
  if (query.unit) conditions.push(eq(sellers_product.scalingType, query.unit));
  if (query.sellerType) conditions.push(eq(sellers_profile.sellerType, query.sellerType));
  if (query.minPrice !== undefined) conditions.push(gte(sellers_product.productPrice, query.minPrice.toString()));
  if (query.maxPrice !== undefined) conditions.push(lte(sellers_product.productPrice, query.maxPrice.toString()));
  if (query.minQuantity !== undefined) conditions.push(gte(sellers_product.productQty, query.minQuantity.toString()));
  if (query.maxQuantity !== undefined) conditions.push(lte(sellers_product.productQty, query.maxQuantity.toString()));
  const distanceKm = query.latitude !== undefined && query.longitude !== undefined
    ? marketplaceDistanceExpression(query.latitude, query.longitude) : null;
  if (distanceKm && query.radiusKm !== undefined) conditions.push(lte(distanceKm, query.radiusKm));
  if (cursor) conditions.push(cursorCondition(visibilityScore, cursor));

  const limit = query.limit ?? 20;
  const rows = await db.select({
    id: sellers_product.id, productName: sellers_product.productName, imagUrl: sellers_product.imagUrl,
    productPrice: sellers_product.productPrice, basePrice: sellers_product.basePrice,
    productQty: sellers_product.productQty, scalingType: sellers_product.scalingType,
    productType: sellers_product.productType, condition: sellers_product.condition,
    publishedAt: sellers_product.publishedAt, visibilityScore,
    sellerId: sellers_profile.userId, sellerName: user.name, shopName: sellers_profile.shopName,
    sellerType: sellers_profile.sellerType, detailAddress: sellers_profile.detailAddress,
    pickupInstructions: sellers_profile.pickupInstructions, latitude: sellers_profile.latitude,
    longitude: sellers_profile.longitude, distanceKm: distanceKm ?? sql<null>`null`,
  }).from(sellers_product).innerJoin(user, eq(user.id, sellers_product.userId))
    .innerJoin(sellers_profile, eq(sellers_profile.userId, sellers_product.userId))
    .where(and(...conditions))
    .orderBy(sql`${visibilityScore} desc nulls last`, desc(sellers_product.publishedAt), desc(sellers_product.id))
    .limit(limit + 1);
  const page = rows.slice(0, limit);
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
  )));
  const last = page[page.length - 1];
  return {
    products,
    nextCursor: rows.length > page.length && last && last.publishedAt
      ? encodeCursor({ evaluatedAt, id: last.id, score: last.visibilityScore, publishedAt: last.publishedAt })
      : null,
    evaluatedAt: evaluatedAt.toISOString(),
  };
}
