import { apiRequest } from "@/src/lib/api";

export type SellerFollowState = { sellerId: string; following: boolean };

export function getSellerFollow(sellerId: string, signal?: AbortSignal) {
  return apiRequest<SellerFollowState>(`/buyer/follows/${encodeURIComponent(sellerId)}`, { signal });
}

export function saveSellerFollow(sellerId: string) {
  return apiRequest<SellerFollowState>(`/buyer/follows/${encodeURIComponent(sellerId)}`, { method: "POST" });
}

export function removeSellerFollow(sellerId: string) {
  return apiRequest<SellerFollowState>(`/buyer/follows/${encodeURIComponent(sellerId)}`, { method: "DELETE" });
}
