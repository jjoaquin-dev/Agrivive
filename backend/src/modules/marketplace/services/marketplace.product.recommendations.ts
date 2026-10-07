import { and, desc, eq, gt, inArray, isNotNull, sql } from "drizzle-orm";
import { db } from "../../../db";
import { product_reviews, sellers_product, sellers_profile, user } from "../../../db/schema";
import { getProductImageDisplayUrl } from "../../../utils/product-image";
import { normalizeMbaItem, readMbaReport } from "../../../utils/mba-report";
import { marketplaceSellerVisibility } from "./marketplace.visibility";
import { marketplaceVisibilityScoreSql } from "../../../utils/visibility-score";
import { getMarketplaceProduct } from "./marketplace.product.get";

const recommendationLimit = 3;

function scoreTier(score: number | null) {
  if (score === null) return null;
  return score >= 0.7 ? "priority" : score >= 0.4 ? "standard" : "basic";
}

function ruleMatches(rule: { antecedent: string[] }, item: string) {
  return rule.antecedent.length === 1 && normalizeMbaItem(rule.antecedent[0]) === normalizeMbaItem(item);
}

function candidateCondition(itemLevel: "product_name" | "category" | "product_id", value: string) {
  if (itemLevel === "product_id") return eq(sellers_product.id, value);
  const column = itemLevel === "category" ? sellers_product.productType : sellers_product.productName;
  return sql`lower(regexp_replace(btrim(${column}), '[[:space:]]+', ' ', 'g')) = ${normalizeMbaItem(value)}`;
}

export async function getMarketplaceProductRecommendations(productId: string) {
  const current = await getMarketplaceProduct(productId);
  const mba = await readMbaReport();
  if (!mba.report || mba.status === "disabled" || mba.status === "collecting" || mba.status === "unavailable") {
    return {
      source: mba.source,
      status: mba.status,
      generatedAt: mba.generatedAt,
      basketCount: mba.basketCount,
      recommendations: [],
    };
  }

  const currentItem = mba.report.itemLevel === "product_name"
    ? current.productName
    : mba.report.itemLevel === "category"
      ? current.productType
      : current.id;
  const values = [...new Set(mba.report.rules
    .filter((rule) => ruleMatches(rule, currentItem))
    .flatMap((rule) => rule.consequent.map(normalizeMbaItem)))];
  if (values.length === 0) {
    return {
      source: mba.source,
      status: mba.status,
      generatedAt: mba.generatedAt,
      basketCount: mba.basketCount,
      recommendations: [],
    };
  }

  const evaluatedAt = new Date();
  const since = new Date(evaluatedAt.getTime() - 30 * 24 * 60 * 60 * 1000);
  const visibilityScore = marketplaceVisibilityScoreSql(evaluatedAt, since);
  const candidateConditions = values.map((value) => candidateCondition(mba.report!.itemLevel, value));
  const rows = await db.select({
    id: sellers_product.id, productName: sellers_product.productName, imagUrl: sellers_product.imagUrl,
    productPrice: sellers_product.productPrice, basePrice: sellers_product.basePrice,
    productQty: sellers_product.productQty, scalingType: sellers_product.scalingType,
    productType: sellers_product.productType, condition: sellers_product.condition,
    publishedAt: sellers_product.publishedAt, visibilityScore,
    sellerId: sellers_profile.userId, sellerName: user.name, shopName: sellers_profile.shopName,
    sellerType: sellers_profile.sellerType, detailAddress: sellers_profile.detailAddress,
    pickupInstructions: sellers_profile.pickupInstructions, latitude: sellers_profile.latitude,
    longitude: sellers_profile.longitude,
  }).from(sellers_product)
    .innerJoin(user, eq(user.id, sellers_product.userId))
    .innerJoin(sellers_profile, eq(sellers_profile.userId, sellers_product.userId))
    .where(and(
      eq(sellers_product.isActive, true), eq(sellers_product.isMarketable, true),
      gt(sellers_product.productQty, "0"), gt(sellers_product.productPrice, "0"),
      isNotNull(sellers_product.publishedAt), marketplaceSellerVisibility(),
      sql`${sellers_product.id} <> ${productId}`, sql`(${sql.join(candidateConditions, sql` or `)})`,
    ))
    .orderBy(sql`${visibilityScore} desc nulls last`, desc(sellers_product.publishedAt), desc(sellers_product.id))
    .limit(recommendationLimit);

  const ratingRows = rows.length ? await db.select({
    productId: product_reviews.productId,
    count: sql<number>`count(*)::int`,
    average: sql<string>`round(avg(${product_reviews.rating})::numeric, 1)::text`,
  }).from(product_reviews).where(inArray(product_reviews.productId, rows.map((row) => row.id)))
    .groupBy(product_reviews.productId) : [];
  const ratings = new Map(ratingRows.map((rating) => [rating.productId, rating]));
  const recommendations = await Promise.all(rows.map(async (row) => {
    const score = row.visibilityScore === null ? null : Number(row.visibilityScore);
    return {
      id: row.id, productName: row.productName,
      imageUrl: await getProductImageDisplayUrl(row.imagUrl, row.sellerId),
      productPrice: row.productPrice, basePrice: row.basePrice, productQty: row.productQty,
      scalingType: row.scalingType, productType: row.productType, condition: row.condition,
      availability: "available" as const,
      visibilityScore: score === null ? null : Number(score.toFixed(4)),
      visibilityTier: scoreTier(score),
      averageRating: ratings.get(row.id)?.average ?? null,
      reviewCount: ratings.get(row.id)?.count ?? 0,
      seller: {
        id: row.sellerId, name: row.sellerName, shopName: row.shopName,
        sellerType: row.sellerType, detailAddress: row.detailAddress,
        pickupInstructions: row.pickupInstructions, latitude: row.latitude,
        longitude: row.longitude, distanceKm: null,
      },
    };
  }));

  return {
    source: mba.source,
    status: mba.status,
    generatedAt: mba.generatedAt,
    basketCount: mba.basketCount,
    recommendations,
  };
}
