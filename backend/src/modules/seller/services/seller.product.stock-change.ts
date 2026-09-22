import { and, eq } from "drizzle-orm";
import { db } from "../../../db";
import { listing_cycles, product_stock_adjustments, sellers_product } from "../../../db/schema";
import { quantityToHundredths } from "../../../utils/order-amount";
import { OrderError } from "../../../utils/order-types";
import { requireVerifiedSeller } from "../../../utils/seller-access";
import { normalizeVegetableName } from "../../../utils/vegetable-identity";

const maxHundredths = 9_999_999_999n;

function fromDecimal(value: string): bigint {
  const match = /^(\d+)(?:\.(\d{1,2}))?$/.exec(value);
  if (!match) throw new OrderError(409, "Product stock is unavailable");
  return BigInt(match[1]) * 100n + BigInt((match[2] ?? "").padEnd(2, "0"));
}

function toDecimal(value: bigint): string {
  const absolute = value < 0n ? -value : value;
  return `${value < 0n ? "-" : ""}${absolute / 100n}.${(absolute % 100n).toString().padStart(2, "0")}`;
}

export function changeSellerProductStock(
  sellerId: string,
  productId: string,
  delta: number,
  reason: string,
) {
  const change = quantityToHundredths(Math.abs(delta));
  if (!change || delta === 0) {
    throw new OrderError(400, "Stock change must be nonzero with at most two decimal places");
  }
  const cleanReason = reason.trim();
  if (!cleanReason || cleanReason.length > 500) throw new OrderError(400, "Stock change reason is required");
  const signedChange = delta < 0 ? -change : change;

  return db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId);
    const [product] = await tx.select().from(sellers_product).where(and(
      eq(sellers_product.id, productId), eq(sellers_product.userId, sellerId),
    )).for("update").limit(1);
    if (!product) throw new OrderError(404, "Product not found");

    const before = fromDecimal(product.productQty ?? "0.00");
    const after = before + signedChange;
    if (after < 0n || after > maxHundredths) {
      throw new OrderError(409, "Stock change exceeds available quantity or product limit");
    }

    const newCycle = product.isActive && before === 0n && signedChange > 0n;
    const initializeLegacy = product.isActive && product.originalQty === null && after > 0n;
    let originalQty = product.originalQty;
    if (newCycle || initializeLegacy) originalQty = toDecimal(after);
    else if (product.isActive && signedChange > 0n && originalQty !== null) {
      const originalAfter = fromDecimal(originalQty) + signedChange;
      if (originalAfter > maxHundredths) throw new OrderError(409, "Original quantity exceeds product limit");
      originalQty = toDecimal(originalAfter);
    }

    const now = new Date();
    const [updated] = await tx.update(sellers_product).set({
      productQty: toDecimal(after),
      ...(originalQty !== product.originalQty ? { originalQty } : {}),
      ...(newCycle || initializeLegacy ? { publishedAt: now } : {}),
      updatedAt: now,
    }).where(eq(sellers_product.id, productId)).returning();

    if ((newCycle || initializeLegacy) && originalQty) {
      await tx.insert(listing_cycles).values({
        productId,
        vegetableKey: normalizeVegetableName(product.productName),
        startedAt: now,
        originalQty,
      });
    }
    await tx.insert(product_stock_adjustments).values({
      productId,
      sellerId,
      delta: toDecimal(signedChange),
      beforeQty: toDecimal(before),
      afterQty: toDecimal(after),
      reason: cleanReason,
    });
    return updated;
  });
}
