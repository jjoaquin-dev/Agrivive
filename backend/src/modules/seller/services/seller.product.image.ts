import { uploadToS3 } from "../../../utils/s3";
import { OrderError } from "../../../utils/order-types";
import { getProductImageDisplayUrl } from "../../../utils/product-image";

export async function uploadSellerProductImage(
  sellerId: string,
  file: File,
): Promise<{ imageUrl: string; displayUrl: string }> {
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

  const uuid = crypto.randomUUID();
  const key = `products/${sellerId}/${uuid}.${ext}`;

  try {
    const imageUrl = await uploadToS3({
      buffer,
      key,
      contentType: file.type || "image/jpeg",
    });

    const displayUrl = (await getProductImageDisplayUrl(imageUrl, sellerId)) || imageUrl;

    return { imageUrl, displayUrl };
  } catch (err: any) {
    console.error("[S3 Product Image Upload Error]:", err);
    throw new Error(err?.message || "Failed to upload product photo to AWS S3");
  }
}
