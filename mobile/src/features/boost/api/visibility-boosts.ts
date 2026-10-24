import { apiFetch } from "../../../api/client";
import type { SellerBoostPromptsResponse } from "../../notifications/types";
import type { SellerBoostHistoryResponse, SellerProductBoostResponse } from "../types";

export function fetchSellerProductBoost(productId: string) {
  return apiFetch<SellerProductBoostResponse>(`/seller/products/${productId}/boost`);
}

export function fetchSellerBoostHistory() {
  return apiFetch<SellerBoostHistoryResponse>("/seller/boosts");
}

export function requestSellerVisibilityBoost(productId: string) {
  return apiFetch<{ boostId: string; status: string; reason: string; productId: string }>(
    `/seller/products/${productId}/boost`,
    { method: "POST" },
  );
}

export function fetchSellerBoostPrompts() {
  return apiFetch<SellerBoostPromptsResponse>("/seller/boost-prompts");
}

export function acceptSellerBoostPrompt(promptId: string) {
  return apiFetch<{ boostId: string; status: string; reason: string; productId: string }>(
    `/seller/boost-prompts/${promptId}/boost`,
    { method: "POST" },
  );
}

export function dismissSellerBoostPrompt(promptId: string) {
  return apiFetch<{ id: string; status: string }>(
    `/seller/boost-prompts/${promptId}/dismiss`,
    { method: "POST" },
  );
}

export function markSellerBoostPromptRead(promptId: string) {
  return apiFetch<{ id: string; readAt: string }>(
    `/seller/boost-prompts/${promptId}/read`,
    { method: "POST" },
  );
}

export function markAllSellerBoostPromptsRead() {
  return apiFetch<{ updatedCount: number }>("/seller/boost-prompts/read-all", {
    method: "POST",
  });
}
