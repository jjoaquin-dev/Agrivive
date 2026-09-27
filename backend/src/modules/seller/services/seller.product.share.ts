import { and, eq, gt } from "drizzle-orm";
import { db } from "../../../db";
import { sellers_product } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";
import { requireVerifiedSeller } from "../../../utils/seller-access";
import { getProductImageDisplayUrl } from "../../../utils/product-image";

export async function getSellerProductShare(sellerId: string, productId: string) {
  const product = await db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId);
    const [row] = await tx.select().from(sellers_product).where(and(
      eq(sellers_product.id, productId), eq(sellers_product.userId, sellerId),
      eq(sellers_product.isActive, true), eq(sellers_product.isMarketable, true),
      gt(sellers_product.productQty, "0"),
    )).limit(1);
    if (!row) throw new OrderError(404, "Active product not found");
    return row;
  });

  const baseUrl = (process.env.WEB_APP_URL ?? process.env.WEB_TRUSTED_ORIGINS?.split(",")[0] ?? "")
    .trim().replace(/\/$/, "");
  const path = `/marketplace/${product.id}`;
  let shareUrl = path;
  if (baseUrl) {
    try { shareUrl = new URL(path, baseUrl).toString(); }
    catch { /* Keep the relative path when the configured origin is invalid. */ }
  }
  const imageUrl = product.imagUrl ? await getProductImageDisplayUrl(product.imagUrl, sellerId) : null;
  const price = product.productPrice ? ` for PHP ${Number(product.productPrice).toFixed(2)}` : "";
  return {
    productId: product.id,
    shareUrl,
    caption: `${product.productName}${price} from Agrivive. See listing details and pickup information: ${shareUrl}`,
    imageUrl,
  };
}
