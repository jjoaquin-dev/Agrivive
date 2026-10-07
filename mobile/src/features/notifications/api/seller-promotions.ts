import { apiFetch } from "../../../api/client";
import type { SellerPromotion, SellerPromotionSharePayload, SellerPromotionsResponse } from "../types";

export function fetchSellerPromotions(params: { limit?: number; cursor?: string } = {}) {
  const query = new URLSearchParams();
  if (params.limit) query.set("limit", String(params.limit));
  if (params.cursor) query.set("cursor", params.cursor);
  const suffix = query.toString() ? `?${query.toString()}` : "";
  return apiFetch<SellerPromotionsResponse>(`/seller/promotions${suffix}`);
}

export function markSellerPromotionRead(id: string) {
  return apiFetch<{ id: string; readAt: string }>(`/seller/promotions/${id}/read`, { method: "POST" });
}

export function markAllSellerPromotionsRead() {
  return apiFetch<{ updatedCount: number }>("/seller/promotions/read-all", { method: "POST" });
}

export function getSellerPromotionShare(id: string) {
  return apiFetch<SellerPromotionSharePayload>(`/seller/promotions/${id}/share`);
}
