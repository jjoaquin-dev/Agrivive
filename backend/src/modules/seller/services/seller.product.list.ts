import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { sellers_product } from "../../../db/schema";
import { requireVerifiedSeller } from "../../../utils/seller-access";
import { getProductImageDisplayUrl } from "../../../utils/product-image";

export async function listSellerProducts(sellerId: string) {
  const products = await db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId);
    return tx.select().from(sellers_product).where(eq(sellers_product.userId, sellerId));
  });
  return Promise.all(products.map(async (product) => ({
    ...product,
    displayImageUrl: await getProductImageDisplayUrl(product.imagUrl, sellerId),
  })));
}
