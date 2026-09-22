import type { sellers_profile } from "../../db/schema";

export function isSellerProfileComplete(profile: typeof sellers_profile.$inferSelect | undefined): boolean {
  return !!profile?.isCurrent && !!profile.shopName.trim() && !!profile.detailAddress.trim() &&
    (profile.phoneNumber?.trim().length ?? 0) >= 7 &&
    profile.latitude !== null && Number.isFinite(profile.latitude) &&
    profile.latitude >= -90 && profile.latitude <= 90 &&
    profile.longitude !== null && Number.isFinite(profile.longitude) &&
    profile.longitude >= -180 && profile.longitude <= 180;
}
