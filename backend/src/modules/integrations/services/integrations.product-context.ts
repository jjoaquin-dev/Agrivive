import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { seller_social_campaigns, sellers_product, sellers_profile, user } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";

export async function getProductUnifiedContext(identifier: string) {
  let productId = identifier;

  const [campaign] = await db.select({ productId: seller_social_campaigns.productId })
    .from(seller_social_campaigns)
    .where(eq(seller_social_campaigns.id, identifier))
    .limit(1);

  if (campaign) {
    productId = campaign.productId;
  }

  const [row] = await db.select({
    id: sellers_product.id,
    productName: sellers_product.productName,
    productPrice: sellers_product.productPrice,
    basePrice: sellers_product.basePrice,
    productQty: sellers_product.productQty,
    scalingType: sellers_product.scalingType,
    shopName: sellers_profile.shopName,
    sellerName: user.name,
  }).from(sellers_product)
    .innerJoin(sellers_profile, eq(sellers_profile.userId, sellers_product.userId))
    .innerJoin(user, eq(user.id, sellers_product.userId))
    .where(eq(sellers_product.id, productId))
    .limit(1);

  if (!row) throw new OrderError(404, "Product not found");

  const apiBase = (process.env.SOCIAL_PUBLIC_API_URL || "https://api.agrivive.tech").replace(/\/$/, "");

  return {
    id: row.id,
    productId: row.id,
    productName: row.productName,
    productPrice: row.productPrice,
    basePrice: row.basePrice,
    productQty: row.productQty,
    scalingType: row.scalingType,
    shopName: row.shopName,
    sellerName: row.sellerName,
    listingUrl: `https://agrivive.tech/marketplace/${row.id}`,
    imageUrl: `${apiBase}/integrations/media/social-products/${row.id}`,
  };
}
