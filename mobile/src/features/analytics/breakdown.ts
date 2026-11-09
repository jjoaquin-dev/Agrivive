import type { BreakdownRow } from "./components/AnalyticsDetailSheet";
import type { SellerAnalyticsInsights, SellerAnalyticsMetrics } from "./types";

export const pesoText = (value: number | string) =>
  `₱${Number(value || 0).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const percentText = (part: number, whole: number) => (whole > 0 ? `${Math.round((part / whole) * 100)}%` : "–");

/** Where the posted produce went, in the seller's unit word. */
export function movementRows(m: SellerAnalyticsMetrics, word: string): BreakdownRow[] {
  return [
    { label: "Posted", value: `${m.postedQuantity} ${word}`, strong: true },
    { label: "Reserved by buyers", value: `${m.reservedQuantity} ${word}` },
    { label: "Picked up", value: `${m.completedQuantity} ${word}` },
    { label: "Cancelled", value: `${m.cancelledQuantity} ${word}` },
    { label: "Expired", value: `${m.expiredQuantity} ${word}` },
    { label: "Still for sale", value: `${m.availableQuantity} ${word}` },
    { label: "Waiting for pickup", value: `${Math.max(0, Number(m.remainingQuantity) - Number(m.availableQuantity)).toFixed(2)} ${word}` },
  ];
}

export function orderRows(o: SellerAnalyticsInsights["orders"]): BreakdownRow[] {
  const waiting = Math.max(0, o.placed - o.pickedUp - o.cancelled - o.expired - o.declined);
  return [
    { label: "Orders placed", value: String(o.placed), strong: true },
    { label: "Picked up", value: `${o.pickedUp} (${percentText(o.pickedUp, o.placed)})` },
    { label: "Cancelled", value: String(o.cancelled) },
    { label: "Expired", value: String(o.expired) },
    { label: "Declined", value: String(o.declined) },
    { label: "Not finished yet", value: String(waiting) },
  ];
}

export function moneyRows(i: SellerAnalyticsInsights): BreakdownRow[] {
  return [
    { label: "Total earned", value: pesoText(i.totalSales), strong: true },
    { label: "Orders picked up", value: String(i.orders.pickedUp) },
    { label: "Average order", value: i.averageOrder === null ? "–" : pesoText(i.averageOrder) },
    { label: "Smallest order", value: i.smallestOrder === null ? "–" : pesoText(i.smallestOrder) },
    { label: "Biggest order", value: i.largestOrder === null ? "–" : pesoText(i.largestOrder) },
  ];
}

export function buyerRows(b: SellerAnalyticsInsights["buyers"]): BreakdownRow[] {
  return [
    { label: "Buyers who picked up", value: String(b.total), strong: true },
    { label: "Came back (2 or more pickups)", value: `${b.returning} (${percentText(b.returning, b.total)})` },
    { label: "Picked up only once", value: String(b.total - b.returning) },
  ];
}
