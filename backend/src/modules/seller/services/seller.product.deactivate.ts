import { archiveSellerProduct } from "./seller.product.archive";

export function deactivateSellerProduct(sellerId: string, productId: string) {
  return archiveSellerProduct(sellerId, productId);
}
