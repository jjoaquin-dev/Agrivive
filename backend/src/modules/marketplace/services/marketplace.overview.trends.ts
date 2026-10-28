import { and, eq, gte, sql } from "drizzle-orm";
import { db } from "../../../db";
import { ordered_items, orders } from "../../../db/schema";
import type { ActivityTrendPoint, MarketplaceOverviewRange } from "../model/marketplace.overview";

export async function calculateRealTrends(range: MarketplaceOverviewRange): Promise<ActivityTrendPoint[]> {
  const now = new Date();

  if (range === "week") {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const points: ActivityTrendPoint[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const startOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const endOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

      const res = await db
        .select({
          qty: sql<number>`coalesce(sum(${ordered_items.quantity}), 0)::float`,
          orders: sql<number>`count(distinct ${orders.id})::int`,
        })
        .from(orders)
        .leftJoin(ordered_items, eq(orders.id, ordered_items.ordersId))
        .where(
          and(
            eq(orders.status, "completed"),
            gte(orders.createdAt, startOfDay),
            sql`${orders.createdAt} <= ${endOfDay}`
          )
        );

      points.push({
        label: dayNames[d.getDay()],
        date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        quantity: Math.round(Number(res[0]?.qty ?? 0)),
        orderCount: Number(res[0]?.orders ?? 0),
      });
    }
    return points;
  }

  if (range === "year") {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const points: ActivityTrendPoint[] = [];

    for (let m = 11; m >= 0; m--) {
      const d = new Date(now.getFullYear(), now.getMonth() - m, 1);
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);

      const res = await db
        .select({
          qty: sql<number>`coalesce(sum(${ordered_items.quantity}), 0)::float`,
          orders: sql<number>`count(distinct ${orders.id})::int`,
        })
        .from(orders)
        .leftJoin(ordered_items, eq(orders.id, ordered_items.ordersId))
        .where(
          and(
            eq(orders.status, "completed"),
            gte(orders.createdAt, start),
            sql`${orders.createdAt} <= ${end}`
          )
        );

      points.push({
        label: monthNames[d.getMonth()],
        date: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
        quantity: Math.round(Number(res[0]?.qty ?? 0)),
        orderCount: Number(res[0]?.orders ?? 0),
      });
    }
    return points;
  }

  const points: ActivityTrendPoint[] = [];
  for (let w = 3; w >= 0; w--) {
    const start = new Date(now.getTime() - (w + 1) * 7 * 24 * 60 * 60 * 1000);
    const end = new Date(now.getTime() - w * 7 * 24 * 60 * 60 * 1000);

    const res = await db
      .select({
        qty: sql<number>`coalesce(sum(${ordered_items.quantity}), 0)::float`,
        orders: sql<number>`count(distinct ${orders.id})::int`,
      })
      .from(orders)
      .leftJoin(ordered_items, eq(orders.id, ordered_items.ordersId))
      .where(
        and(
          eq(orders.status, "completed"),
          gte(orders.createdAt, start),
          sql`${orders.createdAt} < ${end}`
        )
      );

    points.push({
      label: `Week ${4 - w}`,
      date: `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
      quantity: Math.round(Number(res[0]?.qty ?? 0)),
      orderCount: Number(res[0]?.orders ?? 0),
    });
  }
  return points;
}
