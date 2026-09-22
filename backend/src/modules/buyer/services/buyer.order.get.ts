import { getOrder } from "../../../utils/order-read";

export function getBuyerOrder(orderId: string, buyerId: string) {
  return getOrder(orderId, buyerId, "buyer");
}
