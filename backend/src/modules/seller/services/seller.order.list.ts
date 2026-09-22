import { db } from "../../../db";
import { listOrders } from "../../../utils/order-read";
import type { OrderStatus } from "../../../utils/order-types";
import { sellerReadableOrderIds } from "../../../utils/seller-access";

export async function listSellerOrders(
  sellerId: string,
  limit = 20,
  cursor?: string,
  status?: OrderStatus,
) {
  const allowed = await db.transaction((tx) => sellerReadableOrderIds(tx, sellerId));
  return listOrders(sellerId, "seller", limit, cursor, allowed, status);
}
