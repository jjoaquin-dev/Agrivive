import { expirePendingOrders } from "../modules/buyer/services/buyer.order.expire";
import { checkUserInactivity } from "./check-user-inactivity";
import { processInquiryDeadlines } from "../utils/trust/process-inquiries";
import { sendPendingTrustNotices } from "../utils/trust/send-notices";
import { expireTrustRestrictions } from "../utils/trust/expire-restrictions";
import { sendSellerListingNotices } from "./send-seller-listing-notices";
import { checkSellerPromotionEligibility } from "./check-seller-promotion-eligibility";
import { deliverSellerPromotionWebhooks } from "./deliver-seller-promotion-webhooks";
import { deliverPushNotifications } from "./deliver-push-notifications";
import { applySellerPriceReductions } from "./apply-seller-price-reductions";
import { deliverSellerVisibilityBoosts } from "./deliver-seller-visibility-boosts";

export async function runScheduledJobs() {
  const expiredOrders = await expirePendingOrders();
  const userInactivity = await checkUserInactivity();
  const inquiriesProcessed = await processInquiryDeadlines();
  const noticesSent = await sendPendingTrustNotices();
  const trustRestrictionsExpired = await expireTrustRestrictions();
  const sellerListingNotices = await sendSellerListingNotices();
  const sellerPriceReductions = await applySellerPriceReductions();
  const sellerPromotionChecks = await checkSellerPromotionEligibility();
  const sellerPromotionWebhooks = await deliverSellerPromotionWebhooks();
  const sellerVisibilityBoosts = await deliverSellerVisibilityBoosts();
  const pushNotifications = await deliverPushNotifications();
  return { expiredOrders, userInactivity, inquiriesProcessed, noticesSent, trustRestrictionsExpired, sellerListingNotices, sellerPriceReductions, sellerPromotionChecks, sellerPromotionWebhooks, sellerVisibilityBoosts, pushNotifications };
}
