import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getS3Client } from "./index";

export async function uploadPrivateObject(params: { buffer: Buffer; key: string; contentType: string }) {
  const bucket = process.env.AWS_S3_BUCKET_NAME?.trim();
  if (!bucket) throw new Error("AWS_S3_BUCKET_NAME is required");
  await getS3Client().send(new PutObjectCommand({
    Bucket: bucket,
    Key: params.key,
    Body: params.buffer,
    ContentType: params.contentType,
    CacheControl: "private, no-store",
  }));
  return params.key;
}
