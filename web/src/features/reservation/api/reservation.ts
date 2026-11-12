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

export type ReservationTerms = {
  shopName: string;
  is24Hours: boolean;
  opensMinute: number;
  closesMinute: number;
  closingBufferMinutes: number;
  /** ISO time the reservation must be picked up by. */
  pickupBy: string;
  /** ISO time the QR stops working: closing time, or the deadline for a 24-hour stall. */
  qrUntil: string;
};

export function getReservationStatus(signal?: AbortSignal) {
  return apiRequest<ReservationStatus>("/buyer/reservation-status", { signal });
}

export function getReservationTerms(sellerId: string, signal?: AbortSignal) {
  return apiRequest<ReservationTerms>(`/buyer/sellers/${encodeURIComponent(sellerId)}/reservation-terms`, { signal });
}
