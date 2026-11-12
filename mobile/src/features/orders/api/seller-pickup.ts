import { apiFetch } from "../../../api/client";
import type { SellerOrder } from "../types";

const post = (orderId: string, step: string, body?: unknown) =>
  apiFetch<SellerOrder>(`/seller/orders/${orderId}/${step}`, { method: "POST", body: body === undefined ? undefined : JSON.stringify(body) });

export const confirmSellerOrder = (orderId: string) => post(orderId, "confirm");
export const packSellerOrder = (orderId: string) => post(orderId, "pack");
export const readySellerOrder = (orderId: string) => post(orderId, "ready");
export const markOrderNoShow = (orderId: string) => post(orderId, "no-show");
export const offerNewPickupTime = (orderId: string, input: { pickupStart: string; pickupEnd: string; reason: string }) => post(orderId, "reschedule", input);

export async function decideBuyerExcuse(orderId: string, accept: boolean) {
  return apiFetch<{ status: string; order: SellerOrder }>(`/seller/orders/${orderId}/excuse/decide`, { method: "POST", body: JSON.stringify({ accept }) });
}

/** Accept a pickup decline, or dispute it with a note and an optional photo taken right now. */
export async function answerPickupDecline(orderId: string, input: { action: "accept" | "dispute"; note?: string; photoUri?: string }) {
  const body = new FormData();
  body.append("action", input.action);
  if (input.note) body.append("note", input.note);
  if (input.photoUri) {
    body.append("capturedAt", new Date().toISOString());
    body.append("photo", { uri: input.photoUri, name: "decline.jpg", type: "image/jpeg" } as unknown as Blob);
  }
  return apiFetch<SellerOrder>(`/seller/orders/${orderId}/decline/respond`, { method: "POST", body });
}

export interface StallDay { weekday: number; isClosed: boolean; opensMinute: number; closesMinute: number; configured: boolean }
export interface Stall {
  shopName: string; hours: StallDay[]; hoursConfigured: boolean; closedToday: boolean;
}

export const fetchStall = () => apiFetch<Stall>("/seller/stall");
export const saveStallHours = (days: Omit<StallDay, "configured">[]) => apiFetch<Stall>("/seller/stall/hours", { method: "PUT", body: JSON.stringify({ days }) });
export const setClosedToday = (closed: boolean) => apiFetch<Stall>("/seller/stall/closed-today", { method: "PUT", body: JSON.stringify({ closed }) });
