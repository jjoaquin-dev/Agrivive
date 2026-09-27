import { createHash } from "node:crypto";
import { and, eq, inArray, sql } from "drizzle-orm";
import { db } from "../../../db";
import { checkouts, orders } from "../../../db/schema";
import { requireActiveUser } from "../../../utils/order-access";
import { ensureOrderQrSecret } from "../../../utils/order-qr";
import { OrderError } from "../../../utils/order-types";
import type { CheckoutInput } from "../model/buyer.checkout.create";
import { getBuyerOrder } from "./buyer.order.get";
import { createSellerOrder } from "./buyer.order.persist";
import { reserveOrderItem } from "./buyer.order.reserve";

function normalizeItems(items: CheckoutInput["items"]) {
  const normalized = [...items].sort((left, right) => left.productId.localeCompare(right.productId));
  const seen = new Set<string>();
  for (const item of normalized) {
    if (seen.has(item.productId)) {
      throw new OrderError(400, "Each product can only appear once in the cart");
    }
    seen.add(item.productId);
  }
  return normalized;
}

function requestFingerprint(items: CheckoutInput["items"]) {
  return createHash("sha256")
    .update(JSON.stringify(items.map((item) => ({ productId: item.productId, quantity: item.quantity }))))
    .digest("hex");
}

export async function createCartCheckout(
  buyerId: string,
  body: CheckoutInput,
  rawKey: string,
) {
  ensureOrderQrSecret();
  const idempotencyKey = rawKey.trim();
  if (!idempotencyKey || idempotencyKey.length > 128) {
    throw new OrderError(400, "Invalid Idempotency-Key header");
  }
  const items = normalizeItems(body.items);
  const fingerprint = requestFingerprint(items);

  const result = await db.transaction(async (tx) => {
    await tx.execute(sql`
      select pg_advisory_xact_lock(
        hashtext(${buyerId}),
        hashtext(${idempotencyKey})
      )
    `);

    const [existing] = await tx
      .select({ id: checkouts.id, requestFingerprint: checkouts.requestFingerprint })
      .from(checkouts)
      .where(and(eq(checkouts.buyersId, buyerId), eq(checkouts.idempotencyKey, idempotencyKey)))
      .limit(1);

    if (existing) {
      if (existing.requestFingerprint !== fingerprint) {
        throw new OrderError(409, "Idempotency key was used for another checkout");
      }
      const previousOrders = await tx
        .select({ id: orders.id })
        .from(orders)
        .where(eq(orders.checkoutId, existing.id));
      if (!previousOrders.length) throw new Error("Checkout is missing its orders");
      return { checkoutId: existing.id, orderIds: previousOrders.map((order) => order.id), replayed: true };
    }

    await requireActiveUser(tx, buyerId, "buyer");
    const reservedItems = [];
    for (const item of items) {
      reservedItems.push(await reserveOrderItem(tx, buyerId, item.productId, item.quantity));
    }

    const [checkout] = await tx
      .insert(checkouts)
      .values({ buyersId: buyerId, idempotencyKey, requestFingerprint: fingerprint })
      .returning({ id: checkouts.id });

    const bySeller = new Map<string, typeof reservedItems>();
    for (const item of reservedItems) {
      const sellerItems = bySeller.get(item.sellerId) ?? [];
      sellerItems.push(item);
      bySeller.set(item.sellerId, sellerItems);
    }

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const orderIds: string[] = [];
    for (const [sellerId, sellerItems] of bySeller) {
      orderIds.push(await createSellerOrder(tx, checkout.id, buyerId, sellerId, sellerItems, expiresAt));
    }
    return { checkoutId: checkout.id, orderIds, replayed: false };
  });

  const ordersForBuyer = await Promise.all(result.orderIds.map((orderId) => getBuyerOrder(orderId, buyerId)));
  return {
    checkoutId: result.checkoutId,
    orders: ordersForBuyer.map((order) => ({
      id: order.id,
      sellerId: order.sellerId,
      totalAmount: order.totalAmount,
      qrPayload: order.qrPayload,
    })),
    replayed: result.replayed,
  };
}
