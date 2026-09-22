import { File } from "expo-file-system";
import { apiFetch } from "../../../api/client";

export async function uploadProductImage(
  imageUri: string,
): Promise<{ imageUrl: string; displayUrl: string }> {
  const formData = new FormData();
  formData.append("file", new File(imageUri));

  return apiFetch<{ imageUrl: string; displayUrl: string }>(
    "/seller/product-images",
    {
      method: "POST",
      body: formData,
    },
  );
}
