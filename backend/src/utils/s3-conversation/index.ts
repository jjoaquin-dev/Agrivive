import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getS3Client } from "../s3";

export async function getConversationAttachmentDisplayUrl(urlOrKey: string): Promise<string> {
  const bucket = process.env.AWS_S3_BUCKET_NAME?.trim();
  if (!bucket) return urlOrKey;

  let key = urlOrKey;
  const match = urlOrKey.match(/conversations\/[a-zA-Z0-9_\-\/]+\.(?:png|jpg|jpeg|webp|gif)/i);
  if (match) {
    key = match[0];
  } else if (!key.startsWith("conversations/")) {
    return urlOrKey;
  }

  try {
    return await getSignedUrl(
      getS3Client(),
      new GetObjectCommand({ Bucket: bucket, Key: key }),
      { expiresIn: 86400 },
    );
  } catch (err) {
    console.error("[Conversation S3 Presign Error]:", err);
    return urlOrKey;
  }
}

export async function presignConversationMessageBody(body: string): Promise<string> {
  const match = body.match(/(https?:\/\/[^\s\)\'\"]+?conversations\/[^\s\)\'\"]+?\.(?:png|jpg|jpeg|webp|gif)(?:\?[^\s\)\'\"]*)?)/i);
  if (!match) return body;

  const rawUrl = match[1];
  const signedUrl = await getConversationAttachmentDisplayUrl(rawUrl);
  return body.replace(rawUrl, signedUrl);
}
