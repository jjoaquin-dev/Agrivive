import type { AnalyticsUnit } from "./types";

const day = (value: string) =>
  new Date(`${value.slice(0, 10)}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export const formatRange = (from: string, to: string) => `${day(from)} – ${day(to)}`;

/** Plain unit word for numbers: kg, sacks, piles, or "units" when the seller has not picked one. */
export const unitWord = (unit?: AnalyticsUnit) => (unit === "kilo" ? "kg" : unit ? `${unit}s` : "units");
