import { and, eq, gte, isNotNull, lte, sql } from "drizzle-orm";
import { db } from "../../../db";
import { ordered_items, orders, sellers_product, vegetable_catalog } from "../../../db/schema";
import type { OverviewPeriod } from "./marketplace.overview.period";
import type { OverviewUnit, TopProduceItem, UnitQuantity } from "../model/marketplace.overview";

const unitName = (value: string | null): OverviewUnit => (value === "sack" ? "sack" : value === "pile" ? "pile" : "kg");

/**
 * Produce bought through completed pickups, most orders first. One row per produce name and unit,
 * because a kilo, a sack and a pile are not the same amount. Only produce, never a seller or a buyer.
 */
export async function readTopProduce(period: OverviewPeriod) {
  const name = sql<string>`coalesce(${ordered_items.productName}, ${sellers_product.productName})`;
  const unit = sql<string>`coalesce(${ordered_items.scalingType}, ${sellers_product.scalingType})::text`;
  const rows = await db.select({
    name,
    unit,
    category: sql<string | null>`max(coalesce(${vegetable_catalog.category}::text, ${sellers_product.productType}::text))`,
    quantity: sql<number>`coalesce(sum(${ordered_items.quantity}), 0)::float`,
    orderCount: sql<number>`count(distinct ${orders.id})::int`,
    amount: sql<number>`coalesce(sum(${ordered_items.subtotal}), 0)::float`,
  }).from(ordered_items)
    .innerJoin(orders, eq(ordered_items.ordersId, orders.id))
    .leftJoin(sellers_product, eq(ordered_items.productId, sellers_product.id))
    .leftJoin(vegetable_catalog, eq(sellers_product.vegetableCatalogId, vegetable_catalog.id))
    .where(and(eq(orders.status, "completed"), isNotNull(orders.completedAt), gte(orders.completedAt, period.since), lte(orders.completedAt, period.until), isNotNull(name)))
    .groupBy(name, unit);

  const items: TopProduceItem[] = rows
    .map((row) => {
      const quantity = Number(row.quantity);
      return {
        id: "",
        name: row.name.trim(),
        category: row.category ?? "Other",
        unit: unitName(row.unit),
        quantity: Math.round(quantity * 100) / 100,
        orderCount: Number(row.orderCount),
        averagePrice: quantity > 0 ? Math.round((Number(row.amount) / quantity) * 100) / 100 : 0,
      };
    })
    .filter((item) => item.name)
    .sort((a, b) => b.orderCount - a.orderCount || b.quantity - a.quantity || a.name.localeCompare(b.name));

  const quantityByUnit = new Map<OverviewUnit, number>();
  for (const item of items) quantityByUnit.set(item.unit, (quantityByUnit.get(item.unit) ?? 0) + item.quantity);
  const totals: UnitQuantity[] = [...quantityByUnit].map(([unit, quantity]) => ({ unit, quantity: Math.round(quantity * 100) / 100 }));

  return {
    topProduce: items.slice(0, 10).map((item, index) => ({ ...item, id: String(index + 1) })),
    produceTypesBought: new Set(items.map((item) => item.name.toLowerCase())).size,
    quantityByUnit: totals,
  };
}
