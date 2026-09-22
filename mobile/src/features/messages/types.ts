export type SellerMessageFilter = "open" | "all";

export interface SellerMessage {
  id: string;
  orderId: string;
  buyerId: string;
  question: string;
  reply: string | null;
  repliedAt: string | null;
  createdAt: string;
  orderStatus: "pending" | "completed" | "cancelled" | "expired";
  totalAmount: string;
}

export interface SellerMessagesResponse {
  items: SellerMessage[];
  nextCursor: string | null;
  openCount: number;
}
