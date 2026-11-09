import { and, eq, inArray } from "drizzle-orm";
import { db } from "../../../db";
import { order_reviews, ordered_items, orders, sellers_product } from "../../../db/schema";
import { reviewCounts } from "../../../utils/trust/review-counts";
import type { SellerAnalyticsInsights, SellerAnalyticsQuery } from "../model/seller.analytics";
import { dateOnly, inPeriod, resolvePeriod } from "./seller.analytics.helpers";

const manilaWeekday = (date: Date) => new Date(date.getTime() + 8 * 3600_000).getUTCDay();
const round = (value: number, places = 2) => Number(value.toFixed(places));

/** Orders, buyers, top produce, busy days, reply speed and ratings for the chosen days. Counts and pesos, not quantities. */
export async function getSellerAnalyticsInsights(sellerId: string, query: SellerAnalyticsQuery): Promise<SellerAnalyticsInsights> {
  const { current } = resolvePeriod(query);

  const filters = [eq(sellers_product.userId, sellerId)];
  if (query.productId) filters.push(eq(sellers_product.id, query.productId));
  if (query.unit) filters.push(eq(sellers_product.scalingType, query.unit));
  const products = await db.select({ id: sellers_product.id, name: sellers_product.productName, unit: sellers_product.scalingType })
    .from(sellers_product).where(and(...filters));
  const productById = new Map(products.map((p) => [p.id, p]));

  const items = products.length === 0 ? [] : await db.select({
    orderId: ordered_items.ordersId, productId: ordered_items.productId, quantity: ordered_items.quantity, subtotal: ordered_items.subtotal,
  }).from(ordered_items).where(inArray(ordered_items.productId, products.map((p) => p.id)));
  const itemsByOrder = new Map<string, typeof items>();
  for (const item of items) itemsByOrder.set(item.orderId, [...(itemsByOrder.get(item.orderId) ?? []), item]);

  const all = await db.select({
    id: orders.id, buyerId: orders.buyersId, status: orders.status, createdAt: orders.createdAt, confirmedAt: orders.confirmedAt,
    completedAt: orders.completedAt, cancelledAt: orders.cancelledAt, expiredAt: orders.expiredAt, declinedAt: orders.declinedAt,
  }).from(orders).where(and(eq(orders.sellersId, sellerId), eq(orders.countsForRanking, true)));
  const mine = all.filter((order) => itemsByOrder.has(order.id));

  const completed = mine.filter((o) => o.status === "completed" && inPeriod(o.completedAt, current));
  const outcomes = {
    placed: mine.filter((o) => inPeriod(o.createdAt, current)).length,
    pickedUp: completed.length,
    cancelled: mine.filter((o) => o.status === "cancelled" && inPeriod(o.cancelledAt, current)).length,
    expired: mine.filter((o) => o.status === "expired" && inPeriod(o.expiredAt, current)).length,
    declined: mine.filter((o) => o.status === "declined" && inPeriod(o.declinedAt, current)).length,
  };

  const perProduce = new Map<string, { name: string; unit: string; quantity: number; sales: number }>();
  let sales = 0;
  const orderTotals: number[] = [];
  const daily = new Map<string, { sales: number; pickups: number }>();
  for (const order of completed) {
    let orderTotal = 0;
    for (const item of itemsByOrder.get(order.id) ?? []) {
      const product = productById.get(item.productId);
      if (!product) continue;
      const row = perProduce.get(product.id) ?? { name: product.name, unit: product.unit, quantity: 0, sales: 0 };
      row.quantity += Number(item.quantity); row.sales += Number(item.subtotal); sales += Number(item.subtotal); orderTotal += Number(item.subtotal);
      perProduce.set(product.id, row);
    }
    orderTotals.push(orderTotal);
    const day = dateOnly(order.completedAt!);
    const slot = daily.get(day) ?? { sales: 0, pickups: 0 };
    slot.sales += orderTotal; slot.pickups++;
    daily.set(day, slot);
  }
  const dailySales: SellerAnalyticsInsights["dailySales"] = [];
  for (let t = current.start.getTime(); t < current.end.getTime(); t += 86_400_000) {
    const date = dateOnly(new Date(t));
    const slot = daily.get(date);
    dailySales.push({ date, sales: round(slot?.sales ?? 0), pickups: slot?.pickups ?? 0 });
  }

  const pickups = new Map<string, number>();
  for (const o of all) if (o.status === "completed" && o.completedAt && o.completedAt < current.end) pickups.set(o.buyerId, (pickups.get(o.buyerId) ?? 0) + 1);
  const buyers = new Set(completed.map((o) => o.buyerId));
  const returning = [...buyers].filter((id) => (pickups.get(id) ?? 0) >= 2).length;

  const weekdays = [0, 0, 0, 0, 0, 0, 0];
  for (const order of completed) if (order.completedAt) weekdays[manilaWeekday(order.completedAt)]++;

  const waits = mine.filter((o) => inPeriod(o.createdAt, current) && o.confirmedAt).map((o) => (o.confirmedAt!.getTime() - o.createdAt.getTime()) / 60_000);

  const reviewRows = await db.select({ rating: order_reviews.rating, createdAt: order_reviews.createdAt }).from(order_reviews)
    .where(and(eq(order_reviews.sellerId, sellerId), reviewCounts));
  const inRange = reviewRows.filter((r) => inPeriod(r.createdAt, current));
  // With no reviews in these days, show the whole-time rating so the tile is not empty.
  const rated = inRange.length ? inRange : reviewRows;
  const stars = [0, 0, 0, 0, 0];
  for (const r of rated) if (r.rating >= 1 && r.rating <= 5) stars[r.rating - 1]++;

  return {
    orders: outcomes,
    averageOrder: completed.length ? round(sales / completed.length) : null,
    buyers: { total: buyers.size, returning },
    topProduce: [...perProduce.values()].sort((a, b) => b.sales - a.sales).slice(0, 5)
      .map((row) => ({ ...row, quantity: round(row.quantity), sales: round(row.sales) })),
    pickupsByWeekday: weekdays,
    averageReplyMinutes: waits.length ? Math.round(waits.reduce((a, b) => a + b, 0) / waits.length) : null,
    rating: rated.length ? { average: round(rated.reduce((a, r) => a + r.rating, 0) / rated.length, 1), count: rated.length, stars, allTime: inRange.length === 0 } : null,
    totalSales: round(sales),
    smallestOrder: orderTotals.length ? round(Math.min(...orderTotals)) : null,
    largestOrder: orderTotals.length ? round(Math.max(...orderTotals)) : null,
    dailySales,
  };
}
