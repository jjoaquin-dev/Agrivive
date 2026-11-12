import { order_status_history, ordered_items, orders } from "../../../db/schema";
import { sumAmounts } from "../../../utils/order-amount";
import type { OrderTransaction } from "../../../utils/order-types";
import { assertPickupAvailable, readStallRules } from "../../../utils/pickup/availability";
import { flagOrderFlood } from "../../../utils/trust/order-flood";
import { notifyBuyer } from "../../../utils/pickup/notify";
import { formatManilaTime, manilaDateKey } from "../../../utils/pickup/manila";
import { qrWindow } from "../../../utils/pickup/qr-window";
import { reservationDeadline } from "../../../utils/pickup/reservation-deadline";
import type { ReservedOrderItem } from "../model/buyer.order.create";

export type PickupChoice = { start: Date; end: Date };

const expiresAtFor = (pickup: PickupChoice, deadline: { qrUntil: Date } | null) => deadline ? deadline.qrUntil : qrWindow(pickup.start, pickup.end).validUntil;

export function parsePickup(start: string, end: string): PickupChoice {
  return { start: new Date(start), end: new Date(end) };
}

/**
 * Saves the order. With no pickup range the buyer picks up any time before the stall's deadline
 * (see reservationDeadline); a range sent by an older client is still checked against every pickup rule.
 */
export async function createSellerOrder(
  tx: OrderTransaction,
  checkoutId: string,
  buyerId: string,
  sellerId: string,
  items: ReservedOrderItem[],
  chosen: PickupChoice | null,
) {
  if (!items.length || items.some((item) => item.sellerId !== sellerId)) {
    throw new Error("Seller order requires items from exactly one seller");
  }
  const now = new Date();
  const rules = chosen
    ? await assertPickupAvailable(tx, { buyerId, sellerId, range: { start: chosen.start, end: chosen.end } })
    : await readStallRules(tx, sellerId);
  const deadline = chosen ? null : reservationDeadline(rules, now);
  const pickup = chosen ?? { start: now, end: deadline!.end };
  const [order] = await tx
    .insert(orders)
    .values({
      checkoutId,
      buyersId: buyerId,
      sellersId: sellerId,
      totalAmount: sumAmounts(items.map((item) => item.subtotal)),
      pickupStart: pickup.start,
      pickupEnd: pickup.end,
      expiresAt: deadline ? deadline.qrUntil : qrWindow(pickup.start, pickup.end).validUntil,
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
  const when = chosen
    ? `${manilaDateKey(pickup.start)} ${formatManilaTime(pickup.start)} to ${formatManilaTime(pickup.end)}`
    : `pickup on or before ${manilaDateKey(pickup.end)} ${formatManilaTime(pickup.end)}`;
  await notifyBuyer(tx, {
    buyerId, orderId: order.id, key: `order-placed:${order.id}`,
    message: `Your reservation at ${rules.shopName} is placed: ${when}. The seller has 3 hours to confirm. You can cancel until it is confirmed. Your pickup QR works until ${formatManilaTime(expiresAtFor(pickup, deadline))}. Missing the pickup can add points against your account.`,
  });
  return order.id;
}
