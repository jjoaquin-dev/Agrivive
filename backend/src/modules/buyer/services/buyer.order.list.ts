import { listOrders } from "../../../utils/order-read";

export function listBuyerOrders(buyerId: string, limit = 20, cursor?: string) {
  return listOrders(buyerId, "buyer", limit, cursor);
}
