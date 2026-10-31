import { db } from "../../../db";
import { requireVerifiedSeller } from "../../../utils/seller-access";
import { readSellerAlertSettings } from "../../../utils/seller-notifications/enqueue";

export async function getSellerNotificationSettings(sellerId: string) {
  return db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId, true, true);
    return readSellerAlertSettings(tx, sellerId);
  });
}
