import { db } from "../../../db";
import { getOrder } from "../../../utils/order-read";
import { requireSellerScanAccess } from "../../../utils/seller-access";

export async function readSellerOrder(orderId: string, sellerId: string) {
  await db.transaction((tx) => requireSellerScanAccess(tx, sellerId, orderId));
  return getOrder(orderId, sellerId, "seller");
}
