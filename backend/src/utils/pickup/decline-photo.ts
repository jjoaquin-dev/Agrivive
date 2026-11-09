import { createHash } from "node:crypto";
import { OrderError } from "../order-types";
import { uploadPrivateObject } from "../s3/private-upload";
import { DECLINE_PHOTO_MAX_AGE_MINUTES } from "./decline-reasons";

const maxBytes = 5 * 1024 * 1024;
const extensions: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

function hasImageHeader(type: string, buffer: Buffer) {
  if (type === "image/jpeg") return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  if (type === "image/png") return buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  return buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP";
}

/**
 * Checks a real photo, hashes it so a reused picture can be found, and stores it privately.
 * `capturedAt` comes from the in-app camera; a photo older than a few minutes is refused.
 */
export async function storeDeclinePhoto(orderId: string, file: File | undefined, owner: "buyer" | "seller", capturedAt?: string) {
  if (!file || !extensions[file.type] || file.size > maxBytes || file.size === 0) {
    throw new OrderError(400, "Take a photo with the camera in the app (JPG, PNG or WebP, under 5 MB).");
  }
  if (capturedAt) {
    const taken = new Date(capturedAt).getTime();
    if (Number.isNaN(taken) || Date.now() - taken > DECLINE_PHOTO_MAX_AGE_MINUTES * 60_000 || taken - Date.now() > 5 * 60_000) {
      throw new OrderError(400, "That photo is too old. Please take a new photo in the app.");
    }
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  if (!hasImageHeader(file.type, buffer)) throw new OrderError(400, "The photo content does not match its file type");
  const hash = createHash("sha256").update(buffer).digest("hex");
  const key = `private-declines/${orderId}/${owner}-${crypto.randomUUID()}.${extensions[file.type]}`;
  await uploadPrivateObject({ buffer, key, contentType: file.type });
  return { key, hash };
}
