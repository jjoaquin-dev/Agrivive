import { File } from "expo-file-system";
import { shrinkImage } from "../../../utils/shrinkImage";
import { apiFetch, UPLOAD_TIMEOUT_MS } from "../../../api/client";

export async function uploadProductImage(
  imageUri: string,
): Promise<{ imageUrl: string; displayUrl: string }> {
  const formData = new FormData();
  formData.append("file", new File(await shrinkImage(imageUri)));

  return apiFetch<{ imageUrl: string; displayUrl: string }>(
    "/seller/product-images",
    {
      method: "POST",
      body: formData,
    },
    UPLOAD_TIMEOUT_MS,
  );
}
