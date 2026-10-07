import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { user } from "../../../db/schema";
import { uploadToS3 } from "../../../utils/s3";
import { getAvatarDisplayUrl } from "../../../utils/s3-avatar";
import { OrderError } from "../../../utils/order-types";

export async function updateBuyerAvatar(
  userId: string,
  file: File,
): Promise<{ success: boolean; imageUrl: string }> {
  if (!file) throw new OrderError(400, "No image file provided");

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const key = `avatars/${userId}/${Date.now()}.${ext}`;

  try {
    const imageUrl = await uploadToS3({
      buffer,
      key,
      contentType: file.type || "image/jpeg",
    });
    await db.update(user).set({ image: imageUrl }).where(eq(user.id, userId));

    return {
      success: true,
      imageUrl: (await getAvatarDisplayUrl(imageUrl)) || imageUrl,
    };
  } catch (error: any) {
    console.error("[S3 Buyer Avatar Upload Error]:", error);
    throw new Error(error?.message || "Failed to upload profile picture to AWS S3");
  }
}
