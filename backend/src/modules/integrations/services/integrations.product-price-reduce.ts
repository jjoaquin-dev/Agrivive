import { and, eq } from "drizzle-orm";
import { db } from "../../../db";
import { seller_social_campaigns, sellers_product } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";

function cents(value: string): bigint {
  const match = /^(\d+)(?:\.(\d{1,2}))?$/.exec(value);
  if (!match) throw new Error("Invalid price amount");
  return BigInt(match[1]) * 100n + BigInt((match[2] ?? "").padEnd(2, "0"));
}

function decimal(centsValue: bigint): string {
  return `${centsValue / 100n}.${(centsValue % 100n).toString().padStart(2, "0")}`;
}

export async function reduceSellerProductPriceByPercent(identifier: string) {
  return await db.transaction(async (tx) => {
    let productId = identifier;
    const [campaign] = await tx.select({ productId: seller_social_campaigns.productId })
      .from(seller_social_campaigns)
      .where(eq(seller_social_campaigns.id, identifier))
      .limit(1);

    if (campaign) {
      productId = campaign.productId;
    }

    const [product] = await tx.select().from(sellers_product)
      .where(eq(sellers_product.id, productId))
      .for("update")
      .limit(1);

    if (!product) throw new OrderError(404, "Product not found");
    if (!product.isActive || !product.isMarketable || Number(product.productQty ?? 0) <= 0 || !product.productPrice) {
      return {
        success: false,
        inStock: false,
        message: "Produce is sold out or inactive",
        productId: product.id,
        productName: product.productName,
        currentPrice: product.productPrice ?? "0.00",
        stock: product.productQty ?? "0",
      };
    }

    const currentCents = cents(product.productPrice);
    const floorCents = product.minimumPrice ? cents(product.minimumPrice) : 0n;

    const configuredPercent = Number(product.priceReductionPercent ?? 0);
    const percent = configuredPercent > 0 ? configuredPercent : 10;
    const basisPoints = BigInt(Math.round(percent * 100));

    const reducedCents = (currentCents * (10_000n - basisPoints) + 5_000n) / 10_000n;
    const nextCents = reducedCents < floorCents ? floorCents : reducedCents;

    if (nextCents >= currentCents) {
      return {
        success: false,
        inStock: true,
        atFloor: true,
        message: "Product has already reached seller minimum price floor",
        productId: product.id,
        productName: product.productName,
        originalPrice: decimal(currentCents),
        newPrice: decimal(currentCents),
        discountPercent: 0,
        periodsApplied: product.priceReductionPeriodsApplied ?? 0,
        stock: product.productQty ?? "0",
        currentPrice: decimal(currentCents),
      };
    }

    const nextPeriods = (product.priceReductionPeriodsApplied ?? 0) + 1;
    const [updated] = await tx.update(sellers_product).set({
      productPrice: decimal(nextCents),
      priceReductionPeriodsApplied: nextPeriods,
      updatedAt: new Date(),
    }).where(eq(sellers_product.id, productId)).returning();

    return {
      success: true,
      inStock: true,
      productId: updated.id,
      productName: updated.productName,
      originalPrice: decimal(currentCents),
      newPrice: decimal(nextCents),
      discountPercent: percent,
      periodsApplied: nextPeriods,
      stock: updated.productQty,
    };
  });
}
