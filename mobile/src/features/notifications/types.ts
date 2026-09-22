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
