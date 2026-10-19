import { and, eq, sql } from "drizzle-orm";
import { db } from "../../../db";
import { order_reports, ordered_items, orders, sellers_product, user, vegetable_catalog } from "../../../db/schema";
import type { StakeholderSummary } from "../model/stakeholder.summary";

export async function readStakeholderSummary(): Promise<StakeholderSummary> {
  const [users, listings, orderRows, reports, cropRows, rescueRows] = await Promise.all([
    db.select({
      sellers: sql<number>`count(*) filter (where 'seller'::"role" = any(${user.role}))::int`,
      buyers: sql<number>`count(*) filter (where 'buyer'::"role" = any(${user.role}))::int`,
    }).from(user),
    db.select({
      total: sql<number>`count(*)::int`,
      active: sql<number>`count(*) filter (where ${sellers_product.isActive} and ${sellers_product.isMarketable})::int`,
    }).from(sellers_product),
    db.select({ status: orders.status, count: sql<number>`count(*)::int` })
      .from(orders).groupBy(orders.status),
    db.select({ total: sql<number>`count(*)::int` }).from(order_reports),
    db.select({
      category: vegetable_catalog.category,
      activeCount: sql<number>`count(*)::int`,
    })
      .from(sellers_product)
      .innerJoin(vegetable_catalog, eq(sellers_product.vegetableCatalogId, vegetable_catalog.id))
      .where(and(eq(sellers_product.isActive, true), eq(sellers_product.isMarketable, true)))
      .groupBy(vegetable_catalog.category),
    db.select({
      totalRescuedQty: sql<number>`coalesce(sum(${ordered_items.quantity}), 0)::float`,
    })
      .from(ordered_items)
      .innerJoin(orders, eq(ordered_items.ordersId, orders.id))
      .where(eq(orders.status, "completed")),
  ]);

  const orderMap = Object.fromEntries(orderRows.map((r) => [r.status, Number(r.count)]));
  const completed = orderMap.completed ?? 0;
  const expired = orderMap.expired ?? 0;
  const cancelled = orderMap.cancelled ?? 0;
  const totalDecided = completed + expired + cancelled;
  const fulfillmentRate = totalDecided > 0 ? Math.round((completed / totalDecided) * 100) : 100;

  return {
    generatedAt: new Date().toISOString(),
    users: users[0] ?? { sellers: 0, buyers: 0 },
    listings: listings[0] ?? { total: 0, active: 0 },
    orders: orderMap,
    reports: { total: Number(reports[0]?.total ?? 0) },
    cropCategories: cropRows.map((r) => ({ category: String(r.category), activeCount: Number(r.activeCount) })),
    rescueMetrics: {
      totalRescuedQty: Number(rescueRows[0]?.totalRescuedQty ?? 0),
      fulfillmentRate,
    },
  };
}
