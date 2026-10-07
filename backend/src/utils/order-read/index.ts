import { and, desc, eq, inArray, lt, or } from "drizzle-orm";
import { db } from "../../db";
import { ordered_items, orders, sellers_product } from "../../db/schema";
import { issueOrderQr } from "../order-qr";
import { OrderError, type OrderSide, type OrderStatus } from "../order-types";
import { getProductImageDisplayUrl } from "../product-image";

type OrderRow = typeof orders.$inferSelect;
type OrderItem = typeof ordered_items.$inferSelect;
type OrderItemRow = {
  item: OrderItem;
  imageUrl: string | null;
  productType: string | null;
  sellerId: string;
};

async function orderView(row: OrderRow, items: OrderItemRow[], side: OrderSide) {
  const displayItems = await Promise.all(items.map(async ({ item, imageUrl, productType, sellerId }) => ({
    id: item.id,
    productId: item.productId,
    productName: item.productName,
    productType,
    imageUrl: await getProductImageDisplayUrl(imageUrl, sellerId),
    scalingType: item.scalingType,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    subtotal: item.subtotal,
  })));
  return {
    id: row.id,
    checkoutId: row.checkoutId,
    buyerId: row.buyersId,
    sellerId: row.sellersId,
    status: row.status,
    cancelledBy: row.cancelledBy,
    cancellationReason: row.cancellationReason,
    totalAmount: row.totalAmount,
    expiresAt: row.expiresAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    items: displayItems,
    qrPayload:
      side === "buyer" &&
      row.status === "pending" &&
      row.expiresAt &&
      row.expiresAt > new Date()
        ? issueOrderQr(row.id)
        : null,
  };
}

export async function getOrder(orderId: string, userId: string, side: OrderSide) {
  const owner = side === "buyer" ? orders.buyersId : orders.sellersId;
  const [row] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, orderId), eq(owner, userId)))
    .limit(1);
  if (!row) throw new OrderError(404, "Order not found");
  const items = await db.select({
    item: ordered_items,
    imageUrl: sellers_product.imagUrl,
    productType: sellers_product.productType,
    sellerId: sellers_product.userId,
  }).from(ordered_items)
    .innerJoin(sellers_product, eq(ordered_items.productId, sellers_product.id))
    .where(eq(ordered_items.ordersId, row.id));
  return orderView(row, items, side);
}

export async function listOrders(
  userId: string,
  side: OrderSide,
  limit = 20,
  cursor?: string,
  allowedOrderIds?: string[] | null,
  status?: OrderStatus,
) {
  const owner = side === "buyer" ? orders.buyersId : orders.sellersId;
  let before;
  if (cursor) {
    const [anchor] = await db
      .select({ id: orders.id, createdAt: orders.createdAt })
      .from(orders)
      .where(and(eq(orders.id, cursor), eq(owner, userId),
        status ? eq(orders.status, status) : undefined,
        allowedOrderIds ? inArray(orders.id, allowedOrderIds) : undefined))
      .limit(1);
    if (!anchor) throw new OrderError(400, "Invalid order cursor");
    before = or(
      lt(orders.createdAt, anchor.createdAt),
      and(eq(orders.createdAt, anchor.createdAt), lt(orders.id, anchor.id)),
    );
  }

  const rows = await db
    .select()
    .from(orders)
    .where(and(eq(owner, userId), before,
      status ? eq(orders.status, status) : undefined,
      allowedOrderIds ? inArray(orders.id, allowedOrderIds) : undefined))
    .orderBy(desc(orders.createdAt), desc(orders.id))
    .limit(limit + 1);
  const page = rows.slice(0, limit);
  const items = page.length
    ? await db.select({
        item: ordered_items,
        imageUrl: sellers_product.imagUrl,
        productType: sellers_product.productType,
        sellerId: sellers_product.userId,
      }).from(ordered_items)
        .innerJoin(sellers_product, eq(ordered_items.productId, sellers_product.id))
        .where(inArray(ordered_items.ordersId, page.map((row) => row.id)))
    : [];
  const byOrder = new Map<string, OrderItemRow[]>();
  for (const item of items) {
    const list = byOrder.get(item.item.ordersId) ?? [];
    list.push(item);
    byOrder.set(item.item.ordersId, list);
  }

  return {
    orders: await Promise.all(page.map((row) => orderView(row, byOrder.get(row.id) ?? [], side))),
    nextCursor: rows.length > limit ? page[page.length - 1].id : null,
  };
}
