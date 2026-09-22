import { changeSellerProductStock } from "./seller.product.stock-change";

export function adjustSellerProductStock(
  sellerId: string,
  productId: string,
  delta: number,
  reason: string,
) {
  return changeSellerProductStock(sellerId, productId, delta, reason);
}
