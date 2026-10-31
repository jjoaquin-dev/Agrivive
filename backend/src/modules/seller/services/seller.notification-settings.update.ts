import { db } from "../../../db";
import { seller_notification_settings } from "../../../db/schema";
import { requireVerifiedSeller } from "../../../utils/seller-access";
import { readSellerAlertSettings } from "../../../utils/seller-notifications/enqueue";
import type { SellerNotificationSettingsBody } from "../model/seller.notification-settings";

export async function updateSellerNotificationSettings(sellerId: string, body: SellerNotificationSettingsBody) {
  return db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId, true, true);
    const changes = {
      ...(body.stockPrice !== undefined ? { stockPrice: body.stockPrice } : {}),
      ...(body.boost !== undefined ? { boost: body.boost } : {}),
      ...(body.account !== undefined ? { account: body.account } : {}),
      ...(body.nightMode !== undefined ? { nightMode: body.nightMode } : {}),
    };
    await tx.insert(seller_notification_settings).values({ sellerId, ...changes })
      .onConflictDoUpdate({
        target: seller_notification_settings.sellerId,
        set: { ...changes, updatedAt: new Date() },
      });
    return readSellerAlertSettings(tx, sellerId);
  });
}
