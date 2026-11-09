import { and, eq, inArray, sql } from "drizzle-orm";
import { db } from "../../../db";
import { order_declines, order_qr_scans, order_status_history, ordered_items, orders, sellers_product } from "../../../db/schema";
import type { ScanOrderInput } from "../model/seller.scan-order";
import { requireActiveUser } from "../../../utils/order-access";
import { requireSellerScanAccess } from "../../../utils/seller-access";
import { verifyOrderQr } from "../../../utils/order-qr";
import { getOrder } from "../../../utils/order-read";
import { OrderError } from "../../../utils/order-types";
import { createSellerNotification } from "../../../utils/seller-notifications";
import { notifyBuyer } from "../../../utils/pickup/notify";
import { formatManilaTime } from "../../../utils/pickup/manila";
import { qrStatus } from "../../../utils/pickup/qr-window";

/** A rejected scan, with the word we keep in the scan history. */
class ScanError extends OrderError {
  constructor(public readonly result: string, statusCode: 400 | 403 | 404 | 409 | 410, message: string) { super(statusCode, message); }
}

/**
 * Completes a pickup. The QR must be real, belong to this seller's order, be inside its window (from the start of the
 * pickup time until 15 minutes after its end), and the order must still be open with no decline waiting.
 * Every try is saved in the scan history; only a valid scan completes the order, and only once.
 */
export async function scanSellerOrder(sellerId: string, body: ScanOrderInput) {
  const orderId = verifyOrderQr(body.qrPayload);
  if (!orderId) {
    await db.insert(order_qr_scans).values({ orderId: null, sellerId, result: "invalid" });
    throw new OrderError(400, "Invalid order QR payload");
  }
  try {
    await completeScan(sellerId, orderId, body);
  } catch (error) {
    if (error instanceof ScanError) await db.insert(order_qr_scans).values({ orderId, sellerId, result: error.result });
    throw error;
  }
  return getOrder(orderId, sellerId, "seller");
}

async function completeScan(sellerId: string, orderId: string, body: ScanOrderInput) {
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
        buyerId: orders.buyersId,
        pickupStart: orders.pickupStart,
        pickupEnd: orders.pickupEnd,
        confirmedAt: orders.confirmedAt,
      })
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!current) throw new OrderError(404, "Order not found");
    if (current.sellerId !== sellerId) {
      throw new ScanError("wrong_seller", 403, "This order belongs to another seller");
    }
    if (current.status === "completed") throw new ScanError("completed", 409, "This pickup was already completed");
    if (current.status === "cancelled") throw new ScanError("cancelled", 409, "This order was cancelled");
    if (current.status !== "pending") {
      throw new ScanError("expired", 409, "Order is no longer pending");
    }
    const window = qrStatus(current.pickupStart, current.pickupEnd, now);
    if (window === "expired" || (current.expiresAt && current.expiresAt <= now)) {
      throw new ScanError("expired", 410, "This QR has expired and cannot be used. The buyer must place a new order.");
    }
    if (window === "not_yet_valid") {
      throw new ScanError("not_yet_valid", 409, `This QR is not valid yet. It works from ${formatManilaTime(current.pickupStart!)}.`);
    }
    const [openDecline] = await tx.select({ id: order_declines.id }).from(order_declines)
      .where(and(eq(order_declines.orderId, orderId), inArray(order_declines.status, ["pending_seller"]))).limit(1);
    if (openDecline) throw new ScanError("decline_open", 409, "The buyer declined this pickup. Answer the decline first.");

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

    const [completed] = await tx
      .update(orders)
      .set({
        status: "completed",
        totalAmount: finalTotalAmount.toFixed(2),
        completedAt: now,
        updatedAt: now,
        ...(current.confirmedAt ? {} : { confirmedAt: now, confirmationMode: "manual" }),
      })
      .where(
        and(
          eq(orders.id, orderId),
          eq(orders.sellersId, sellerId),
          eq(orders.status, "pending"),
        ),
      )
      .returning({ id: orders.id });
    if (!completed) throw new ScanError("completed", 409, "This pickup was already completed");
    await tx.insert(order_qr_scans).values({ orderId, sellerId, result: "ok" });
    await tx.insert(order_status_history).values({ orderId, status: "completed", actorId: sellerId, note: "Valid QR scanned" });
    await notifyBuyer(tx, { buyerId: current.buyerId, orderId, key: `order-completed:${orderId}`, message: "Your pickup is complete. Thank you for rescuing fresh produce! You can now rate your order." });

    await createSellerNotification(tx, {
      sellerId,
      kind: "pickup_done",
      dedupeKey: `pickup-done:${orderId}`,
      orderId,
    });
  });
}
