import { apiFetch } from "../../../api/client";

export interface SellerProductShare {
  productId: string;
  shareUrl: string;
  caption: string;
  imageUrl: string | null;
}

export function getSellerProductShare(productId: string) {
  return apiFetch<SellerProductShare>(`/seller/products/${encodeURIComponent(productId)}/share`);
}
