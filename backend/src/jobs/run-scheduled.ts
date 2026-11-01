import { expirePendingOrders } from "../modules/buyer/services/buyer.order.expire";
import { checkUserInactivity } from "./check-user-inactivity";
import { processInquiryDeadlines } from "../utils/trust/process-inquiries";
import { sendPendingTrustNotices } from "../utils/trust/send-notices";
import { expireTrustRestrictions } from "../utils/trust/expire-restrictions";
import { sendSellerListingNotices } from "./send-seller-listing-notices";
import { deliverPushNotifications } from "./deliver-push-notifications";
import { deliverSellerVisibilityBoosts } from "./deliver-seller-visibility-boosts";
import { deliverSellerBoostFollowUps } from "./deliver-seller-boost-follow-ups";
import { sendReservationEndingNotices } from "./send-reservation-ending-notices";

export async function runScheduledJobs() {
  const expiredOrders = await expirePendingOrders();
  const reservationEndingNotices = await sendReservationEndingNotices();
  const userInactivity = await checkUserInactivity();
  const inquiriesProcessed = await processInquiryDeadlines();
  const noticesSent = await sendPendingTrustNotices();
  const trustRestrictionsExpired = await expireTrustRestrictions();
  const sellerListingNotices = await sendSellerListingNotices();
  const sellerVisibilityBoosts = await deliverSellerVisibilityBoosts();
  const sellerBoostFollowUps = await deliverSellerBoostFollowUps();
  const pushNotifications = await deliverPushNotifications();
  return { expiredOrders, reservationEndingNotices, userInactivity, inquiriesProcessed, noticesSent, trustRestrictionsExpired, sellerListingNotices, sellerVisibilityBoosts, sellerBoostFollowUps, pushNotifications };
}
