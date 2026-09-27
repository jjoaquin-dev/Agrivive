import type { MarketplaceSellerType, MarketplaceUnit } from "./types";

const sellerLabels: Record<MarketplaceSellerType, string> = {
  supplier: "Supplier",
  supplier_vendor: "Supplier vendor",
  retail_vendor: "Retail vendor",
};

export function sellerTypeLabel(value: string) {
  return sellerLabels[value as MarketplaceSellerType] ?? value;
}

export function marketplaceUnitLabel(value: string) {
  if (value === "kilo") return "Per kilo";
  if (value === "pile") return "Per pile";
  if (value === "sack") return "Per sack";
  return value;
}
