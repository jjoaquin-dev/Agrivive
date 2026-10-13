export type SellerBoostReason = "initial" | "price_reduction";
export type SellerVisibilityBoostStatus = "prompt" | "queued" | "sent" | "failed" | "dismissed";

export interface SellerVisibilityBoost {
  id: string;
  productId: string;
  productName: string;
  imageUrl: string | null;
  reason: SellerBoostReason;
  reductionPeriod: number;
  status: SellerVisibilityBoostStatus;
  priceBefore: string | null;
  priceAfter: string | null;
  createdAt: string;
  sentAt: string | null;
  errorMessage: string | null;
}

export interface SellerProductBoostResponse {
  product: {
    id: string;
    productName: string;
    imageUrl: string | null;
  };
  boost: SellerVisibilityBoost | null;
}

export interface SellerBoostHistoryResponse {
  items: SellerVisibilityBoost[];
  total: number;
}

export function boostStatusLabel(status: SellerVisibilityBoostStatus) {
  switch (status) {
    case "prompt": return "Needs your choice";
    case "queued": return "Waiting to boost";
    case "sent": return "Sent to social workflow";
    case "failed": return "Boost failed";
    case "dismissed": return "Not now";
  }
}

export function boostReasonLabel(reason: SellerBoostReason) {
  return reason === "price_reduction" ? "After price change" : "Initial boost";
}
