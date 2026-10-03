import { apiRequest } from "@/src/lib/api";

export const BUYER_PROFILE_IMAGE_UPDATED_EVENT = "agrivive:buyer-profile-image-updated";

export type BuyerProfileResponse = {
  account: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
};

export function getBuyerProfile() {
  return apiRequest<BuyerProfileResponse>("/buyer/profile");
}

export function uploadBuyerAvatar(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return apiRequest<{ success: boolean; imageUrl: string }>("/buyer/profile/avatar", {
    method: "POST",
    body: formData,
  });
}
