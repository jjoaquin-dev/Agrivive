export interface ReviewItem {
  id: string;
  orderId: string;
  rating: number;
  review: string | null;
  sellerResponse: string | null;
  createdAt: string;
  buyerName: string;
  items: string[];
}

export interface ReviewBreakdown {
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
}

export interface ReviewsSummary {
  count: number;
  average: string | null;
  breakdown: ReviewBreakdown;
  unansweredCount: number;
}

export interface SellerReviewsResponse {
  summary: ReviewsSummary;
  reviews: ReviewItem[];
}

export type ReviewFilter = "all" | "unanswered" | "replied";
