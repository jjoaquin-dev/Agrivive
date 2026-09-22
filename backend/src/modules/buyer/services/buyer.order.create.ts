import { createHash } from "node:crypto";
import { and, eq, sql } from "drizzle-orm";
import { db } from "../../../db";
import { checkouts, orders } from "../../../db/schema";
import { requireActiveUser } from "../../../utils/order-access";
import { ensureOrderQrSecret } from "../../../utils/order-qr";
import { OrderError } from "../../../utils/order-types";
import type { OrderInput } from "../model/buyer.order.create";
import { getBuyerOrder } from "./buyer.order.get";
import { createSellerOrder } from "./buyer.order.persist";
import { reserveOrderItem } from "./buyer.order.reserve";

function requestFingerprint(productId: string, quantity: number) {
  return createHash("sha256")
    .update(`${productId.toLowerCase()}:${quantity}`)
    .digest("hex");
}

export async function createDirectOrder(
  buyerId: string,
  body: OrderInput,
  rawKey: string,
) {
  const { productId, quantity } = body;
  ensureOrderQrSecret();
  const idempotencyKey = rawKey.trim();
  if (!idempotencyKey || idempotencyKey.length > 128) {
    throw new OrderError(400, "Invalid Idempotency-Key header");
  }
  const fingerprint = requestFingerprint(productId, quantity);

  const result = await db.transaction(async (tx) => {
    await tx.execute(sql`
      select pg_advisory_xact_lock(
        hashtext(${buyerId}),
        hashtext(${idempotencyKey})
      )
    `);
    const [existing] = await tx
      .select({
        id: checkouts.id,
        requestFingerprint: checkouts.requestFingerprint,
      })
      .from(checkouts)
      .where(
        and(
          eq(checkouts.buyersId, buyerId),
          eq(checkouts.idempotencyKey, idempotencyKey),
        ),
      )
      .limit(1);
    if (existing) {
      if (existing.requestFingerprint !== fingerprint) {
        throw new OrderError(409, "Idempotency key was used for another order");
      }
      const [previousOrder] = await tx
        .select({ id: orders.id })
        .from(orders)
        .where(eq(orders.checkoutId, existing.id))
        .limit(1);
      if (!previousOrder) throw new Error("Checkout is missing its order");
      return { orderId: previousOrder.id, replayed: true };
    }

    await requireActiveUser(tx, buyerId, "buyer");
    const item = await reserveOrderItem(tx, buyerId, productId, quantity);
    const [checkout] = await tx
      .insert(checkouts)
      .values({
        buyersId: buyerId,
        idempotencyKey,
        requestFingerprint: fingerprint,
      })
      .returning({ id: checkouts.id });
    const orderId = await createSellerOrder(
      tx,
      checkout.id,
      buyerId,
      item.sellerId,
      [item],
      new Date(Date.now() + 24 * 60 * 60 * 1000),
    );
    return { orderId, replayed: false };
  });

  return {
    order: await getBuyerOrder(result.orderId, buyerId),
    replayed: result.replayed,
  };
}
