import { and, eq, gt, isNotNull } from "drizzle-orm";
import { db } from "../../../db";
import { buyer_saved_products, sellers_product, sellers_profile, user } from "../../../db/schema";
import { marketplaceSellerVisibility } from "../../marketplace/services/marketplace.visibility";
import { OrderError } from "../../../utils/order-types";

export async function saveBuyerWishlistProduct(buyerId: string, productId: string) {
  const [product] = await db.select({ id: sellers_product.id })
    .from(sellers_product)
    .innerJoin(user, eq(user.id, sellers_product.userId))
    .innerJoin(sellers_profile, eq(sellers_profile.userId, sellers_product.userId))
    .where(and(
      eq(sellers_product.id, productId),
      eq(sellers_product.isActive, true),
      eq(sellers_product.isMarketable, true),
      gt(sellers_product.productQty, "0"),
      gt(sellers_product.productPrice, "0"),
      isNotNull(sellers_product.publishedAt),
      marketplaceSellerVisibility(),
    )).limit(1);

  if (!product) throw new OrderError(404, "Marketplace product not found");

  await db.insert(buyer_saved_products)
    .values({ buyerId, productId })
    .onConflictDoNothing({ target: [buyer_saved_products.buyerId, buyer_saved_products.productId] });

  return { productId, saved: true };
}

