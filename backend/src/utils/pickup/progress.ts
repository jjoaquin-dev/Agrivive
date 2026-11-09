import { qrStatus, qrWindow, type QrStatus } from "./qr-window";

export const PICKUP_DISCLAIMER = "Agrivive does not check produce quality. Please look over your items when you pick up.";
export const CANCEL_BLOCKED_MESSAGE = "This order has already been confirmed by the seller. Buyer cancellation is no longer available.";

export const progressSteps = ["placed", "confirmed", "preparing", "ready", "completed"] as const;
export type ProgressStep = (typeof progressSteps)[number];

type OrderTimes = {
  status: string; confirmedAt: Date | null; packedAt: Date | null; readyAt: Date | null;
  pickupStart: Date | null; pickupEnd: Date | null; expiresAt: Date | null;
};

/** The progress bar comes only from what the backend recorded. "Ready" is never shown as "Completed". */
export function orderProgress(order: OrderTimes) {
  const terminal = order.status === "expired" ? "expired" : order.status === "cancelled" ? "cancelled"
    : order.status === "declined" ? "declined" : null;
  const current: ProgressStep = order.status === "completed" ? "completed"
    : order.readyAt ? "ready" : order.packedAt ? "preparing" : order.confirmedAt ? "confirmed" : "placed";
  return { steps: progressSteps, current, terminal };
}

export function pickupFields(order: OrderTimes, now = new Date()) {
  const open = order.status === "pending";
  const status: QrStatus | null = open ? qrStatus(order.pickupStart, order.pickupEnd, now) : null;
  const window = order.pickupStart && order.pickupEnd ? qrWindow(order.pickupStart, order.pickupEnd) : null;
  const canCancel = open && !order.confirmedAt && !!order.expiresAt && order.expiresAt > now;
  return {
    pickupStart: order.pickupStart,
    pickupEnd: order.pickupEnd,
    progress: orderProgress(order),
    qr: { status: open ? status : "expired" as QrStatus, validFrom: null, validUntil: window?.validUntil ?? null },
    canCancel,
    cancelBlockedReason: open && order.confirmedAt ? CANCEL_BLOCKED_MESSAGE : null,
    disclaimer: PICKUP_DISCLAIMER,
  };
}
