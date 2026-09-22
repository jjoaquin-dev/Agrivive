import { changeSellerProductStock } from "./seller.product.stock-change";
import { OrderError } from "../../../utils/order-types";

export function restockSellerProduct(sellerId: string, productId: string, quantity: number) {
  if (quantity <= 0) throw new OrderError(400, "Restock quantity must be positive");
  return changeSellerProductStock(sellerId, productId, quantity, "Restock");
}
