export type SellerOrderStatus = "pending" | "completed" | "cancelled" | "expired";

export type SellerOrderFilter = "all" | SellerOrderStatus;

export type OrderScalingType = "sack" | "kilo" | "pile";

export interface SellerOrderItem {
  id: string;
  productId: string;
  productName: string | null;
  scalingType: OrderScalingType | null;
  quantity: string | null;
  unitPrice: string;
  subtotal: string;
}

export interface SellerOrder {
  id: string;
  checkoutId: string | null;
  buyerId: string;
  sellerId: string;
  status: SellerOrderStatus;
  cancelledBy: string | null;
  cancellationReason: string | null;
  totalAmount: string;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  items: SellerOrderItem[];
  qrPayload: null;
}

export interface SellerOrdersResponse {
  orders: SellerOrder[];
  nextCursor: string | null;
}
