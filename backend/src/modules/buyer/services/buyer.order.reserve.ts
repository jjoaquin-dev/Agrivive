import { and, eq, gt, gte, isNotNull, ne, sql } from "drizzle-orm";
import { sellers_product } from "../../../db/schema";
import { requireActiveUser } from "../../../utils/order-access";
import { requireVerifiedSeller } from "../../../utils/seller-access";
import { multiplyPrice, quantityToHundredths } from "../../../utils/order-amount";
import { OrderError, type OrderTransaction } from "../../../utils/order-types";
import type { ReservedOrderItem } from "../model/buyer.order.create";
import { applySellerProductPriceReduction } from "../../seller/services/seller.product.price-reduction";
import { createSellerNotification } from "../../../utils/seller-notifications";

async function unavailableProductError(
  tx: OrderTransaction,
  productId: string,
  buyerId: string,
) {
  const [product] = await tx
    .select({ userId: sellers_product.userId })
    .from(sellers_product)
    .where(eq(sellers_product.id, productId))
    .limit(1);
  if (!product) return new OrderError(404, "Product not found");
  if (product.userId === buyerId) {
    return new OrderError(403, "You cannot reserve items from your own stall. Please select produce from another local seller.");
  }
  return new OrderError(409, "Product price or quantity is unavailable");
}

async function notifyStockLevel(
  tx: OrderTransaction,
  product: typeof sellers_product.$inferSelect,
  quantity: number,
) {
  const after = Number(product.productQty ?? 0);
  const before = after + quantity;
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

export async function reserveOrderItem(
  tx: OrderTransaction,
  buyerId: string,
  productId: string,
  quantity: number,
): Promise<ReservedOrderItem> {
  if (quantityToHundredths(quantity) === null) {
    throw new OrderError(
      400,
      "Quantity must be between 0.01 and 99999999 with at most two decimal places",
    );
  }
  await applySellerProductPriceReduction(tx, productId);
  const [product] = await tx
    .update(sellers_product)
    .set({ productQty: sql`${sellers_product.productQty} - ${quantity}` })
    .where(
      and(
        eq(sellers_product.id, productId),
        ne(sellers_product.userId, buyerId),
        isNotNull(sellers_product.productPrice),
        gt(sellers_product.productPrice, "0"),
        gte(sellers_product.productQty, quantity.toString()),
        eq(sellers_product.isActive, true),
        eq(sellers_product.isMarketable, true),
      ),
    )
    .returning();
  if (!product) throw await unavailableProductError(tx, productId, buyerId);
  await requireActiveUser(tx, product.userId, "seller");
  await requireVerifiedSeller(tx, product.userId);
  await notifyStockLevel(tx, product, quantity);
  return {
    productId: product.id,
    sellerId: product.userId,
    productName: product.productName,
    scalingType: product.scalingType,
    quantity,
    unitPrice: product.productPrice!,
    subtotal: multiplyPrice(product.productPrice!, quantity),
  };
}
