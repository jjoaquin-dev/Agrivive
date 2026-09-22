import { apiFetch } from "../../../api/client";

export interface SellerInquiry {
  id: string;
  orderId: string;
  buyerId: string;
  sellerId: string;
  question: string;
  reply: string | null;
  repliedAt: string | null;
  createdAt: string;
}

export interface SellerReview {
  id: string;
  orderId: string;
  buyerId: string;
  sellerId: string;
  rating: number;
  review: string | null;
  sellerResponse: string | null;
  createdAt: string;
}

export function fetchSellerInquiries(orderId: string) {
  return apiFetch<SellerInquiry[]>(`/seller/orders/${orderId}/inquiries`);
}

export function replyToSellerInquiry(inquiryId: string, reply: string) {
  return apiFetch<SellerInquiry>(`/seller/inquiries/${inquiryId}/reply`, {
    method: "POST",
    body: JSON.stringify({ reply }),
  });
}

export function fetchSellerReview(orderId: string) {
  return apiFetch<SellerReview>(`/seller/orders/${orderId}/review`);
}

export function respondToSellerReview(orderId: string, response: string) {
  return apiFetch<SellerReview>(`/seller/orders/${orderId}/review-response`, {
    method: "POST",
    body: JSON.stringify({ response }),
  });
}
