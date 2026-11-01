import { colors } from "../../../theme";
import type { SellerOrderStatus } from "../../orders/types";

/** The short code shown for a reservation everywhere else in the app. */
export const orderRef = (orderId: string) => orderId.slice(0, 8).toUpperCase();

export function unitShort(scalingType: string | null | undefined, qty = 2): string {
  if (scalingType === "kilo") return "kg";
  if (scalingType === "sack") return qty === 1 ? "sack" : "sacks";
  if (scalingType === "pile") return qty === 1 ? "pile" : "piles";
  return scalingType ?? "";
}

export const peso = (value: string | number | null | undefined) => `₱${Number(value ?? 0).toFixed(2)}`;

export function formatClock(value: string) {
  return new Date(value).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function formatDay(value: string): string {
  const d = new Date(value);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return "Today";
  const y = new Date(now);
  y.setDate(now.getDate() - 1);
  if (d.toDateString() === y.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatDayAndClock(value: string) {
  return `${formatDay(value)}, ${formatClock(value)}`;
}

/** The reservation status words and colors used by the chat banner and the reservation card. */
export function orderPill(status?: SellerOrderStatus) {
  switch (status) {
    case "completed": return { text: "Picked Up", bg: "#DCFCE7", color: colors.success };
    case "cancelled": return { text: "Cancelled", bg: "#FEE2E2", color: colors.error };
    case "expired": return { text: "Expired", bg: colors.border, color: colors.textMuted };
    default: return { text: "Waiting for Pickup", bg: "#FEF3C7", color: colors.warning };
  }
}
