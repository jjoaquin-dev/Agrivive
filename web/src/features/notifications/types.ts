export type BuyerNoticeKind =
  | "seller_cancellation_buyer"
  | "inquiry_24h_buyer_notice"
  | "trust_event_corrected"
  | "seller_new_listing";

export type BuyerNotice = {
  id: string;
  orderId: string | null;
  productId: string | null;
  sellerId: string | null;
  shopName: string | null;
  productName: string | null;
  productAvailable: boolean | null;
  kind: BuyerNoticeKind | string;
  createdAt: string;
  sentAt: string | null;
  readAt: string | null;
};
