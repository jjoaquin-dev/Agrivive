import { sql } from "drizzle-orm";
import { db } from "../../../db";
import { order_report_evidence, order_reports, orders, sellers_product, trust_events, trust_notices, user } from "../../../db/schema";
import type { AdminPerformance } from "../model/admin.performance";
import { readTrustMonitoringScore } from "../../../utils/trust/score";

export async function readAdminPerformance(): Promise<AdminPerformance> {
  const [users, listings, orderRows, trust, trustMonitoring] = await Promise.all([
    db.select({
      sellers: sql<number>`count(*) filter (where 'seller'::"role" = any(${user.role}))::int`,
      buyers: sql<number>`count(*) filter (where 'buyer'::"role" = any(${user.role}))::int`,
    }).from(user),
    db.select({ total: sql<number>`count(*)::int`,
      active: sql<number>`count(*) filter (where ${sellers_product.isActive} and ${sellers_product.isMarketable})::int`,
    }).from(sellers_product),
    db.select({ status: orders.status, count: sql<number>`count(*)::int` })
      .from(orders).groupBy(orders.status),
    Promise.all([
      db.select({ count: sql<number>`count(*)::int` }).from(trust_events)
        .where(sql`${trust_events.classification} = 'verified' and ${trust_events.invalidatedAt} is null`),
      db.select({ count: sql<number>`count(*)::int` }).from(order_reports),
      db.select({ count: sql<number>`count(*)::int` }).from(order_report_evidence),
      db.select({ count: sql<number>`count(*)::int` }).from(trust_notices)
        .where(sql`${trust_notices.sentAt} is null`),
      db.select({ count: sql<number>`count(*)::int` }).from(trust_notices)
        .where(sql`${trust_notices.sentAt} is null and ${trust_notices.attempts} >= 5`),
    ]),
    readTrustMonitoringScore(),
  ]);
  return {
    users: users[0] ?? { sellers: 0, buyers: 0 },
    listings: listings[0] ?? { total: 0, active: 0 },
    orders: Object.fromEntries(orderRows.map((row) => [row.status, row.count])),
    trust: {
      verifiedEvents: trust[0][0]?.count ?? 0,
      reportFlags: trust[1][0]?.count ?? 0,
      evidenceFiles: trust[2][0]?.count ?? 0,
      noticesPending: trust[3][0]?.count ?? 0,
      noticesFailed: trust[4][0]?.count ?? 0,
    },
    trustMonitoring,
  };
}
