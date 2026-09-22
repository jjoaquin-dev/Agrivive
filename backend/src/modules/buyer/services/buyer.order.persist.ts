import { ordered_items, orders } from "../../../db/schema";
import { sumAmounts } from "../../../utils/order-amount";
import type { OrderTransaction } from "../../../utils/order-types";
import type { ReservedOrderItem } from "../model/buyer.order.create";

export async function createSellerOrder(
  tx: OrderTransaction,
  checkoutId: string,
  buyerId: string,
  sellerId: string,
  items: ReservedOrderItem[],
  expiresAt: Date,
) {
  if (!items.length || items.some((item) => item.sellerId !== sellerId)) {
    throw new Error("Seller order requires items from exactly one seller");
  }
  const [order] = await tx
    .insert(orders)
    .values({
      checkoutId,
      buyersId: buyerId,
      sellersId: sellerId,
      totalAmount: sumAmounts(items.map((item) => item.subtotal)),
      expiresAt,
    })
    .returning({ id: orders.id });
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
  return order.id;
}
