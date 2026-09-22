import { File } from "expo-file-system";
import { apiFetch, authClient } from "./client";

export interface SellerProfile {
  id: string;
  userId: string;
  shopName: string;
  detailAddress: string;
  latitude: number | null;
  longitude: number | null;
  phoneNumber: string | null;
  isCurrent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VerifiedBadge {
  label: string;
  explanation: string;
}

export interface SellerSetupResponse {
  account: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
  profile: SellerProfile | null;
  emailVerified: boolean;
  profileComplete: boolean;
  sellerVerified: boolean;
  twoFactorEnabled: boolean;
  badge: VerifiedBadge | null;
  nextStep: "verify-email" | "profile" | "ready";
}

export interface SellerProfileCreateInput {
  shopName: string;
  detailAddress: string;
  latitude: number;
  longitude: number;
  phoneNumber: string;
}

export interface SellerProfileUpdateInput {
  shopName?: string;
  detailAddress?: string;
  latitude?: number;
  longitude?: number;
  phoneNumber?: string;
}

export async function fetchSellerSetup(): Promise<SellerSetupResponse> {
  return apiFetch<SellerSetupResponse>("/seller/setup");
}

export async function fetchSellerProfile(): Promise<SellerProfile> {
  return apiFetch<SellerProfile>("/seller/profile");
}

export async function createSellerProfile(
  input: SellerProfileCreateInput,
): Promise<{ message: string; profile: SellerProfile }> {
  try {
    return await apiFetch<{ message: string; profile: SellerProfile }>(
      "/seller/profile",
      {
        method: "POST",
        body: JSON.stringify(input),
      },
    );
  } catch (err: any) {
    // Graceful recovery: If profile already exists (409 conflict from interrupted save),
    // update the current profile instead of failing
    if (err?.statusCode === 409) {
      const updated = await updateSellerProfile(input);
      return { message: "Seller profile updated", profile: updated.profile };
    }
    throw err;
  }
}

export async function updateSellerProfile(
  input: SellerProfileUpdateInput,
): Promise<{ message: string; profile: SellerProfile }> {
  return apiFetch<{ message: string; profile: SellerProfile }>(
    "/seller/profile",
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );
}

export async function updateSellerPersonalName(name: string): Promise<void> {
  // Update name via Better Auth
  await authClient.updateUser({
    name: name.trim(),
  });
}

export async function uploadSellerAvatar(
  imageUri: string,
): Promise<{ success: boolean; imageUrl: string }> {
  const formData = new FormData();
  formData.append("file", new File(imageUri));

  return apiFetch<{ success: boolean; imageUrl: string }>("/seller/profile/avatar", {
    method: "POST",
    body: formData,
  });
}
