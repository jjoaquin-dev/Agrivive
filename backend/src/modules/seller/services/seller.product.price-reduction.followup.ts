import { eq } from "drizzle-orm";
import { sellers_product } from "../../../db/schema";
import type { OrderTransaction } from "../../../utils/order-types";

function cents(value: string) {
  const match = /^(\d+)(?:\.(\d{1,2}))?$/.exec(value);
  if (!match) throw new Error("Invalid price amount");
  return BigInt(match[1]) * 100n + BigInt((match[2] ?? "").padEnd(2, "0"));
}

function decimal(value: bigint) {
  return `${value / 100n}.${(value % 100n).toString().padStart(2, "0")}`;
}

export async function applySellerPromotionPriceReduction(
  tx: OrderTransaction,
  productId: string,
  now = new Date(),
) {
  const [current] = await tx.select().from(sellers_product)
    .where(eq(sellers_product.id, productId)).for("update").limit(1);
  if (!current || !current.isActive || !current.isMarketable || Number(current.productQty ?? 0) <= 0 ||
    !current.productPrice || !current.minimumPrice || Number(current.priceReductionPercent ?? 0) <= 0) return null;

  const currentCents = cents(current.productPrice);
  const floor = cents(current.minimumPrice);
  if (currentCents <= floor) return null;
  const basisPoints = BigInt(Math.round(Number(current.priceReductionPercent) * 100));
  const reducedCents = (currentCents * (10_000n - basisPoints) + 5_000n) / 10_000n;
  const nextCents = reducedCents < floor ? floor : reducedCents;
  if (nextCents >= currentCents) return null;

  const [updated] = await tx.update(sellers_product).set({
    productPrice: decimal(nextCents),
    priceReductionPeriodsApplied: current.priceReductionPeriodsApplied + 1,
    updatedAt: now,
  }).where(eq(sellers_product.id, productId)).returning({
    productPrice: sellers_product.productPrice,
  });
  return updated ? { before: current.productPrice, after: updated.productPrice } : null;
}
