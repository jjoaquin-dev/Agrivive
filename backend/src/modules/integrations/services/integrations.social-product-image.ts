import { GetObjectCommand } from "@aws-sdk/client-s3";
import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { sellers_product } from "../../../db/schema";
import { getS3Client } from "../../../utils/s3";
import { validateProductImageReference } from "../../../utils/product-image";
import { OrderError } from "../../../utils/order-types";

export async function getPublicSocialProductImage(productId: string) {
  const [product] = await db.select({
    id: sellers_product.id,
    sellerId: sellers_product.userId,
    imageUrl: sellers_product.imagUrl,
    isActive: sellers_product.isActive,
    isMarketable: sellers_product.isMarketable,
    quantity: sellers_product.productQty,
    price: sellers_product.productPrice,
  }).from(sellers_product).where(eq(sellers_product.id, productId)).limit(1);
  if (!product?.imageUrl) throw new OrderError(404, "Product photo not found");
  // A Boost post may use any public, buyable listing.
  if (!product.isActive || !product.isMarketable || Number(product.quantity ?? 0) <= 0 || Number(product.price ?? 0) <= 0) {
    throw new OrderError(404, "Product photo not found");
  }


  try { validateProductImageReference(product.imageUrl, product.sellerId); }
  catch { throw new OrderError(404, "Product photo not found"); }

  const url = new URL(product.imageUrl);
  const bucket = process.env.AWS_S3_BUCKET_NAME?.trim();
  const region = process.env.AWS_REGION || "ap-southeast-1";
  if (!bucket || url.hostname !== `${bucket}.s3.${region}.amazonaws.com`) {
    throw new OrderError(404, "Product photo is not hosted on Agrivive storage");
  }

  const result = await getS3Client().send(new GetObjectCommand({
    Bucket: bucket,
    Key: decodeURIComponent(url.pathname.slice(1)),
  }));
  if (!result.Body) throw new OrderError(404, "Product photo not found");
  const extension = url.pathname.toLowerCase().split(".").pop();
  const contentType = extension === "png" ? "image/png" : extension === "webp" ? "image/webp" : "image/jpeg";
  return {
    body: result.Body.transformToWebStream(),
    contentType,
  };
}
