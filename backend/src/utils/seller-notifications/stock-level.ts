import type { sellers_product } from "../../db/schema";
import type { OrderTransaction } from "../order-types";
import { createSellerNotification } from "./index";

/**
 * Tells the seller when stock drops to zero or reaches their "alert me" amount.
 * `product` holds the amount left after the drop; `removed` is how much was taken.
 */
export async function notifyStockLevel(
  tx: OrderTransaction,
  product: typeof sellers_product.$inferSelect,
  removed: number,
) {
  const after = Number(product.productQty ?? 0);
  const before = after + removed;
  const threshold = product.lowStockThreshold === null ? null : Number(product.lowStockThreshold);
  const soldOut = after <= 0 && before > 0;
  const runningLow = !soldOut && threshold !== null && threshold > 0 && before > threshold && after <= threshold;
  if (!soldOut && !runningLow) return;
  await createSellerNotification(tx, {
    sellerId: product.userId,
    kind: soldOut ? "sold_out" : "running_low",
    dedupeKey: `${soldOut ? "sold-out" : "running-low"}:${product.id}:${crypto.randomUUID()}`,
    productId: product.id,
    payload: { productName: product.productName, left: `${after} ${product.scalingType}` },
  });
}
