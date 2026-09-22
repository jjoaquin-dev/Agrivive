import { and, eq, gt } from "drizzle-orm";
import { db } from "../../../db";
import { orders } from "../../../db/schema";
import type { ScanOrderInput } from "../model/seller.scan-order";
import { requireActiveUser } from "../../../utils/order-access";
import { requireSellerScanAccess } from "../../../utils/seller-access";
import { verifyOrderQr } from "../../../utils/order-qr";
import { getOrder } from "../../../utils/order-read";
import { OrderError } from "../../../utils/order-types";

export async function scanSellerOrder(sellerId: string, body: ScanOrderInput) {
  const orderId = verifyOrderQr(body.qrPayload);
  if (!orderId) throw new OrderError(400, "Invalid order QR payload");

  await db.transaction(async (tx) => {
    await requireActiveUser(tx, sellerId, "seller");
    await requireSellerScanAccess(tx, sellerId, orderId);
    const now = new Date();
    const [completed] = await tx
      .update(orders)
      .set({ status: "completed", updatedAt: now })
      .where(
        and(
          eq(orders.id, orderId),
          eq(orders.sellersId, sellerId),
          eq(orders.status, "pending"),
          gt(orders.expiresAt, now),
        ),
      )
      .returning({ id: orders.id });
    if (completed) return;
    const [current] = await tx
      .select({ sellerId: orders.sellersId, status: orders.status, expiresAt: orders.expiresAt })
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);
    if (!current) throw new OrderError(404, "Order not found");
    if (current.sellerId !== sellerId) {
      throw new OrderError(403, "This order belongs to another seller");
    }
    if (current.status === "pending" && current.expiresAt && current.expiresAt <= now) {
      throw new OrderError(410, "Order has expired");
    }
    throw new OrderError(409, "Order is no longer pending");
  });
  return getOrder(orderId, sellerId, "seller");
}
