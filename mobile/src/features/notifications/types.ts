export interface SellerNotification {
  id: string;
  source: "alert" | "trust";
  kind: string;
  category: Exclude<NotificationCategory, "all">;
  title: string;
  body: string;
  orderId: string | null;
  productId: string | null;
  createdAt: string;
  readAt: string | null;
}

export interface SellerNotificationSettings {
  stockPrice: boolean;
  boost: boolean;
  account: boolean;
  nightMode: boolean;
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

export interface SellerBoostPrompt {
  id: string;
  productId: string;
  productName: string;
  reason: "initial" | "price_reduction";
  reductionPeriod: number;
  priceBefore: string | null;
  priceAfter: string | null;
  createdAt: string;
  readAt: string | null;
}

export interface SellerBoostPromptsResponse {
  items: SellerBoostPrompt[];
  unreadCount: number;
  nextCursor?: string | null;
}

export type NotificationCategory = "all" | "reservations" | "messages" | "listings" | "trust";

export interface UnifiedNotificationItem {
  id: string;
  category: NotificationCategory;
  kind: string;
  title: string;
  subtitle: string;
  timestamp: string;
  rawDate: Date;
  read: boolean;
  urgent: boolean;
  iconType: "package" | "clock" | "message" | "thermometer" | "check" | "cross" | "celebration" | "megaphone" | "shield";
  primaryAction?: {
    label: string;
    onPress: () => void;
    variant?: "primary" | "warning";
  };
  secondaryAction?: {
    label: string;
    onPress: () => void;
  };
}
