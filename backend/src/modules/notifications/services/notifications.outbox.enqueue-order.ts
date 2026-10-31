import type { OrderTransaction } from "../../../utils/order-types";
import { createSellerNotification } from "../../../utils/seller-notifications";

export async function enqueueOrderNotification(
  tx: OrderTransaction,
  sellerId: string,
  orderId: string,
  summary: string,
) {
  await createSellerNotification(tx, {
    sellerId,
    kind: "new_reservation",
    dedupeKey: `new-reservation:${orderId}`,
    orderId,
    payload: { summary },
  });
}
