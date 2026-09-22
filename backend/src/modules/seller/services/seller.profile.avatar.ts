import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { user } from "../../../db/schema";
import { uploadToS3 } from "../../../utils/s3";
import { OrderError } from "../../../utils/order-types";

export async function updateSellerAvatar(
  userId: string,
  file: File,
): Promise<{ success: boolean; imageUrl: string }> {
  if (!file) {
    throw new OrderError(400, "No image file provided");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const ext =
    file.type === "image/png"
      ? "png"
      : file.type === "image/webp"
      ? "webp"
      : "jpg";
  const key = `avatars/${userId}/${Date.now()}.${ext}`;

  try {
    const imageUrl = await uploadToS3({
      buffer,
      key,
      contentType: file.type || "image/jpeg",
    });

    await db.update(user).set({ image: imageUrl }).where(eq(user.id, userId));

    return { success: true, imageUrl };
  } catch (err: any) {
    console.error("[S3 Avatar Upload Error]:", err);
    throw new Error(err?.message || "Failed to upload profile picture to AWS S3");
  }
}
