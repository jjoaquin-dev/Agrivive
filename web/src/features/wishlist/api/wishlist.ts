import { apiRequest } from "@/src/lib/api";
import type { BuyerWishlistMutation, BuyerWishlistResponse } from "../types";

export function listBuyerWishlist(signal?: AbortSignal) {
  return apiRequest<BuyerWishlistResponse>("/buyer/wishlist", { signal });
}

export function saveBuyerWishlistProduct(productId: string) {
  return apiRequest<BuyerWishlistMutation>(`/buyer/wishlist/${encodeURIComponent(productId)}`, {
    method: "POST",
  });
}

export function removeBuyerWishlistProduct(productId: string) {
  return apiRequest<BuyerWishlistMutation>(`/buyer/wishlist/${encodeURIComponent(productId)}`, {
    method: "DELETE",
  });
}

