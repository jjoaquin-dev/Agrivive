import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MarketplaceFilterValues } from "./MarketplaceFilters";
import { marketplaceUnitLabel, sellerTypeLabel } from "../marketplace-labels";

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
  if (hasLocation) chips.push({ id: "location", label: "Within 10 km", onRemove: onRemoveLocation });
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
  if (filters.sellerType) {
    chips.push({
      id: "sellerType",
      label: sellerTypeLabel(filters.sellerType),
      onRemove: () => onRemoveFilter("sellerType"),
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
    <div className="mb-4 flex flex-wrap items-center gap-2" aria-label="Active filters">
      <span className="text-xs font-medium text-muted-foreground">Active filters:</span>
      {chips.map((chip) => (
        <button
          key={chip.id}
          type="button"
          onClick={chip.onRemove}
          aria-label={`Remove filter ${chip.label}`}
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-secondary px-3 text-xs font-medium text-secondary-foreground hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span>{chip.label}</span>
          <X aria-hidden="true" className="size-4" />
        </button>
      ))}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="min-h-11 px-3 text-xs text-muted-foreground hover:text-foreground"
      >
        Clear all
      </Button>
    </div>
  );
}
