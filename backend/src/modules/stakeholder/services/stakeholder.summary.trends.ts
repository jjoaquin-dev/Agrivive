import { and, eq, gte, sql } from "drizzle-orm";
import { db } from "../../../db";
import { ordered_items, orders, sellers_product, user } from "../../../db/schema";
import type { StakeholderTrends } from "../model/stakeholder.summary";

const DAYS = 30;
const day = (column: unknown) => sql<string>`to_char((${column} at time zone 'Asia/Manila')::date, 'YYYY-MM-DD')`;

/** The last 30 days by Philippine date, the produce rescued most, and the money that changed hands at pickup. */
export async function readStakeholderTrends(): Promise<StakeholderTrends> {
  const since = new Date(Date.now() - (DAYS + 1) * 86_400_000);
  const [placed, completed, top, totals, joined] = await Promise.all([
    db.select({ date: day(orders.createdAt), count: sql<number>`count(*)::int` })
      .from(orders).where(gte(orders.createdAt, since)).groupBy(day(orders.createdAt)),
    db.select({ date: day(orders.completedAt), count: sql<number>`count(*)::int`, pesos: sql<number>`coalesce(sum(${orders.totalAmount}), 0)::float` })
      .from(orders).where(and(eq(orders.status, "completed"), gte(orders.completedAt, since))).groupBy(day(orders.completedAt)),
    db.select({
      name: sql<string>`min(${sellers_product.productName})`,
      quantity: sql<number>`sum(${ordered_items.quantity})::float`,
      pesos: sql<number>`sum(${ordered_items.subtotal})::float`,
    }).from(ordered_items)
      .innerJoin(orders, eq(ordered_items.ordersId, orders.id))
      .innerJoin(sellers_product, eq(ordered_items.productId, sellers_product.id))
      .where(eq(orders.status, "completed"))
      .groupBy(sql`lower(btrim(${sellers_product.productName}))`)
      .orderBy(sql`sum(${ordered_items.quantity}) desc`).limit(8),
    db.select({ pesos: sql<number>`coalesce(sum(${orders.totalAmount}), 0)::float` }).from(orders).where(eq(orders.status, "completed")),
    db.select({ count: sql<number>`count(*)::int` }).from(user).where(gte(user.createdAt, new Date(Date.now() - DAYS * 86_400_000))),
  ]);
  const placedBy = new Map(placed.map((r) => [r.date, Number(r.count)]));
  const doneBy = new Map(completed.map((r) => [r.date, r]));
  const daily = Array.from({ length: DAYS }, (_, i) => {
    const date = new Date(Date.now() + 8 * 3600_000 - (DAYS - 1 - i) * 86_400_000).toISOString().slice(0, 10);
    const done = doneBy.get(date);
    return { date, placed: placedBy.get(date) ?? 0, completed: Number(done?.count ?? 0), pesos: Number(done?.pesos ?? 0) };
  });
  return {
    daily,
    topProduce: top.map((r) => ({ name: r.name, quantity: Number(r.quantity), pesos: Number(r.pesos) })),
    totalPesos: Number(totals[0]?.pesos ?? 0),
    newUsers30d: Number(joined[0]?.count ?? 0),
  };
}
