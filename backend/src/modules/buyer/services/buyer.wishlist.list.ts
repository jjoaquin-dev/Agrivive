import { desc, eq } from "drizzle-orm";
import { db } from "../../../db";
import { buyer_saved_products } from "../../../db/schema";

export async function listBuyerWishlist(buyerId: string) {
  const rows = await db.select({ productId: buyer_saved_products.productId })
    .from(buyer_saved_products)
    .where(eq(buyer_saved_products.buyerId, buyerId))
    .orderBy(desc(buyer_saved_products.createdAt));

  return { productIds: rows.map((row) => row.productId) };
}

