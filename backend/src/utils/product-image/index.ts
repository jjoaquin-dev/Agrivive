import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getS3Client } from "../s3";
import { OrderError } from "../order-types";

function imageLocation(imageUrl: string) {
  let url: URL;
  try { url = new URL(imageUrl); }
  catch { throw new OrderError(400, "A valid product image URL is required"); }
  if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) {
    throw new OrderError(400, "A valid product image URL is required");
  }
  const bucket = process.env.AWS_S3_BUCKET_NAME?.trim();
  const region = process.env.AWS_REGION || "ap-southeast-1";
  const ownedBucket = !!bucket && url.hostname === `${bucket}.s3.${region}.amazonaws.com`;
  return { url, bucket, ownedBucket };
}

export function validateProductImageReference(imageUrl: string, sellerId: string) {
  const { url, ownedBucket } = imageLocation(imageUrl);
  if (!ownedBucket) return; // Existing externally hosted product photos remain supported.
  const prefix = `/products/${encodeURIComponent(sellerId)}/`;
  if (url.protocol !== "https:" || url.port || url.search || url.hash ||
    !url.pathname.startsWith(prefix) ||
    !/^[0-9a-f-]{36}\.(jpg|png|webp)$/.test(url.pathname.slice(prefix.length))) {
    throw new OrderError(400, "Choose a product image uploaded by your seller account");
  }
}

export async function getProductImageDisplayUrl(imageUrl: string | null, sellerId: string) {
  if (!imageUrl) return null;
  try { validateProductImageReference(imageUrl, sellerId); }
  catch { return null; }
  const { url, bucket, ownedBucket } = imageLocation(imageUrl);
  if (!ownedBucket) return imageUrl;
  return getSignedUrl(getS3Client(), new GetObjectCommand({
    Bucket: bucket,
    Key: decodeURIComponent(url.pathname.slice(1)),
  }), { expiresIn: 3600 });
}
