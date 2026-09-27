import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { sellers_product } from "../../../db/schema";
import { requireVerifiedSeller } from "../../../utils/seller-access";
import { getProductImageDisplayUrl } from "../../../utils/product-image";
import { applySellerProductPriceReduction } from "./seller.product.price-reduction";

export async function listSellerProducts(sellerId: string) {
  const products = await db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId);
    const products = await tx.select().from(sellers_product).where(eq(sellers_product.userId, sellerId));
    const updatedProducts = [];
    for (const product of products) {
      updatedProducts.push(await applySellerProductPriceReduction(tx, product.id));
    }
    return updatedProducts;
  });
  return Promise.all(products.filter((product): product is NonNullable<typeof product> => product !== null).map(async (product) => ({
    ...product,
    displayImageUrl: await getProductImageDisplayUrl(product.imagUrl, sellerId),
  })));
}
