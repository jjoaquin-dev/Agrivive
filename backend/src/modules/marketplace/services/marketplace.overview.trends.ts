import { and, eq, gte, isNotNull, lte, sql } from "drizzle-orm";
import { db } from "../../../db";
import { orders } from "../../../db/schema";
import type { ActivityTrendPoint } from "../model/marketplace.overview";
import type { OverviewPeriod } from "./marketplace.overview.period";

const dayMs = 86_400_000;
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const ms = (day: string) => Date.parse(`${day}T00:00:00Z`);
const shortDay = (value: number) => `${monthNames[new Date(value).getUTCMonth()]} ${new Date(value).getUTCDate()}`;

/**
 * Completed pickups over the chosen days, counted on Asia/Manila calendar days.
 * One bar per day, per 7-day block or per month depending on the span. Empty buckets stay, so a chart never skips a step.
 */
export async function calculateRealTrends(period: OverviewPeriod): Promise<ActivityTrendPoint[]> {
  const day = sql<string>`to_char(${orders.completedAt} at time zone 'Asia/Manila', 'YYYY-MM-DD')`;
  const rows = await db.select({ day, count: sql<number>`count(*)::int` }).from(orders)
    .where(and(eq(orders.status, "completed"), isNotNull(orders.completedAt), gte(orders.completedAt, period.since), lte(orders.completedAt, period.until)))
    .groupBy(day);
  const perDay = new Map(rows.map((row) => [row.day, Number(row.count)]));
  const days = Array.from({ length: period.days }, (_, index) => ms(period.from) + index * dayMs);
  const total = (slice: number[]) => slice.reduce((sum, value) => sum + (perDay.get(new Date(value).toISOString().slice(0, 10)) ?? 0), 0);

  if (period.bucket === "day") {
    return days.map((value) => ({ label: shortDay(value), detail: `${dayNames[new Date(value).getUTCDay()]}, ${shortDay(value)}`, orderCount: total([value]) }));
  }
  if (period.bucket === "week") {
    const points: ActivityTrendPoint[] = [];
    for (let start = 0; start < days.length; start += 7) {
      const slice = days.slice(start, start + 7);
      const first = shortDay(slice[0]!);
      const last = shortDay(slice[slice.length - 1]!);
      const sameMonth = new Date(slice[0]!).getUTCMonth() === new Date(slice[slice.length - 1]!).getUTCMonth();
      const end = sameMonth ? String(new Date(slice[slice.length - 1]!).getUTCDate()) : last;
      points.push({ label: slice.length === 1 ? first : `${first}–${end}`, detail: `${first} to ${last}`, orderCount: total(slice) });
    }
    return points;
  }
  const months = [...new Set(days.map((value) => new Date(value).toISOString().slice(0, 7)))];
  return months.map((month) => {
    const year = month.slice(0, 4);
    const name = monthNames[Number(month.slice(5)) - 1]!;
    return { label: `${name} ${year}`, detail: `${name} ${year}`, orderCount: total(days.filter((value) => new Date(value).toISOString().startsWith(month))) };
  });
}
