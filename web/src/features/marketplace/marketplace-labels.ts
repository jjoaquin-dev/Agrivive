import type { MarketplaceUnit } from "./types";

export function marketplaceUnitLabel(value: string) {
  if (value === "kilo") return "Per kilo";
  if (value === "pile") return "Per pile";
  if (value === "sack") return "Per sack";
  return value;
}
