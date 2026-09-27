import { apiRequest } from "@/src/lib/api";

export interface BuyerProductInquiry {
  id: string;
  productId: string;
  question: string;
  reply: string | null;
  repliedAt: string | null;
  createdAt: string;
}

export function getBuyerProductInquiries(productId: string, signal?: AbortSignal) {
  return apiRequest<BuyerProductInquiry[]>(`/buyer/products/${encodeURIComponent(productId)}/inquiries`, {
    signal,
  });
}

export function sendBuyerProductInquiry(productId: string, question: string) {
  return apiRequest<BuyerProductInquiry>(`/buyer/products/${encodeURIComponent(productId)}/inquiries`, {
    method: "POST",
    body: JSON.stringify({ question }),
  });
}
