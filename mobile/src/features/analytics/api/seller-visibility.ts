import { apiFetch } from "../../../api/client";

export interface SellerVisibilityInputs {
  postingAge: number;
  remainingQuantity: number;
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
  reason?: string;
  inputs?: SellerVisibilityInputs;
}

export interface SellerWeightedVisibilityResponse {
  message: string;
  weightedSurplus: SellerVisibilityItem[];
}

export function fetchSellerWeightedVisibility() {
  return apiFetch<SellerWeightedVisibilityResponse>("/seller/weightedvisibility");
}
