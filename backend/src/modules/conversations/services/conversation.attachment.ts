import { randomUUID } from "node:crypto";
import { uploadToS3 } from "../../../utils/s3";
import { getConversationAttachmentDisplayUrl } from "../../../utils/s3-conversation";
import { ConversationError } from "./conversation.error";

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function uploadConversationAttachment(userId: string, file: File) {
  if (!allowedMimeTypes.includes(file.type)) {
    throw new ConversationError(400, "Only JPG, PNG, WebP, and GIF images are allowed");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : file.type === "image/gif" ? "gif" : "jpg";
  const key = `conversations/${userId}/${randomUUID()}.${ext}`;

  await uploadToS3({ buffer, key, contentType: file.type });
  const displayUrl = await getConversationAttachmentDisplayUrl(key);
  const safeFilename = file.name
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/\.{2,}/g, ".")
    .slice(0, 100);
  return { url: displayUrl, filename: safeFilename || "attachment" };
}
