import { and, eq, sql } from "drizzle-orm";
import { db } from "../../../db";
import { ordered_items, orders, sellers_product } from "../../../db/schema";
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

    const [current] = await tx
      .select({
        id: orders.id,
        sellerId: orders.sellersId,
        status: orders.status,
        expiresAt: orders.expiresAt,
        totalAmount: orders.totalAmount,
      })
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!current) throw new OrderError(404, "Order not found");
    if (current.sellerId !== sellerId) {
      throw new OrderError(403, "This order belongs to another seller");
    }
    if (current.status !== "pending") {
      throw new OrderError(409, "Order is no longer pending");
    }
    if (current.expiresAt && current.expiresAt <= now) {
      throw new OrderError(410, "Order has expired");
    }

    const existingItems = await tx
      .select({
        id: ordered_items.id,
        productId: ordered_items.productId,
        quantity: ordered_items.quantity,
        unitPrice: ordered_items.unitPrice,
        subtotal: ordered_items.subtotal,
      })
      .from(ordered_items)
      .where(eq(ordered_items.ordersId, orderId));

    if (!existingItems.length) {
      throw new OrderError(400, "Order has no items");
    }

    let finalTotalAmount = Number(current.totalAmount);

    if (body.items && body.items.length > 0) {
      const adjustmentMap = new Map<string, number>();
      for (const adj of body.items) {
        adjustmentMap.set(adj.itemId, adj.dispensedQuantity);
      }

      let newTotal = 0;
      let totalDispensed = 0;

      for (const item of existingItems) {
        const reservedQty = Number(item.quantity ?? 0);
        const unitPrice = Number(item.unitPrice ?? 0);
        const dispensedQty = adjustmentMap.has(item.id)
          ? adjustmentMap.get(item.id)!
          : reservedQty;

        if (dispensedQty < 0) {
          throw new OrderError(400, "Dispensed amount cannot be negative");
        }
        if (dispensedQty > reservedQty + 0.0001) {
          throw new OrderError(
            400,
            `Dispensed amount cannot be greater than reserved amount (${reservedQty})`,
          );
        }

        totalDispensed += dispensedQty;
        const newSubtotal = Number((dispensedQty * unitPrice).toFixed(2));
        newTotal += newSubtotal;

        const diff = reservedQty - dispensedQty;
        if (diff > 0.0001) {
          // Restore uncollected portion to seller product inventory
          await tx
            .update(sellers_product)
            .set({
              productQty: sql`${sellers_product.productQty} + ${diff.toFixed(2)}`,
            })
            .where(eq(sellers_product.id, item.productId));

          // Update ordered_item with dispensed quantity and recalculated subtotal
          await tx
            .update(ordered_items)
            .set({
              quantity: dispensedQty.toFixed(2),
              subtotal: newSubtotal.toFixed(2),
              updatedAt: now,
            })
            .where(eq(ordered_items.id, item.id));
        }
      }

      if (totalDispensed <= 0) {
        throw new OrderError(400, "Cannot complete handover with 0 amount. Please cancel the order instead.");
      }

      finalTotalAmount = Number(newTotal.toFixed(2));
    }

    await tx
      .update(orders)
      .set({
        status: "completed",
        totalAmount: finalTotalAmount.toFixed(2),
        completedAt: now,
        updatedAt: now,
      })
      .where(
        and(
          eq(orders.id, orderId),
          eq(orders.sellersId, sellerId),
          eq(orders.status, "pending"),
        ),
      );
  });

  return getOrder(orderId, sellerId, "seller");
}
