import { and, eq } from "drizzle-orm";
import { db } from "../../../db";
import { buyer_saved_products } from "../../../db/schema";

export async function removeBuyerWishlistProduct(buyerId: string, productId: string) {
  await db.delete(buyer_saved_products)
    .where(and(
      eq(buyer_saved_products.buyerId, buyerId),
      eq(buyer_saved_products.productId, productId),
    ));

  return { productId, saved: false };
}

