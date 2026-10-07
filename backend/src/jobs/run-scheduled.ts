import { expirePendingOrders } from "../modules/buyer/services/buyer.order.expire";
import { processInquiryDeadlines } from "../utils/trust/process-inquiries";
import { sendPendingTrustNotices } from "../utils/trust/send-notices";
import { sendSellerListingNotices } from "./send-seller-listing-notices";
import { checkSellerPromotionEligibility } from "./check-seller-promotion-eligibility";
import { deliverSellerPromotionWebhooks } from "./deliver-seller-promotion-webhooks";

export async function runScheduledJobs() {
  const expiredOrders = await expirePendingOrders();
  const inquiriesProcessed = await processInquiryDeadlines();
  const noticesSent = await sendPendingTrustNotices();
  const sellerListingNotices = await sendSellerListingNotices();
  const sellerPromotionChecks = await checkSellerPromotionEligibility();
  const sellerPromotionWebhooks = await deliverSellerPromotionWebhooks();
  return { expiredOrders, inquiriesProcessed, noticesSent, sellerListingNotices, sellerPromotionChecks, sellerPromotionWebhooks };
}
