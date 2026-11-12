import { apiRequest } from "@/src/lib/api";

export const PICKUP_DISCLAIMER = "Agrivive does not check produce quality. Please look over your items when you pick up.";

export type ReservationStatus = {
  canReserve: boolean;
  reason: string | null;
  level: string;
  levelLabel: string;
  score: number;
  warning: string | null;
};

export type PickupCell = { start: string; end: string; available: boolean; full: boolean; busy: boolean };
export type PickupDay = { date: string; open: boolean; reason: string; cells: PickupCell[] };
export type PickupSlots = { shopName: string; stepMinutes: number; maxRangeMinutes: number; days: PickupDay[] };
export type PickupChoice = { sellerId: string; pickupStart: string; pickupEnd: string };

export function getReservationStatus(signal?: AbortSignal) {
  return apiRequest<ReservationStatus>("/buyer/reservation-status", { signal });
}

export function getPickupSlots(sellerId: string, signal?: AbortSignal) {
  return apiRequest<PickupSlots>(`/buyer/sellers/${encodeURIComponent(sellerId)}/pickup-slots`, { signal });
}
