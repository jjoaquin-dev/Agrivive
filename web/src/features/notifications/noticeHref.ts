import type { BuyerNotice } from "./types";

/** Where tapping a notice goes. */
export function noticeHref(notice: BuyerNotice, isTrustNotice: boolean): string {
  const isChatReply = notice.kind === "seller_chat_reply";
  const isInquiryReply = notice.kind === "seller_inquiry_reply";
  const isProduce = ["seller_new_listing", "seller_price_drop", "seller_restock"].includes(notice.kind);
  if (isChatReply || (isInquiryReply && !notice.orderId)) return "/messages";
  if (isProduce) {
    if (notice.productAvailable && notice.productId) return `/marketplace/${notice.productId}`;
    return notice.sellerId ? `/sellers/${notice.sellerId}` : "/marketplace";
  }
  if (isTrustNotice) return "/orders";
  return notice.orderId ? `/orders/${notice.orderId}` : "/profile";
}
