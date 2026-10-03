import { expirePendingOrders } from "../modules/buyer/services/buyer.order.expire";
import { processInquiryDeadlines } from "../utils/trust/process-inquiries";
import { sendPendingTrustNotices } from "../utils/trust/send-notices";

export async function runScheduledJobs() {
  const expiredOrders = await expirePendingOrders();
  const inquiriesProcessed = await processInquiryDeadlines();
  const noticesSent = await sendPendingTrustNotices();
  return { expiredOrders, inquiriesProcessed, noticesSent };
}
