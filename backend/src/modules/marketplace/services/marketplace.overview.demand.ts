import { and, eq, gte, isNotNull, lte, sql } from "drizzle-orm";
import { db } from "../../../db";
import { ordered_items, orders, sellers_product, vegetable_catalog } from "../../../db/schema";
import type { OverviewPeriod } from "./marketplace.overview.period";
import type { CategoryDemandItem } from "../model/marketplace.overview";

const share = (part: number, total: number) => (total > 0 ? Math.round((part / total) * 100) : 0);

/** What buyers picked up, by category, next to what is listed right now. Both are counts, with no seller details. */
export async function readCategoryDemand(period: OverviewPeriod): Promise<CategoryDemandItem[]> {
  const category = sql<string>`coalesce(${vegetable_catalog.category}::text, ${sellers_product.productType}::text, 'Other')`;
  const [bought, listed] = await Promise.all([
    db.select({ category, count: sql<number>`count(distinct ${orders.id})::int` }).from(ordered_items)
      .innerJoin(orders, eq(ordered_items.ordersId, orders.id))
      .leftJoin(sellers_product, eq(ordered_items.productId, sellers_product.id))
      .leftJoin(vegetable_catalog, eq(sellers_product.vegetableCatalogId, vegetable_catalog.id))
      .where(and(eq(orders.status, "completed"), isNotNull(orders.completedAt), gte(orders.completedAt, period.since), lte(orders.completedAt, period.until)))
      .groupBy(category),
    db.select({ category, count: sql<number>`count(*)::int` }).from(sellers_product)
      .leftJoin(vegetable_catalog, eq(sellers_product.vegetableCatalogId, vegetable_catalog.id))
      .where(and(eq(sellers_product.isActive, true), eq(sellers_product.isMarketable, true), sql`${sellers_product.productQty} > 0`))
      .groupBy(category),
  ]);
  const boughtBy = new Map(bought.map((row) => [row.category, Number(row.count)]));
  const listedBy = new Map(listed.map((row) => [row.category, Number(row.count)]));
  const orderTotal = [...boughtBy.values()].reduce((sum, value) => sum + value, 0);
  const listingTotal = [...listedBy.values()].reduce((sum, value) => sum + value, 0);

  return [...new Set([...boughtBy.keys(), ...listedBy.keys()])].map((name) => ({
    category: name,
    orderCount: boughtBy.get(name) ?? 0,
    orderShare: share(boughtBy.get(name) ?? 0, orderTotal),
    activeListings: listedBy.get(name) ?? 0,
    listingShare: share(listedBy.get(name) ?? 0, listingTotal),
  })).sort((a, b) => b.orderCount - a.orderCount || b.activeListings - a.activeListings || a.category.localeCompare(b.category));
}
