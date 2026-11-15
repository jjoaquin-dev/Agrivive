import { and, eq, gte, isNotNull, lte, sql } from "drizzle-orm";
import { db } from "../../../db";
import { orders, sellers_product } from "../../../db/schema";
import type { MarketplaceOverviewResponse } from "../model/marketplace.overview";
import { readCategoryDemand } from "./marketplace.overview.demand";
import { resolveOverviewPeriod } from "./marketplace.overview.period";
import { readTopProduce } from "./marketplace.overview.produce";
import { calculateRealTrends } from "./marketplace.overview.trends";
import { readWeekdayDemand } from "./marketplace.overview.weekday";

/**
 * Public, descriptive totals about the produce moving through Agrivive for the days asked (from and to, both included).
 * It says what was bought and what is listed. It never predicts, and it never includes a seller's name, shop, address or any other profile detail.
 */
export async function readMarketplaceOverview(query: { from?: string; to?: string } = {}): Promise<MarketplaceOverviewResponse> {
  const period = resolveOverviewPeriod(query);

  const [produce, trends, categoryDemand, weekdayDemand, listings, ended] = await Promise.all([
    readTopProduce(period),
    calculateRealTrends(period),
    readCategoryDemand(period),
    readWeekdayDemand(period),
    db.select({ active: sql<number>`count(*)::int` }).from(sellers_product)
      .where(and(eq(sellers_product.isActive, true), eq(sellers_product.isMarketable, true), sql`${sellers_product.productQty} > 0`)),
    db.select({
      completed: sql<number>`count(*) filter (where ${orders.status} = 'completed')::int`,
      notCompleted: sql<number>`count(*) filter (where ${orders.status} in ('cancelled', 'expired', 'declined'))::int`,
    }).from(orders).where(and(gte(orders.createdAt, period.since), lte(orders.createdAt, period.until), isNotNull(orders.createdAt))),
  ]);

  const completed = Number(ended[0]?.completed ?? 0);
  const decided = completed + Number(ended[0]?.notCompleted ?? 0);

  return {
    generatedAt: new Date().toISOString(),
    from: period.from,
    to: period.to,
    bucket: period.bucket,
    isSampleData: false,
    kpis: {
      completedPickups: weekdayDemand.reduce((sum, day) => sum + day.orderCount, 0),
      produceTypesBought: produce.produceTypesBought,
      activeListings: Number(listings[0]?.active ?? 0),
      pickupRate: decided > 0 ? Math.round((completed / decided) * 100) : null,
      quantityByUnit: produce.quantityByUnit,
    },
    topProduce: produce.topProduce,
    activityTrends: trends,
    categoryDemand,
    weekdayDemand,
  };
}
