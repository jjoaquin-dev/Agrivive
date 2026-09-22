import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getS3Client } from "../s3";

export async function getAvatarDisplayUrl(imageUrl: string | null): Promise<string | null> {
  if (!imageUrl) return null;

  let url: URL;
  try {
    url = new URL(imageUrl);
  } catch {
    return null;
  }

  const bucket = process.env.AWS_S3_BUCKET_NAME?.trim();
  const region = process.env.AWS_REGION || "ap-southeast-1";
  const bucketOrigin = `https://${bucket}.s3.${region}.amazonaws.com`;

  // Preserve existing external images without signing arbitrary hosts or keys.
  if (!bucket || url.origin !== bucketOrigin) {
    return url.protocol === "https:" || url.protocol === "http:" ? imageUrl : null;
  }
  if (url.username || url.password || !url.pathname.startsWith("/avatars/")) return null;

  let objectKey: string;
  try {
    objectKey = decodeURIComponent(url.pathname.slice(1));
  } catch {
    return null;
  }

  return getSignedUrl(
    getS3Client(),
    new GetObjectCommand({ Bucket: bucket, Key: objectKey }),
    { expiresIn: 3600 },
  );
}
