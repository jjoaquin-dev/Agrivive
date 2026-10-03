export type BuyerNoticeKind =
  | "seller_cancellation_buyer"
  | "inquiry_24h_buyer_notice"
  | "trust_event_corrected";

export type BuyerNotice = {
  id: string;
  orderId: string;
  kind: BuyerNoticeKind | string;
  createdAt: string;
  sentAt: string | null;
  readAt: string | null;
};
