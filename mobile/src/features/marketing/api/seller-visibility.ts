import { apiFetch } from "../../../api/client";

export interface SellerVisibilityCriteria {
  freshness: number;
  stockAvailability: number;
  sellerReliability: number;
  recurrence: number;
}

export interface SellerVisibilityInputs {
  postingAge: number;
  remainingQuantity: number;
  sellerReliability?: number;
  recurrence: number;
  priorCycles: number;
  vegetableKey: string;
}

export interface SellerVisibilityItem {
  productId: string;
  evaluatedAt: string;
  policyVersion: string;
  score: number | null;
  tier: "priority" | "standard" | "basic" | null;
  rank?: number | null;
  reason?: string;
  criteria?: SellerVisibilityCriteria;
  inputs?: SellerVisibilityInputs;
}

export interface SellerWeightedVisibilityResponse {
  message: string;
  weightedSurplus: SellerVisibilityItem[];
}

export function fetchSellerWeightedVisibility() {
  return apiFetch<SellerWeightedVisibilityResponse>("/seller/weightedvisibility");
}
