export type SellerOrderStatus = "pending" | "completed" | "cancelled" | "expired" | "declined";

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
  pickupStart: string | null;
  pickupEnd: string | null;
  confirmedAt: string | null;
  confirmationMode: "manual" | "auto" | null;
  packedAt: string | null;
  readyAt: string | null;
  noShowAt: string | null;
  progress: { current: "placed" | "confirmed" | "preparing" | "ready" | "completed"; terminal: "expired" | "cancelled" | "declined" | null };
  qr: { status: "not_yet_valid" | "active" | "expired"; validFrom: string | null; validUntil: string | null };
  buyerName?: string | null;
  decline?: { status: string; reason: string; reasonValid: boolean; details: string | null; sellerDueAt: string} | null;
  excuse?: { status: string; reason: string; details: string | null } | null;
  noShow?: { sequence: number; weight: number; excused: boolean } | null;
  reschedules?: { id: string; status: string; reason: string; newStart: string; newEnd: string }[];
}

export interface SellerOrdersResponse {
  orders: SellerOrder[];
  nextCursor: string | null;
}
