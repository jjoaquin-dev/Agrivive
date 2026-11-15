import { and, eq, gte, isNotNull, lte, sql } from "drizzle-orm";
import { db } from "../../../db";
import { orders } from "../../../db/schema";
import type { OverviewPeriod } from "./marketplace.overview.period";
import type { WeekdayDemandItem } from "../model/marketplace.overview";

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** Completed pickups by day of the week (Asia/Manila), Monday first, so every day is listed. */
export async function readWeekdayDemand(period: OverviewPeriod): Promise<WeekdayDemandItem[]> {
  const isoDay = sql<number>`extract(isodow from ${orders.completedAt} at time zone 'Asia/Manila')::int`;
  const rows = await db.select({ isoDay, count: sql<number>`count(*)::int` }).from(orders)
    .where(and(eq(orders.status, "completed"), isNotNull(orders.completedAt), gte(orders.completedAt, period.since), lte(orders.completedAt, period.until)))
    .groupBy(isoDay);
  const byDay = new Map(rows.map((row) => [Number(row.isoDay), Number(row.count)]));
  return weekdays.map((label, index) => ({ label, orderCount: byDay.get(index + 1) ?? 0 }));
}
