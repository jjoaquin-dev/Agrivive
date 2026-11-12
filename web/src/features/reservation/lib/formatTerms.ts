import type { ReservationTerms } from "../api/reservation";

function clock(minute: number) {
  const h = Math.floor(minute / 60) % 24;
  return `${h % 12 || 12}:${String(minute % 60).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}

export function formatStallHours(terms: Pick<ReservationTerms, "is24Hours" | "opensMinute" | "closesMinute">) {
  return terms.is24Hours ? "This seller is available 24 hours." : `This seller is available ${clock(terms.opensMinute)} to ${clock(terms.closesMinute)}.`;
}

/** e.g. "Thu, Sep 17, 7:30 PM", always in Philippine time. */
export function formatPickupBy(iso: string) {
  return new Date(iso).toLocaleString("en-PH", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: "Asia/Manila" });
}
