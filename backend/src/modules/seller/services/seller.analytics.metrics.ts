import { and, eq, gte, inArray, lt } from "drizzle-orm";
import { db } from "../../../db";
import {
  listing_cycles,
  ordered_items,
  orders,
  sellers_product,
} from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";
import { requireVerifiedSeller } from "../../../utils/seller-access";
import type {
  SellerAnalyticsMetrics,
  SellerAnalyticsQuery,
} from "../model/seller.analytics";

type Period = {
  start: Date;
  end: Date;
  from: string;
  to: string;
};

const DAY_MS = 24 * 60 * 60 * 1000;

function dateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

function startOfUtcDay(value: string) {
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || dateOnly(date) !== value) {
    throw new OrderError(400, "Analytics dates must use YYYY-MM-DD format");
  }
  return date;
}

function resolvePeriod(query: SellerAnalyticsQuery) {
  if ((query.from && !query.to) || (!query.from && query.to)) {
    throw new OrderError(400, "Analytics requires both from and to dates");
  }

  const todayStart = startOfUtcDay(dateOnly(new Date()));
  const end = query.to ? new Date(startOfUtcDay(query.to).getTime() + DAY_MS) : todayStart;
  const start = query.from
    ? startOfUtcDay(query.from)
    : new Date(end.getTime() - 30 * DAY_MS);

  if (start >= end) {
    throw new OrderError(400, "Analytics from date must be before the to date");
  }

  const duration = end.getTime() - start.getTime();
  const previousStart = new Date(start.getTime() - duration);
  return {
    current: { start, end, from: dateOnly(start), to: dateOnly(new Date(end.getTime() - DAY_MS)) },
    previous: {
      start: previousStart,
      end: start,
      from: dateOnly(previousStart),
      to: dateOnly(new Date(start.getTime() - DAY_MS)),
    },
  };
}

function scaledDecimal(value: string | number | null | undefined) {
  if (value === null || value === undefined) return 0n;
  const match = /^(-?)(\d+)(?:\.(\d{1,2}))?$/.exec(String(value));
  if (!match) return 0n;
  const cents = BigInt(match[2]) * 100n + BigInt((match[3] ?? "").padEnd(2, "0") || "0");
  return match[1] ? -cents : cents;
}

function formatScaled(value: bigint) {
  const sign = value < 0n ? "-" : "";
  const absolute = value < 0n ? -value : value;
  return `${sign}${absolute / 100n}.${(absolute % 100n).toString().padStart(2, "0")}`;
}

function percentage(numerator: bigint, denominator: bigint) {
  if (denominator === 0n) return null;
  return Number((numerator * 10_000n) / denominator) / 100;
}

function inPeriod(value: Date | null, period: Period) {
  return value !== null && value >= period.start && value < period.end;
}

export async function getSellerAnalyticsMetrics(
  sellerId: string,
  query: SellerAnalyticsQuery,
): Promise<SellerAnalyticsMetrics> {
  const periods = resolvePeriod(query);

  return db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId);

    const productConditions = [eq(sellers_product.userId, sellerId)];
    if (query.productId) productConditions.push(eq(sellers_product.id, query.productId));
    if (query.unit) productConditions.push(eq(sellers_product.scalingType, query.unit));

    const products = await tx
      .select({ id: sellers_product.id, productQty: sellers_product.productQty, scalingType: sellers_product.scalingType })
      .from(sellers_product)
      .where(and(...productConditions));

    const productIds = products.map((product) => product.id);
    const empty = productIds.length === 0;
    const cycles = empty
      ? []
      : await tx
          .select({ productId: listing_cycles.productId, vegetableKey: listing_cycles.vegetableKey, originalQty: listing_cycles.originalQty, startedAt: listing_cycles.startedAt })
          .from(listing_cycles)
          .where(and(inArray(listing_cycles.productId, productIds), gte(listing_cycles.startedAt, periods.previous.start), lt(listing_cycles.startedAt, periods.current.end)));
    const items = empty
      ? []
      : await tx
          .select({ orderId: ordered_items.ordersId, productId: ordered_items.productId, quantity: ordered_items.quantity, subtotal: ordered_items.subtotal })
          .from(ordered_items)
          .where(inArray(ordered_items.productId, productIds));
    const sellerOrders = await tx
      .select({
        id: orders.id,
        status: orders.status,
        createdAt: orders.createdAt,
        completedAt: orders.completedAt,
        cancelledAt: orders.cancelledAt,
        expiredAt: orders.expiredAt,
      })
      .from(orders)
      .where(eq(orders.sellersId, sellerId));
    const orderById = new Map(sellerOrders.map((order) => [order.id, order]));

    const selected = new Set(productIds);
    const currentPosted = cycles.filter((cycle) => inPeriod(cycle.startedAt, periods.current));
    const postedQuantity = currentPosted.reduce((total, cycle) => total + scaledDecimal(cycle.originalQty), 0n);
    const availableQuantity = products.reduce((total, product) => total + scaledDecimal(product.productQty), 0n);

    let reservedQuantity = 0n;
    let activeReservedQuantity = 0n;
    let completedQuantity = 0n;
    let previousCompletedQuantity = 0n;
    let cancelledQuantity = 0n;
    let expiredQuantity = 0n;
    let completedSalesTotal = 0n;
    for (const item of items) {
      if (!selected.has(item.productId)) continue;
      const order = orderById.get(item.orderId);
      if (!order) continue;
      const quantity = scaledDecimal(item.quantity);
      if (inPeriod(order.createdAt, periods.current)) reservedQuantity += quantity;
      if (order.status === "pending") activeReservedQuantity += quantity;
      if (order.status === "completed" && inPeriod(order.completedAt, periods.current)) {
        completedQuantity += quantity;
        completedSalesTotal += scaledDecimal(item.subtotal);
      }
      if (order.status === "completed" && inPeriod(order.completedAt, periods.previous)) {
        previousCompletedQuantity += quantity;
      }
      if (order.status === "cancelled" && inPeriod(order.cancelledAt, periods.current)) cancelledQuantity += quantity;
      if (order.status === "expired" && inPeriod(order.expiredAt, periods.current)) expiredQuantity += quantity;
    }

    const previousVegetableKeys = new Set(
      cycles
        .filter((cycle) => cycle.startedAt < periods.current.start)
        .map((cycle) => cycle.vegetableKey),
    );
    const recurringListings = new Set(
      currentPosted
        .filter((cycle) => previousVegetableKeys.has(cycle.vegetableKey))
        .map((cycle) => cycle.vegetableKey),
    ).size;
    const completedQuantityChange = percentage(
      previousCompletedQuantity === 0n ? 0n : completedQuantity - previousCompletedQuantity,
      previousCompletedQuantity,
    );
    const sellThroughRate = percentage(completedQuantity, postedQuantity);
    const completedChange = previousCompletedQuantity === 0n ? null : completedQuantityChange;
    const remainingQuantity = availableQuantity + activeReservedQuantity;

    return {
      period: {
        from: periods.current.from,
        to: periods.current.to,
        previousFrom: periods.previous.from,
        previousTo: periods.previous.to,
      },
      filter: {
        ...(query.productId ? { productId: query.productId } : {}),
        ...(query.unit ? { unit: query.unit } : {}),
      },
      metrics: {
        postedQuantity: formatScaled(postedQuantity),
        availableQuantity: formatScaled(availableQuantity),
        reservedQuantity: formatScaled(reservedQuantity),
        completedQuantity: formatScaled(completedQuantity),
        cancelledQuantity: formatScaled(cancelledQuantity),
        expiredQuantity: formatScaled(expiredQuantity),
        remainingQuantity: formatScaled(remainingQuantity),
        completedSalesTotal: formatScaled(completedSalesTotal),
        sellThroughRate,
        completedQuantityChange: completedChange,
        recurringListings,
      },
      notComputable: {
        sellThroughRate: postedQuantity === 0n,
        completedQuantityChange: previousCompletedQuantity === 0n,
      },
    };
  });
}
