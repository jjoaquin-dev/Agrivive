import { and, eq, sql } from "drizzle-orm";
import type { db } from "../../db";
import { order_reviews } from "../../db/schema";
import { reviewCounts } from "./review-counts";
import { sellerFaultPolicy, trustedSellerPolicy } from "./policy";

type Reader = Pick<typeof db, "select">;

/** Equation 3: R = (C * m + sum of ratings) / (C + n). */
export function bayesianRating(sumOfRatings: number, reviewCount: number, marketplaceAverage: number, phantom: number = trustedSellerPolicy.phantomReviews) {
  return (phantom * marketplaceAverage + sumOfRatings) / (phantom + reviewCount);
}

/** Service stars only. Product-condition stars (product_rating) never feed seller trust. */
export async function readMarketplaceAverageRating(reader: Reader) {
  const [row] = await reader.select({ avg: sql<string | null>`avg(${order_reviews.rating})` }).from(order_reviews).where(reviewCounts);
  return row?.avg ? Number(row.avg) : trustedSellerPolicy.defaultMarketplaceRating;
}

export async function readSellerBayesianRating(reader: Reader, sellerId: string) {
  const [row] = await reader.select({
    sum: sql<number>`coalesce(sum(${order_reviews.rating}), 0)::int`,
    count: sql<number>`count(*)::int`,
  }).from(order_reviews).where(and(eq(order_reviews.sellerId, sellerId), reviewCounts));
  const marketplaceAverage = await readMarketplaceAverageRating(reader);
  const count = Number(row?.count ?? 0);
  return { rating: bayesianRating(Number(row?.sum ?? 0), count, marketplaceAverage), reviewCount: count, marketplaceAverage };
}

/** Trusted Seller: Bayesian rating of at least 4.5, score 0 for 90 days, at least 20 completed orders, fault rate below 15%. */
export function isTrustedSeller(input: { rating: number; score: number; completedOrders: number; faultRatePercent: number }) {
  return input.rating >= trustedSellerPolicy.minRating && input.score === 0
    && input.completedOrders >= trustedSellerPolicy.minCompletedOrders && input.faultRatePercent < sellerFaultPolicy.reviewPercent;
}
