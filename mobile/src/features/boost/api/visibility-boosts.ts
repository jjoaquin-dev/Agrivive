import { apiFetch } from "../../../api/client";
import type { SellerBoostPromptsResponse } from "../../notifications/types";

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
