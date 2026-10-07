export interface SellerNotification {
  id: string;
  kind: string;
  orderId: string;
  createdAt: string;
  readAt: string | null;
}

export interface SellerNotificationsResponse {
  items: SellerNotification[];
  nextCursor: string | null;
  unreadCount: number;
}

export interface SellerPromotion {
  id: string;
  stage: "initial" | "followup";
  productId: string;
  productName: string;
  headline: string | null;
  caption: string | null;
  createdAt: string;
  readyAt: string | null;
  readAt: string | null;
}

export interface SellerPromotionsResponse {
  items: SellerPromotion[];
  nextCursor: string | null;
  unreadCount: number;
}

export interface SellerPromotionSharePayload {
  promotionId: string;
  stage: "initial" | "followup";
  title: string;
  message: string;
  shareUrl: string;
  facts: {
    productName: string;
    shopName: string;
    price: number;
    quantity: number;
    unit: string;
  };
}
