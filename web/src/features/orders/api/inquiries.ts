import { apiRequest } from "@/src/lib/api";

export type BuyerOrderInquiry = {
  id: string;
  orderId: string;
  buyerId: string;
  sellerId: string;
  question: string;
  reply: string | null;
  repliedAt: string | null;
  deadlineStage: number;
  createdAt: string;
};

export function listBuyerOrderInquiries(orderId: string, signal?: AbortSignal) {
  return apiRequest<BuyerOrderInquiry[]>(`/buyer/orders/${encodeURIComponent(orderId)}/inquiries`, { signal });
}

export function createBuyerOrderInquiry(orderId: string, question: string) {
  return apiRequest<BuyerOrderInquiry>(`/buyer/orders/${encodeURIComponent(orderId)}/inquiries`, {
    method: "POST",
    body: JSON.stringify({ question }),
  });
}
