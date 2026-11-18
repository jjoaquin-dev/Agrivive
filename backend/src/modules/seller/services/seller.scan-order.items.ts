import { and, eq, gte, sql } from "drizzle-orm";
import { ordered_items, sellers_product } from "../../../db/schema";
import { OrderError, type OrderTransaction } from "../../../utils/order-types";
import type { ScanOrderInput } from "../model/seller.scan-order";

type HandoverItem = { id: string; productId: string; quantity: string | null; unitPrice: string | null };

/**
 * Saves what the seller really handed over, more or less than reserved.
 * Less: the difference goes back to the listing's stock. More: it comes out of the listing's stock, only if enough is left.
 * Returns the new order total and the total amount given.
 */
export async function applyHandoverAmounts(
  tx: OrderTransaction,
  items: HandoverItem[],
  adjustments: NonNullable<ScanOrderInput["items"]>,
  now: Date,
) {
  const given = new Map(adjustments.map((row) => [row.itemId, row.dispensedQuantity]));
  let total = 0;
  let totalGiven = 0;

  for (const item of items) {
    const reserved = Number(item.quantity ?? 0);
    const unitPrice = Number(item.unitPrice ?? 0);
    const dispensed = given.has(item.id) ? given.get(item.id)! : reserved;
    if (dispensed < 0) throw new OrderError(400, "Dispensed amount cannot be negative");

    const subtotal = Number((dispensed * unitPrice).toFixed(2));
    total += subtotal;
    totalGiven += dispensed;

    const change = dispensed - reserved;
    if (Math.abs(change) <= 0.0001) continue;

    if (change < 0) {
      await tx.update(sellers_product)
        .set({ productQty: sql`${sellers_product.productQty} + ${(-change).toFixed(2)}` })
        .where(eq(sellers_product.id, item.productId));
    } else {
      const [taken] = await tx.update(sellers_product)
        .set({ productQty: sql`${sellers_product.productQty} - ${change.toFixed(2)}` })
        .where(and(eq(sellers_product.id, item.productId), gte(sellers_product.productQty, change.toFixed(2))))
        .returning({ id: sellers_product.id });
      if (!taken) {
        const [product] = await tx.select({ left: sellers_product.productQty }).from(sellers_product)
          .where(eq(sellers_product.id, item.productId)).limit(1);
        throw new OrderError(409, `Not enough stock left to give more. Only ${Number(product?.left ?? 0)} more is available.`);
      }
    }
    await tx.update(ordered_items)
      .set({ quantity: dispensed.toFixed(2), subtotal: subtotal.toFixed(2), updatedAt: now })
      .where(eq(ordered_items.id, item.id));
  }

  return { total: Number(total.toFixed(2)), totalGiven };
}
