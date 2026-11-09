import { apiFetch } from "../../../api/client";

export interface SellerVisibilityCriteria {
  postingAge: number;
  priceDrop: number;
  stockLevel: number;
  sellerReliability: number;
}

export interface SellerVisibilityInputs extends SellerVisibilityCriteria {
  vegetableKey: string;
}

export interface SellerVisibilityItem {
  productId: string;
  evaluatedAt: string;
  policyVersion: string;
  score: number | null;
  rank?: number | null;
  totalRanked?: number;
  reason?: string;
  criteria?: SellerVisibilityCriteria;
  normalizedCriteria?: SellerVisibilityCriteria;
  weights?: SellerVisibilityCriteria;
  inputs?: SellerVisibilityInputs;
}

export interface SellerWeightedVisibilityResponse {
  message: string;
  weightedSurplus: SellerVisibilityItem[];
}

export function fetchSellerWeightedVisibility() {
  return apiFetch<SellerWeightedVisibilityResponse>("/seller/weightedvisibility");
}
