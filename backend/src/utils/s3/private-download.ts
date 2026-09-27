import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getS3Client } from "./index";

export async function createPrivateDownloadUrl(key: string) {
  const bucket = process.env.AWS_S3_BUCKET_NAME?.trim();
  if (!bucket) throw new Error("AWS_S3_BUCKET_NAME is required");
  return getSignedUrl(getS3Client(), new GetObjectCommand({ Bucket: bucket, Key: key }), { expiresIn: 300 });
}
