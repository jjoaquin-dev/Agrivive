import { and, eq, gte, inArray, lt } from "drizzle-orm";
import { db } from "../../../db";
import {
  listing_cycles,
  ordered_items,
  orders,
  sellers_product,
} from "../../../db/schema";
import { getVegetableCycleIdentity } from "../../../utils/vegetable-identity";
import { requireVerifiedSeller } from "../../../utils/seller-access";
import type {
  SellerAnalyticsMetrics,
  SellerAnalyticsQuery,
} from "../model/seller.analytics";
import {
  formatScaled,
  inPeriod,
  percentage,
  resolvePeriod,
  scaledDecimal,
} from "./seller.analytics.helpers";

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
      .select({
        id: sellers_product.id,
        productName: sellers_product.productName,
        productQty: sellers_product.productQty,
        scalingType: sellers_product.scalingType,
      })
      .from(sellers_product)
      .where(and(...productConditions));

    const productIds = products.map((product) => product.id);
    const empty = productIds.length === 0;
    const cycles = empty
      ? []
      : await tx
          .select({
            productId: listing_cycles.productId,
            vegetableCatalogId: listing_cycles.vegetableCatalogId,
            scalingType: listing_cycles.scalingType,
            vegetableKey: listing_cycles.vegetableKey,
            originalQty: listing_cycles.originalQty,
            startedAt: listing_cycles.startedAt,
          })
          .from(listing_cycles)
          .where(
            and(
              inArray(listing_cycles.productId, productIds),
              gte(listing_cycles.startedAt, periods.previous.start),
              lt(listing_cycles.startedAt, periods.current.end),
            ),
          );

    const items = empty
      ? []
      : await tx
          .select({
            orderId: ordered_items.ordersId,
            productId: ordered_items.productId,
            quantity: ordered_items.quantity,
            subtotal: ordered_items.subtotal,
          })
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

    const recurringListings = new Set(
      currentPosted
        .filter((cycle) => {
          const identity = getVegetableCycleIdentity(
            cycle.vegetableCatalogId,
            cycle.vegetableKey,
            cycle.scalingType,
          );
          return cycles.some((priorCycle) =>
            priorCycle.startedAt < cycle.startedAt &&
            getVegetableCycleIdentity(
              priorCycle.vegetableCatalogId,
              priorCycle.vegetableKey,
              priorCycle.scalingType,
            ) === identity);
        })
        .map((cycle) => getVegetableCycleIdentity(cycle.vegetableCatalogId, cycle.vegetableKey, cycle.scalingType)),
    ).size;

    const completedQuantityChange = percentage(
      previousCompletedQuantity === 0n ? 0n : completedQuantity - previousCompletedQuantity,
      previousCompletedQuantity,
    );
    const sellThroughRate = percentage(completedQuantity, postedQuantity);
    const completedChange = previousCompletedQuantity === 0n ? null : completedQuantityChange;
    const remainingQuantity = availableQuantity + activeReservedQuantity;
    const matchedProduct = query.productId ? products.find((p) => p.id === query.productId) : undefined;

    return {
      period: {
        from: periods.current.from,
        to: periods.current.to,
        previousFrom: periods.previous.from,
        previousTo: periods.previous.to,
      },
      filter: {
        ...(query.productId ? { productId: query.productId } : {}),
        ...(matchedProduct?.productName ? { productName: matchedProduct.productName } : {}),
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
