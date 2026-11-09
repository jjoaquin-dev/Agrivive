import { apiRequest } from "@/src/lib/api";

export type SellerFollowState = { sellerId: string; following: boolean };

export type FollowedSeller = {
  sellerId: string;
  followedAt: string;
  shopName: string;
  address: string;
  image: string | null;
};

export function listSellerFollows(signal?: AbortSignal) {
  return apiRequest<{ sellers: FollowedSeller[] }>("/buyer/follows", { signal });
}

export function getSellerFollow(sellerId: string, signal?: AbortSignal) {
  return apiRequest<SellerFollowState>(`/buyer/follows/${encodeURIComponent(sellerId)}`, { signal });
}

export function saveSellerFollow(sellerId: string) {
  return apiRequest<SellerFollowState>(`/buyer/follows/${encodeURIComponent(sellerId)}`, { method: "POST" });
}

export function removeSellerFollow(sellerId: string) {
  return apiRequest<SellerFollowState>(`/buyer/follows/${encodeURIComponent(sellerId)}`, { method: "DELETE" });
}
