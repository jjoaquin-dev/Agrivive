import { GetObjectCommand } from "@aws-sdk/client-s3";
import { and, desc, eq, lte } from "drizzle-orm";
import { db } from "../../../db";
import { listing_cycles, sellers_product } from "../../../db/schema";
import { getPriorityPromotionEligibility } from "../../../utils/promotion-eligibility";
import { getS3Client } from "../../../utils/s3";
import { validateProductImageReference } from "../../../utils/product-image";
import { OrderError } from "../../../utils/order-types";

export async function getPublicSocialProductImage(productId: string) {
  const [product] = await db.select({ id: sellers_product.id, sellerId: sellers_product.userId, imageUrl: sellers_product.imagUrl })
    .from(sellers_product).where(eq(sellers_product.id, productId)).limit(1);
  if (!product?.imageUrl) throw new OrderError(404, "Product photo not found");

  const [cycle] = await db.select({ id: listing_cycles.id }).from(listing_cycles)
    .where(and(eq(listing_cycles.productId, product.id), lte(listing_cycles.startedAt, new Date())))
    .orderBy(desc(listing_cycles.startedAt)).limit(1);
  if (!cycle) throw new OrderError(404, "Product photo not found");
  const eligibility = await getPriorityPromotionEligibility(cycle.id);
  if (!eligibility?.eligible || eligibility.sellerId !== product.sellerId) {
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
