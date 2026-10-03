import { and, asc, count, eq, gt, gte, ilike, isNotNull, isNull, lte, or, sql } from "drizzle-orm";
import { db } from "../../../db";
import { sellers_product, sellers_profile, user } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";
import { getAvatarDisplayUrl } from "../../../utils/s3-avatar";
import { marketplaceDistanceExpression } from "./marketplace.distance";
import { marketplaceSellerVisibility } from "./marketplace.visibility";
import type { MarketplaceSellersMapQuery } from "../model/marketplace.sellers.map";

function validateQuery(query: MarketplaceSellersMapQuery) {
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

function matchingProductConditions(query: MarketplaceSellersMapQuery) {
  const conditions = [
    marketplaceSellerVisibility(),
    eq(sellers_product.isActive, true),
    eq(sellers_product.isMarketable, true),
    gt(sellers_product.productQty, "0"),
    gt(sellers_product.productPrice, "0"),
    isNotNull(sellers_product.publishedAt),
  ];
  const search = query.search?.trim();
  if (search) conditions.push(ilike(sellers_product.productName, `%${search}%`));
  if (query.productType) conditions.push(eq(sellers_product.productType, query.productType));
  if (query.unit) conditions.push(eq(sellers_product.scalingType, query.unit));
  if (query.sellerType) conditions.push(eq(sellers_profile.sellerType, query.sellerType));
  if (query.minPrice !== undefined) conditions.push(gte(sellers_product.productPrice, query.minPrice.toString()));
  if (query.maxPrice !== undefined) conditions.push(lte(sellers_product.productPrice, query.maxPrice.toString()));
  if (query.minQuantity !== undefined) conditions.push(gte(sellers_product.productQty, query.minQuantity.toString()));
  if (query.maxQuantity !== undefined) conditions.push(lte(sellers_product.productQty, query.maxQuantity.toString()));
  return conditions;
}

export async function listMarketplaceSellersMap(query: MarketplaceSellersMapQuery) {
  validateQuery(query);
  const conditions = matchingProductConditions(query);
  const distanceKm = query.latitude !== undefined && query.longitude !== undefined
    ? marketplaceDistanceExpression(query.latitude, query.longitude) : null;
  const locationConditions = distanceKm && query.radiusKm !== undefined
    ? [lte(distanceKm, query.radiusKm)] : [];
  const mappedConditions = [
    ...conditions,
    ...locationConditions,
    isNotNull(sellers_profile.latitude),
    isNotNull(sellers_profile.longitude),
  ];
  const rows = await db.select({
    id: user.id,
    name: user.name,
    image: user.image,
    shopName: sellers_profile.shopName,
    sellerType: sellers_profile.sellerType,
    detailAddress: sellers_profile.detailAddress,
    pickupInstructions: sellers_profile.pickupInstructions,
    latitude: sellers_profile.latitude,
    longitude: sellers_profile.longitude,
    distanceKm: distanceKm ?? sql<null>`null`,
    productCount: count(sellers_product.id).as("product_count"),
  }).from(sellers_product)
    .innerJoin(user, eq(user.id, sellers_product.userId))
    .innerJoin(sellers_profile, eq(sellers_profile.userId, sellers_product.userId))
    .where(and(...mappedConditions))
    .groupBy(
      user.id,
      user.name,
      user.image,
      sellers_profile.shopName,
      sellers_profile.sellerType,
      sellers_profile.detailAddress,
      sellers_profile.pickupInstructions,
      sellers_profile.latitude,
      sellers_profile.longitude,
    )
    .orderBy(distanceKm ? asc(distanceKm) : asc(sellers_profile.shopName));

  const unmappedRows = await db.select({
    count: sql<number>`count(distinct ${sellers_profile.userId})::int`,
  }).from(sellers_product)
    .innerJoin(user, eq(user.id, sellers_product.userId))
    .innerJoin(sellers_profile, eq(sellers_profile.userId, sellers_product.userId))
    .where(and(
      ...conditions,
      or(isNull(sellers_profile.latitude), isNull(sellers_profile.longitude)),
    ));

  const sellers = await Promise.all(rows.flatMap((row) => {
      if (row.latitude === null || row.longitude === null) return [];
      return [row];
    }).map(async (row) => ({
        id: row.id,
        name: row.name,
        image: await getAvatarDisplayUrl(row.image),
        shopName: row.shopName,
        sellerType: row.sellerType,
        detailAddress: row.detailAddress,
        pickupInstructions: row.pickupInstructions,
        latitude: row.latitude,
        longitude: row.longitude,
        distanceKm: row.distanceKm === null ? null : Number(row.distanceKm),
        productCount: Number(row.productCount),
      })));

  return {
    sellers,
    unmappedSellerCount: Number(unmappedRows[0]?.count ?? 0),
  };
}
