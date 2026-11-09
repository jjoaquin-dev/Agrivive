import { order_status_history, ordered_items, orders } from "../../../db/schema";
import { sumAmounts } from "../../../utils/order-amount";
import type { OrderTransaction } from "../../../utils/order-types";
import { assertPickupAvailable } from "../../../utils/pickup/availability";
import { flagOrderFlood } from "../../../utils/trust/order-flood";
import { notifyBuyer } from "../../../utils/pickup/notify";
import { formatManilaTime, manilaDateKey } from "../../../utils/pickup/manila";
import { qrWindow } from "../../../utils/pickup/qr-window";
import type { ReservedOrderItem } from "../model/buyer.order.create";

export type PickupChoice = { start: Date; end: Date };

export function parsePickup(start: string, end: string): PickupChoice {
  return { start: new Date(start), end: new Date(end) };
}

/** Rechecks every pickup rule, then saves the order with its pickup range and a QR that works until 15 minutes after it. */
export async function createSellerOrder(
  tx: OrderTransaction,
  checkoutId: string,
  buyerId: string,
  sellerId: string,
  items: ReservedOrderItem[],
  pickup: PickupChoice,
) {
  if (!items.length || items.some((item) => item.sellerId !== sellerId)) {
    throw new Error("Seller order requires items from exactly one seller");
  }
  const rules = await assertPickupAvailable(tx, { buyerId, sellerId, range: { start: pickup.start, end: pickup.end } });
  const [order] = await tx
    .insert(orders)
    .values({
      checkoutId,
      buyersId: buyerId,
      sellersId: sellerId,
      totalAmount: sumAmounts(items.map((item) => item.subtotal)),
      pickupStart: pickup.start,
      pickupEnd: pickup.end,
      expiresAt: qrWindow(pickup.start, pickup.end).validUntil,
    })
    .returning({ id: orders.id });
  await flagOrderFlood(tx, order.id, buyerId, sellerId);
  await tx.insert(ordered_items).values(
    items.map((item) => ({
      ordersId: order.id,
      productId: item.productId,
      productName: item.productName,
      scalingType: item.scalingType,
      quantity: item.quantity.toString(),
      unitPrice: item.unitPrice,
      subtotal: item.subtotal,
    })),
  );
  await tx.insert(order_status_history).values({ orderId: order.id, status: "placed", actorId: buyerId });
  const when = `${manilaDateKey(pickup.start)} ${formatManilaTime(pickup.start)} to ${formatManilaTime(pickup.end)}`;
  await notifyBuyer(tx, {
    buyerId, orderId: order.id, key: `order-placed:${order.id}`,
    message: `Your reservation at ${rules.shopName} is placed for ${when}. The seller has 3 hours to confirm. You can cancel until it is confirmed. Your pickup QR works from the start of your time until 15 minutes after the end.`,
  });
  return order.id;
}
