export type BuyerNoticeKind =
  | "seller_cancellation_buyer"
  | "inquiry_24h_buyer_notice"
  | "trust_event_corrected"
  | "seller_new_listing"
  | "seller_price_drop"
  | "seller_restock";

export type BuyerNotice = {
  id: string;
  orderId: string | null;
  productId: string | null;
  sellerId: string | null;
  shopName: string | null;
  productName: string | null;
  productAvailable: boolean | null;
  kind: BuyerNoticeKind | string;
  price?: string | null;
  previousPrice?: string | null;
  createdAt: string;
  sentAt: string | null;
  readAt: string | null;
};
