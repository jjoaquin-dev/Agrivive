import { and, eq } from "drizzle-orm";
import { db } from "../../../db";
import { sellers_product } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";
import { requireVerifiedSeller } from "../../../utils/seller-access";
import { getProductImageDisplayUrl } from "../../../utils/product-image";

export async function getSellerProduct(sellerId: string, productId: string) {
  const product = await db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId);
    const [product] = await tx.select().from(sellers_product).where(and(
      eq(sellers_product.id, productId), eq(sellers_product.userId, sellerId),
    )).limit(1);
    if (!product) throw new OrderError(404, "Product not found");
    return product;
  });
  return { ...product, displayImageUrl: await getProductImageDisplayUrl(product.imagUrl, sellerId) };
}
