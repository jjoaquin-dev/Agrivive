"use client";

import { Check } from "lucide-react";
import type { MarketplaceFilterValues } from "./MarketplaceFilters";
import { MarketplacePriceSlider } from "./MarketplacePriceSlider";

const categories = [
  { label: "All produce", value: "" },
  { label: "Bulb vegetables", value: "Bulb Vegetables" },
  { label: "Fruit vegetables", value: "Fruit Vegetables" },
  { label: "Leafy greens", value: "Leafy Greens" },
  { label: "Pod vegetables", value: "Pod Vegetables" },
  { label: "Root vegetables", value: "Root Vegetables" },
  { label: "Tuber vegetables", value: "Tuber Vegetables" },
];

const distances = ["1km", "3km", "5km", "10km"];

interface MarketplaceFilterSidebarProps {
  values: MarketplaceFilterValues;
  onChange: (key: keyof MarketplaceFilterValues, value: string) => void;
  onClearAll: () => void;
  resultsCount: number;
  showMap: boolean;
  onToggleMap: (show: boolean) => void;
  hasLocation: boolean;
  locationStatus: "idle" | "loading" | "error";
  locationError: string;
  onUseLocation: () => void;
  onApply?: () => void;
}

export function MarketplaceFilterSidebar({
  values,
  onChange,
  onClearAll,
  showMap,
  onToggleMap,
}: MarketplaceFilterSidebarProps) {
  return (
    <aside className="overflow-hidden rounded-[24px] border border-neutral-200/60 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 bg-white px-5 py-3.5">
        <span className="font-heading text-sm font-bold tracking-tight text-[#457d00]">
          Filters
        </span>
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs font-semibold text-[#457d00] transition-colors hover:opacity-80 hover:underline cursor-pointer"
        >
          Reset
        </button>
      </div>

      <div className="space-y-5 p-5">
        {/* Vegetable Category Section */}
        <div>
          <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-[#457d00]">
            Vegetable Category
          </label>
          <div className="space-y-1.5">
            {categories.map((cat) => {
              const isSelected =
                values.productType === cat.value ||
                (!values.productType && cat.value === "");
              return (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => onChange("productType", isSelected && cat.value !== "" ? "" : cat.value)}
                  className={`group flex min-h-[40px] w-full cursor-pointer select-none items-center gap-2.5 rounded-xl px-3 py-1.5 text-xs transition-all ${
                    isSelected
                      ? "border-[0.6px] border-[#457d00]/70 bg-[#457d00]/10 font-semibold text-[#457d00] shadow-2xs"
                      : "border-[0.6px] border-neutral-200/60 bg-white font-medium text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50/70"
                  }`}
                >
                  <div
                    className={`flex size-4.5 shrink-0 items-center justify-center rounded-[5px] border transition-all ${
                      isSelected
                        ? "border-[#457d00] bg-[#457d00] text-white shadow-2xs"
                        : "border-neutral-300 bg-white group-hover:border-neutral-400"
                    }`}
                  >
                    {isSelected && <Check className="size-3 stroke-[2.5]" />}
                  </div>
                  <span className="flex-1 text-left">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Price Range Section */}
        <div>
          <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-[#457d00]">
            Price Range (PHP)
          </label>
          <MarketplacePriceSlider
            minPrice={values.minPrice}
            maxPrice={values.maxPrice}
            onChange={onChange}
            minLimit={0}
            maxLimit={1000}
          />
        </div>

        {/* Seller Distance Section */}
        <div>
          <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-[#457d00]">
            Seller Distance
          </label>
          <div className="grid grid-cols-4 gap-2">
            {distances.map((dist) => {
              const distValue = dist.replace("km", "");
              const isHighlighted =
                values.radiusKm === distValue ||
                (!values.radiusKm && distValue === "10");
              return (
                <button
                  key={dist}
                  type="button"
                  onClick={() => onChange("radiusKm", isHighlighted ? "" : distValue)}
                  className={`flex h-10 cursor-pointer select-none items-center justify-center rounded-xl text-xs transition-all ${
                    isHighlighted
                      ? "border-[0.6px] border-[#457d00]/70 bg-[#457d00]/10 font-bold text-[#457d00] shadow-2xs"
                      : "border-[0.6px] border-neutral-200/70 bg-white font-semibold text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50/70"
                  }`}
                >
                  {dist}
                </button>
              );
            })}
          </div>
        </div>

        {/* Show on Map Toggle */}
        <div className="border-t border-neutral-100 pt-3.5">
          <label className="flex cursor-pointer select-none items-center justify-between gap-3 rounded-xl border border-neutral-200/60 bg-white p-3 transition-colors hover:border-neutral-300">
            <div>
              <span className="block text-xs font-bold text-[#14231A]">Show on map</span>
              <span className="block text-[11px] text-[#5F7367]">Filter produce locations</span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={showMap}
              onClick={() => onToggleMap(!showMap)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                showMap ? "bg-[#457d00]" : "bg-neutral-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  showMap ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </label>
        </div>
      </div>
    </aside>
  );
}
