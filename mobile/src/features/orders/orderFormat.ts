import type { OrderScalingType } from "./types";

export function formatMoney(value: string): string {
  return `₱${Number(value).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatQuantity(value: string | null): string {
  const n = Number(value);
  return Number.isFinite(n) ? String(n) : "0";
}

export function formatUnit(scalingType: OrderScalingType | null, quantity: string | null): string {
  const n = Number(quantity);
  if (scalingType === "kilo") return "kg";
  if (scalingType === "sack") return n === 1 ? "sack" : "sacks";
  if (scalingType === "pile") return n === 1 ? "pile" : "piles";
  return "";
}

export function formatPlaced(value: string): string {
  const d = new Date(value);
  const date = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return `Placed ${date}, ${time}`;
}

export function formatPickupBy(value: string): string {
  const d = new Date(value);
  const now = new Date();
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  if (d.toDateString() === now.toDateString()) return `Pick up by ${time} today`;
  if (d.toDateString() === tomorrow.toDateString()) return `Pick up by ${time} tomorrow`;
  const date = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `Pick up by ${time}, ${date}`;
}

export function formatPlacedLong(value: string): string {
  const stamp = new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  return `Placed ${stamp}`;
}

export function formatClock(value: Date): string {
  return value.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export function formatNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));
}

export function formatAmount(value: number, scalingType: OrderScalingType | null): string {
  return `${formatNumber(value)} ${formatUnit(scalingType, String(value))}`.trim();
}
