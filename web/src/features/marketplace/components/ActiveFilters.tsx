import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MarketplaceFilterValues } from "./MarketplaceFilters";
import { marketplaceUnitLabel } from "../marketplace-labels";

interface ActiveFiltersProps {
  filters: MarketplaceFilterValues;
  search: string;
  hasLocation: boolean;
  onRemoveFilter: (key: keyof MarketplaceFilterValues) => void;
  onRemoveSearch: () => void;
  onRemoveLocation: () => void;
  onClearAll: () => void;
}

export function ActiveFilters({
  filters,
  search,
  hasLocation,
  onRemoveFilter,
  onRemoveSearch,
  onRemoveLocation,
  onClearAll,
}: ActiveFiltersProps) {
  const chips: { id: string; label: string; onRemove: () => void }[] = [];

  if (search) chips.push({ id: "search", label: `"${search}"`, onRemove: onRemoveSearch });
  if (hasLocation) chips.push({ id: "location", label: `Within ${filters.radiusKm || "10"} km`, onRemove: onRemoveLocation });
  if (filters.productType) {
    chips.push({
      id: "productType",
      label: filters.productType,
      onRemove: () => onRemoveFilter("productType"),
    });
  }
  if (filters.unit) {
    chips.push({
      id: "unit",
      label: marketplaceUnitLabel(filters.unit),
      onRemove: () => onRemoveFilter("unit"),
    });
  }
  if (filters.minPrice || filters.maxPrice) {
    const priceText = filters.minPrice && filters.maxPrice
      ? `₱${filters.minPrice} - ₱${filters.maxPrice}`
      : filters.minPrice ? `From ₱${filters.minPrice}` : `Up to ₱${filters.maxPrice}`;
    chips.push({
      id: "price",
      label: priceText,
      onRemove: () => {
        onRemoveFilter("minPrice");
        onRemoveFilter("maxPrice");
      },
    });
  }
  if (filters.minQuantity || filters.maxQuantity) {
    const qtyText = filters.minQuantity && filters.maxQuantity
      ? `${filters.minQuantity} - ${filters.maxQuantity} qty`
      : filters.minQuantity ? `Min ${filters.minQuantity} qty` : `Max ${filters.maxQuantity} qty`;
    chips.push({
      id: "qty",
      label: qtyText,
      onRemove: () => {
        onRemoveFilter("minQuantity");
        onRemoveFilter("maxQuantity");
      },
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Active filters">
      <span className="mr-1 text-xs font-bold text-[#457D00]">Active filters:</span>
      {chips.map((chip) => (
        <button
          key={chip.id}
          type="button"
          onClick={chip.onRemove}
          aria-label={`Remove filter ${chip.label}`}
          className="inline-flex h-8 items-center gap-1.5 rounded-full border border-neutral-200/80 bg-white px-2.5 text-xs font-semibold text-neutral-800 shadow-2xs transition hover:bg-neutral-50 hover:border-neutral-300 active:scale-95"
        >
          <span>{chip.label}</span>
          <X aria-hidden="true" className="size-3 text-neutral-400 hover:text-neutral-700" />
        </button>
      ))}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="h-8 px-2 text-xs font-semibold text-[#457D00] hover:bg-[#457D00]/10 hover:text-[#457D00]"
      >
        Clear all
      </Button>
    </div>
  );
}
