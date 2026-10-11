import { expirePendingOrders } from "../modules/buyer/services/buyer.order.expire";
import { processInquiryDeadlines } from "../utils/trust/process-inquiries";
import { sendPendingTrustNotices } from "../utils/trust/send-notices";
import { expireTrustRestrictions } from "../utils/trust/expire-restrictions";
import { sendSellerListingNotices } from "./send-seller-listing-notices";
import { checkSellerPromotionEligibility } from "./check-seller-promotion-eligibility";
import { deliverSellerPromotionWebhooks } from "./deliver-seller-promotion-webhooks";
import { deliverPushNotifications } from "./deliver-push-notifications";

export async function runScheduledJobs() {
  const expiredOrders = await expirePendingOrders();
  const inquiriesProcessed = await processInquiryDeadlines();
  const noticesSent = await sendPendingTrustNotices();
  const trustRestrictionsExpired = await expireTrustRestrictions();
  const sellerListingNotices = await sendSellerListingNotices();
  const sellerPromotionChecks = await checkSellerPromotionEligibility();
  const sellerPromotionWebhooks = await deliverSellerPromotionWebhooks();
  const pushNotifications = await deliverPushNotifications();
  return { expiredOrders, inquiriesProcessed, noticesSent, trustRestrictionsExpired, sellerListingNotices, sellerPromotionChecks, sellerPromotionWebhooks, pushNotifications };
}
