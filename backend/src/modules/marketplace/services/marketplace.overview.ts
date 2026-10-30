import { and, desc, eq, gte, sql } from "drizzle-orm";
import { db } from "../../../db";
import {
  ordered_items,
  orders,
  sellers_product,
  sellers_profile,
  user,
} from "../../../db/schema";
import type {
  MarketplaceOverviewRange,
  MarketplaceOverviewResponse,
  TopProduceItem,
} from "../model/marketplace.overview";
import { calculateRealTrends } from "./marketplace.overview.trends";

export async function readMarketplaceOverview(range: MarketplaceOverviewRange = "month"): Promise<MarketplaceOverviewResponse> {
  const days = range === "week" ? 7 : range === "year" ? 365 : 30;
  const sinceDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const [users, listings, orderRows, cropRows, rescueRows, dbTopRows, stalls, buyerSummary, activityTrends] = await Promise.all([
    db.select({
      sellers: sql<number>`count(*) filter (where 'seller'::"role" = any(${user.role}))::int`,
      buyers: sql<number>`count(*) filter (where 'buyer'::"role" = any(${user.role}))::int`,
    }).from(user),
    db.select({
      total: sql<number>`count(*)::int`,
      active: sql<number>`count(*) filter (where ${sellers_product.isActive} and ${sellers_product.isMarketable})::int`,
    }).from(sellers_product),
    db.select({ status: orders.status, count: sql<number>`count(*)::int` }).from(orders).groupBy(orders.status),
    db.select({
      category: sellers_product.productType,
      activeCount: sql<number>`count(*)::int`,
    })
      .from(sellers_product)
      .where(and(eq(sellers_product.isActive, true), eq(sellers_product.isMarketable, true)))
      .groupBy(sellers_product.productType),
    db.select({
      totalRescuedQty: sql<number>`coalesce(sum(${ordered_items.quantity}), 0)::float`,
      totalOrders: sql<number>`count(distinct ${orders.id})::int`,
    })
      .from(ordered_items)
      .innerJoin(orders, eq(ordered_items.ordersId, orders.id))
      .where(and(eq(orders.status, "completed"), gte(orders.createdAt, sinceDate))),
    db.select({
      name: sql<string>`coalesce(${ordered_items.productName}, ${sellers_product.productName})`,
      category: sellers_product.productType,
      totalQuantity: sql<number>`coalesce(sum(${ordered_items.quantity}), 0)::float`,
      orderCount: sql<number>`count(distinct ${orders.id})::int`,
      totalValue: sql<number>`coalesce(sum(${ordered_items.subtotal}), 0)::float`,
    })
      .from(ordered_items)
      .innerJoin(orders, eq(ordered_items.ordersId, orders.id))
      .leftJoin(sellers_product, eq(ordered_items.productId, sellers_product.id))
      .where(and(eq(orders.status, "completed"), gte(orders.createdAt, sinceDate)))
      .groupBy(sql`coalesce(${ordered_items.productName}, ${sellers_product.productName})`, sellers_product.productType)
      .orderBy(sql`sum(${ordered_items.quantity}) desc`)
      .limit(10),
    db.select({
      id: sellers_profile.id,
      shopName: sellers_profile.shopName,
      detailAddress: sellers_profile.detailAddress,
      activeListings: sql<number>`count(distinct ${sellers_product.id}) filter (where ${sellers_product.isActive} and ${sellers_product.isMarketable})::int`,
      totalStockKg: sql<number>`coalesce(sum(${sellers_product.productQty}) filter (where ${sellers_product.isActive} and ${sellers_product.isMarketable}), 0)::float`,
    })
      .from(sellers_profile)
      .leftJoin(sellers_product, eq(sellers_profile.userId, sellers_product.userId))
      .where(eq(sellers_profile.isCurrent, true))
      .groupBy(sellers_profile.id, sellers_profile.shopName, sellers_profile.detailAddress)
      .orderBy(desc(sql`count(distinct ${sellers_product.id}) filter (where ${sellers_product.isActive} and ${sellers_product.isMarketable})`))
      .limit(6),
    db.select({
      totalBuyersWhoOrdered: sql<number>`count(distinct ${orders.buyersId})::int`,
      completedPickups: sql<number>`count(*) filter (where ${orders.status} = 'completed')::int`,
      activeOrders: sql<number>`count(*) filter (where ${orders.status} = 'pending')::int`,
    }).from(orders),
    calculateRealTrends(range),
  ]);

  const orderMap = Object.fromEntries(orderRows.map((r) => [r.status, Number(r.count)]));
  const completed = orderMap.completed ?? 0;
  const expired = orderMap.expired ?? 0;
  const cancelled = orderMap.cancelled ?? 0;
  const totalDecided = completed + expired + cancelled;
  const fulfillmentRate = totalDecided > 0 ? Math.round((completed / totalDecided) * 100) : 100;

  const totalCrops = cropRows.reduce((acc, r) => acc + Number(r.activeCount), 0);
  const categoryBreakdown = cropRows.map((r) => ({
    category: String(r.category),
    activeCount: Number(r.activeCount),
    percentage: totalCrops > 0 ? Math.round((Number(r.activeCount) / totalCrops) * 100) : 0,
  }));

  const topProduce: TopProduceItem[] = dbTopRows.map((row, idx) => ({
    id: String(idx + 1),
    name: row.name?.trim() || "Produce item",
    category: row.category || "Fresh Produce",
    totalQuantity: Math.round(Number(row.totalQuantity)),
    unit: "kg",
    orderCount: Number(row.orderCount),
    totalValue: Math.round(Number(row.totalValue)),
  }));

  const existingNames = new Set(topProduce.map((p) => p.name.toLowerCase()));

  if (topProduce.length < 10) {
    const allTimeCompleted = await db.select({
      name: sql<string>`coalesce(${ordered_items.productName}, ${sellers_product.productName})`,
      category: sellers_product.productType,
      totalQuantity: sql<number>`coalesce(sum(${ordered_items.quantity}), 0)::float`,
      orderCount: sql<number>`count(distinct ${orders.id})::int`,
      totalValue: sql<number>`coalesce(sum(${ordered_items.subtotal}), 0)::float`,
    })
      .from(ordered_items)
      .innerJoin(orders, eq(ordered_items.ordersId, orders.id))
      .leftJoin(sellers_product, eq(ordered_items.productId, sellers_product.id))
      .where(eq(orders.status, "completed"))
      .groupBy(sql`coalesce(${ordered_items.productName}, ${sellers_product.productName})`, sellers_product.productType)
      .orderBy(sql`sum(${ordered_items.quantity}) desc`);

    for (const item of allTimeCompleted) {
      if (topProduce.length >= 10) break;
      const cleanName = item.name?.trim() || "Fresh Produce";
      if (!existingNames.has(cleanName.toLowerCase())) {
        existingNames.add(cleanName.toLowerCase());
        topProduce.push({
          id: String(topProduce.length + 1),
          name: cleanName,
          category: item.category || "Fresh Produce",
          totalQuantity: Math.round(Number(item.totalQuantity)),
          unit: "kg",
          orderCount: Number(item.orderCount),
          totalValue: Math.round(Number(item.totalValue)),
        });
      }
    }
  }

  if (topProduce.length < 10) {
    const activeListings = await db.select({
      name: sellers_product.productName,
      category: sellers_product.productType,
      qty: sellers_product.productQty,
      price: sellers_product.productPrice,
    })
      .from(sellers_product)
      .where(and(eq(sellers_product.isActive, true), eq(sellers_product.isMarketable, true)))
      .orderBy(desc(sellers_product.productQty));

    for (const p of activeListings) {
      if (topProduce.length >= 10) break;
      const cleanName = p.name?.trim() || "Market Produce";
      if (!existingNames.has(cleanName.toLowerCase())) {
        existingNames.add(cleanName.toLowerCase());
        const qty = Math.round(Number(p.qty ?? 0));
        const price = Number(p.price ?? 0);
        topProduce.push({
          id: String(topProduce.length + 1),
          name: cleanName,
          category: p.category || "Fresh Produce",
          totalQuantity: qty,
          unit: "kg",
          orderCount: 1,
          totalValue: Math.round(qty * price),
        });
      }
    }
  }

  const finalTopProduce = topProduce.slice(0, 10).map((item, idx) => ({
    ...item,
    id: String(idx + 1),
  }));

  const registeredBuyers = Number(users[0]?.buyers ?? 0);
  const registeredSellers = Number(users[0]?.sellers ?? 0);

  return {
    generatedAt: new Date().toISOString(),
    range,
    isSampleData: false,
    kpis: {
      totalRescuedQty: Math.round(Number(rescueRows[0]?.totalRescuedQty ?? 0)),
      activeListings: Number(listings[0]?.active ?? 0),
      totalOrders: Number(rescueRows[0]?.totalOrders ?? 0),
      fulfillmentRate,
      activeSellers: registeredSellers,
      activeBuyers: registeredBuyers,
    },
    topProduce: finalTopProduce,
    activityTrends,
    categoryBreakdown,
    sellerStalls: stalls.map((s) => ({
      id: s.id,
      shopName: s.shopName,
      detailAddress: s.detailAddress,
      activeListings: Number(s.activeListings ?? 0),
      totalStockKg: Math.round(Number(s.totalStockKg ?? 0)),
    })),
    buyerSummary: {
      registeredBuyers,
      activeBuyersWithOrders: Number(buyerSummary[0]?.totalBuyersWhoOrdered ?? 0),
      completedPickups: Number(buyerSummary[0]?.completedPickups ?? 0),
      pendingPickups: Number(buyerSummary[0]?.activeOrders ?? 0),
    },
  };
}
