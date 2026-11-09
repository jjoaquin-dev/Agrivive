export type BuyerNoticeKind =
  | "seller_cancellation_buyer"
  | "inquiry_24h_buyer_notice"
  | "trust_event_corrected"
  | "trust_action_warning"
  | "trust_action_restriction"
  | "seller_new_listing"
  | "seller_price_drop"
  | "seller_restock"
  | "seller_inquiry_reply"
  | "seller_review_reply"
  | "seller_chat_reply";

export type BuyerNotice = {
  id: string;
  orderId: string | null;
  productId: string | null;
  sellerId: string | null;
  shopName: string | null;
  productName: string | null;
  productAvailable: boolean | null;
  kind: BuyerNoticeKind | string;
  /** What happened, from the notice key (for example "order-confirmed"). Only on order notices. */
  event?: string | null;
  price?: string | null;
  previousPrice?: string | null;
  reason?: string | null;
  createdAt: string;
  sentAt: string | null;
  readAt: string | null;
};
