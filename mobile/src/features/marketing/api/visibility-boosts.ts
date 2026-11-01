import { apiFetch } from "../../../api/client";
import type { SellerBoostPromptsResponse } from "../../notifications/types";
import type { PriceDropHistoryResponse, RunningPriceDrop, SellerBoostHistoryResponse, SellerProductBoostResponse } from "../types";

export function fetchSellerProductBoost(productId: string) {
  return apiFetch<SellerProductBoostResponse>(`/seller/products/${productId}/boost`);
}

export function fetchSellerBoostHistory(params: { limit?: number; cursor?: string } = {}) {
  const qs = new URLSearchParams();
  if (params.limit) qs.append("limit", params.limit.toString());
  if (params.cursor) qs.append("cursor", params.cursor);
  const query = qs.toString();
  return apiFetch<SellerBoostHistoryResponse>(`/seller/boosts${query ? `?${query}` : ""}`);
}

export function requestSellerVisibilityBoost(productId: string) {
  return apiFetch<{ boostId: string; status: string; reason: string; productId: string }>(
    `/seller/products/${productId}/boost`,
    { method: "POST" },
  );
}

export function fetchSellerBoostPrompts(params: { limit?: number; cursor?: string } = {}) {
  const qs = new URLSearchParams();
  if (params.limit) qs.append("limit", params.limit.toString());
  if (params.cursor) qs.append("cursor", params.cursor);
  const query = qs.toString();
  return apiFetch<SellerBoostPromptsResponse>(`/seller/boost-prompts${query ? `?${query}` : ""}`);
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

export async function markAllSellerBoostPromptsRead() {
  try {
    return await apiFetch<{ updatedCount: number }>("/seller/boost-prompts/read-all", {
      method: "POST",
    });
  } catch {
    try {
      const res = await fetchSellerBoostPrompts();
      const unread = (res.items || []).filter((p) => !p.readAt);
      await Promise.allSettled(unread.map((p) => markSellerBoostPromptRead(p.id)));
      return { updatedCount: unread.length };
    } catch {
      return { updatedCount: 0 };
    }
  }
}

export function fetchPriceDropHistory(cursor?: string) {
  return apiFetch<PriceDropHistoryResponse>(`/seller/price-drops${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ""}`);
}

/** Turns the 6-hour price drops on or off. A drop amount and final price can be saved in the same call. */
export function setAutoPriceDropEnabled(productId: string, enabled: boolean, setup?: { amount: number; minimumPrice: number }) {
  return apiFetch<{ productId: string; enabled: boolean; dropNow: boolean }>(`/seller/products/${productId}/price-reduction`, {
    method: "PATCH",
    body: JSON.stringify({ enabled, ...(setup ?? {}) }),
  });
}

/** Brings the next automatic price drop forward to now. n8n lowers the price and posts it within a minute. */
export function requestPriceDropNow(productId: string) {
  return apiFetch<{ boostId: string; productId: string }>(`/seller/products/${productId}/price-drop`, { method: "POST" });
}

export function fetchRunningPriceDrops() {
  return apiFetch<{ items: RunningPriceDrop[] }>("/seller/price-drops/running");
}
