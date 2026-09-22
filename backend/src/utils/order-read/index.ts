import { and, desc, eq, inArray, lt, or } from "drizzle-orm";
import { db } from "../../db";
import { ordered_items, orders } from "../../db/schema";
import { issueOrderQr } from "../order-qr";
import { OrderError, type OrderSide } from "../order-types";

type OrderRow = typeof orders.$inferSelect;
type OrderItem = typeof ordered_items.$inferSelect;

function orderView(row: OrderRow, items: OrderItem[], side: OrderSide) {
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
    items: items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.productName,
      scalingType: item.scalingType,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      subtotal: item.subtotal,
    })),
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
  const items = await db
    .select()
    .from(ordered_items)
    .where(eq(ordered_items.ordersId, row.id));
  return orderView(row, items, side);
}

export async function listOrders(
  userId: string,
  side: OrderSide,
  limit = 20,
  cursor?: string,
  allowedOrderIds?: string[] | null,
) {
  const owner = side === "buyer" ? orders.buyersId : orders.sellersId;
  let before;
  if (cursor) {
    const [anchor] = await db
      .select({ id: orders.id, createdAt: orders.createdAt })
      .from(orders)
      .where(and(eq(orders.id, cursor), eq(owner, userId),
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
      allowedOrderIds ? inArray(orders.id, allowedOrderIds) : undefined))
    .orderBy(desc(orders.createdAt), desc(orders.id))
    .limit(limit + 1);
  const page = rows.slice(0, limit);
  const items = page.length
    ? await db
        .select()
        .from(ordered_items)
        .where(inArray(ordered_items.ordersId, page.map((row) => row.id)))
    : [];
  const byOrder = new Map<string, OrderItem[]>();
  for (const item of items) {
    const list = byOrder.get(item.ordersId) ?? [];
    list.push(item);
    byOrder.set(item.ordersId, list);
  }

  return {
    orders: page.map((row) => orderView(row, byOrder.get(row.id) ?? [], side)),
    nextCursor: rows.length > limit ? page[page.length - 1].id : null,
  };
}
