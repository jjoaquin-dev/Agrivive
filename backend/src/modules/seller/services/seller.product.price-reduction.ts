import { and, eq } from "drizzle-orm";
import { sellers_product } from "../../../db/schema";
import type { OrderTransaction } from "../../../utils/order-types";

const PRICE_PERIOD_MS = 12 * 60 * 60 * 1000;

function cents(value: string) {
  const match = /^(\d+)(?:\.(\d{1,2}))?$/.exec(value);
  if (!match) throw new Error("Invalid price amount");
  return BigInt(match[1]) * 100n + BigInt((match[2] ?? "").padEnd(2, "0"));
}

function decimal(centsValue: bigint) {
  return `${centsValue / 100n}.${(centsValue % 100n).toString().padStart(2, "0")}`;
}

function nextReductionAt(product: typeof sellers_product.$inferSelect) {
  if (!product.priceScheduleStartedAt || Number(product.priceReductionPercent ?? 0) <= 0 ||
    !product.minimumPrice || !product.productPrice || cents(product.productPrice) <= cents(product.minimumPrice)) return null;
  return new Date(
    product.priceScheduleStartedAt.getTime() +
      (product.priceReductionPeriodsApplied + 1) * PRICE_PERIOD_MS,
  ).toISOString();
}

export async function applySellerProductPriceReduction(
  tx: OrderTransaction,
  productId: string,
  now = new Date(),
) {
  const [current] = await tx.select().from(sellers_product).where(
    eq(sellers_product.id, productId),
  ).for("update").limit(1);
  if (!current) return null;

  const reductionPercent = Number(current.priceReductionPercent ?? "0");
  if (!current.priceScheduleStartedAt || reductionPercent <= 0 || !current.minimumPrice ||
    !current.productPrice || now < current.priceScheduleStartedAt) {
    return { ...current, nextPriceReductionAt: nextReductionAt(current) };
  }

  const targetPeriods = Math.floor(
    (now.getTime() - current.priceScheduleStartedAt.getTime()) / PRICE_PERIOD_MS,
  );
  if (targetPeriods <= current.priceReductionPeriodsApplied) {
    return { ...current, nextPriceReductionAt: nextReductionAt(current) };
  }

  const basisPoints = BigInt(Math.round(reductionPercent * 100));
  const floor = cents(current.minimumPrice);
  let currentCents = cents(current.productPrice);
  for (let period = current.priceReductionPeriodsApplied; period < targetPeriods; period += 1) {
    currentCents = (currentCents * (10_000n - basisPoints) + 5_000n) / 10_000n;
    if (currentCents <= floor) {
      currentCents = floor;
      break;
    }
  }

  const [updated] = await tx.update(sellers_product).set({
    productPrice: decimal(currentCents),
    priceReductionPeriodsApplied: targetPeriods,
    updatedAt: now,
  }).where(and(eq(sellers_product.id, productId))).returning();
  return updated ? { ...updated, nextPriceReductionAt: nextReductionAt(updated) } : null;
}
