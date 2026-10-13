import { and, desc, eq } from "drizzle-orm";
import { db } from "../../../db";
import { seller_visibility_boosts, sellers_product } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";
import { requireVerifiedSeller } from "../../../utils/seller-access";

function errorMessage(status: string) {
  return status === "failed" ? "We could not send this boost. You can try again." : null;
}

export async function readSellerVisibilityBoost(sellerId: string, productId: string) {
  return db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId);
    const [product] = await tx.select({
      id: sellers_product.id,
      productName: sellers_product.productName,
      imageUrl: sellers_product.imagUrl,
    }).from(sellers_product).where(and(
      eq(sellers_product.id, productId),
      eq(sellers_product.userId, sellerId),
    )).limit(1);
    if (!product) throw new OrderError(404, "Product not found");

    const [boost] = await tx.select({
      id: seller_visibility_boosts.id,
      productId: seller_visibility_boosts.productId,
      productName: sellers_product.productName,
      imageUrl: sellers_product.imagUrl,
      reason: seller_visibility_boosts.reason,
      reductionPeriod: seller_visibility_boosts.reductionPeriod,
      status: seller_visibility_boosts.status,
      priceBefore: seller_visibility_boosts.priceBefore,
      priceAfter: seller_visibility_boosts.priceAfter,
      createdAt: seller_visibility_boosts.createdAt,
      sentAt: seller_visibility_boosts.sentAt,
    }).from(seller_visibility_boosts)
      .innerJoin(sellers_product, eq(sellers_product.id, seller_visibility_boosts.productId))
      .where(and(
        eq(seller_visibility_boosts.sellerId, sellerId),
        eq(seller_visibility_boosts.productId, productId),
      )).orderBy(desc(seller_visibility_boosts.createdAt)).limit(1);

    return {
      product,
      boost: boost ? { ...boost, errorMessage: errorMessage(boost.status) } : null,
    };
  });
}
