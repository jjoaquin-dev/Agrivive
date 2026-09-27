import { sql } from "drizzle-orm";
import { db } from "../../../db";
import { order_reports, orders, sellers_product, user } from "../../../db/schema";
import type { StakeholderSummary } from "../model/stakeholder.summary";

export async function readStakeholderSummary(): Promise<StakeholderSummary> {
  const [users, listings, orderRows, reports] = await Promise.all([
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
  ]);
  return {
    generatedAt: new Date().toISOString(),
    users: users[0] ?? { sellers: 0, buyers: 0 },
    listings: listings[0] ?? { total: 0, active: 0 },
    orders: Object.fromEntries(orderRows.map((row) => [row.status, Number(row.count)])),
    reports: { total: Number(reports[0]?.total ?? 0) },
  };
}
