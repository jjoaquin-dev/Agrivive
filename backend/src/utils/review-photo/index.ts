import { OrderError } from "../order-types";
import { uploadPrivateObject } from "../s3/private-upload";
import { createPrivateDownloadUrl } from "../s3/private-download";

const maxBytes = 5 * 1024 * 1024;
const extensions: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

function hasImageHeader(type: string, buffer: Buffer) {
  if (type === "image/jpeg") return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  if (type === "image/png") return buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  return buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP";
}

/** Checks the picture is a real JPG, PNG or WebP under 5 MB, stores it privately and returns its key. */
export async function storeReviewPhoto(orderId: string, file: File) {
  if (!file || !extensions[file.type] || file.size > maxBytes) {
    throw new OrderError(400, "Use a JPG, PNG, or WebP photo under 5 MB");
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  if (!hasImageHeader(file.type, buffer)) throw new OrderError(400, "The photo content does not match its file type");
  const key = `private-reviews/${orderId}/${crypto.randomUUID()}.${extensions[file.type]}`;
  await uploadPrivateObject({ buffer, key, contentType: file.type });
  return key;
}

/** A short-lived link to show a review photo. Returns null when the link cannot be made. */
export async function reviewPhotoUrl(key: string | null | undefined) {
  if (!key) return null;
  try { return await createPrivateDownloadUrl(key, 3600); }
  catch { return null; }
}
