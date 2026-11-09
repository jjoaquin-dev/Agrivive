import { MINUTE_MS } from "./manila";

/** The QR still works this long after the pickup slot ends. */
export const QR_GRACE_MINUTES = 15;
/** The seller has this long to confirm before the system confirms for them. */
export const AUTO_CONFIRM_HOURS = 3;
/** A buyer who cancels this close to the pickup slot gets a late-cancellation point. */
export const LATE_CANCEL_HOURS = 3;

export type QrStatus = "not_yet_valid" | "active" | "expired";

export function qrWindow(pickupStart: Date, pickupEnd: Date) {
  return { validFrom: pickupStart, validUntil: new Date(pickupEnd.getTime() + QR_GRACE_MINUTES * MINUTE_MS) };
}

/** Starts at the slot start and ends 15 minutes after the slot end (both ends included). */
export function qrStatus(pickupStart: Date | null, pickupEnd: Date | null, now = new Date()): QrStatus {
  if (!pickupStart || !pickupEnd) return "active";
  const { validFrom, validUntil } = qrWindow(pickupStart, pickupEnd);
  if (now.getTime() < validFrom.getTime()) return "not_yet_valid";
  if (now.getTime() > validUntil.getTime()) return "expired";
  return "active";
}

export function autoConfirmDeadline(createdAt: Date) {
  return new Date(createdAt.getTime() + AUTO_CONFIRM_HOURS * 3_600_000);
}

export function isLateCancellation(pickupStart: Date | null, now = new Date()) {
  if (!pickupStart) return false;
  return pickupStart.getTime() - now.getTime() <= LATE_CANCEL_HOURS * 3_600_000;
}
