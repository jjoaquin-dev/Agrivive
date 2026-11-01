"use client";

import type { MarketplaceFilterValues } from "./MarketplaceFilters";
import { MarketplacePriceSlider } from "./MarketplacePriceSlider";

const distances = ["1km", "3km", "5km", "10km"];

const choiceBase = "flex cursor-pointer select-none items-center justify-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#457d00]/30";
const choiceSelected = "border-[#457d00]/50 bg-[#457d00]/8 font-bold text-[#14231A]";
const choiceIdle = "border-neutral-200/80 bg-white font-semibold text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50";

type FilterChange = (key: keyof MarketplaceFilterValues, value: string) => void;

export function PriceFilterPanel({ values, onChange }: { values: MarketplaceFilterValues; onChange: FilterChange }) {
  return (
    <div>
      <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#5F7367]">Price range (PHP)</span>
      <MarketplacePriceSlider
        minPrice={values.minPrice}
        maxPrice={values.maxPrice}
        onChange={onChange}
        minLimit={0}
        maxLimit={1000}
      />
    </div>
  );
}

export function DistanceFilterPanel({
  values,
  onChange,
  hasLocation,
  locationStatus,
  locationError,
  onUseCoordinates,
}: {
  values: MarketplaceFilterValues;
  onChange: FilterChange;
  hasLocation: boolean;
  locationStatus: "idle" | "loading" | "error";
  locationError: string;
  onUseCoordinates?: (latitude: number, longitude: number, preferredRadius?: string) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-[#5F7367]">Seller distance</span>
        {hasLocation ? (
          <button
            type="button"
            onClick={() => onChange("radiusKm", "")}
            className="rounded-full px-2 py-0.5 text-xs font-semibold text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800 cursor-pointer"
          >
            Clear
          </button>
        ) : null}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {distances.map((dist) => {
          const distValue = dist.replace("km", "");
          const isHighlighted = hasLocation && values.radiusKm === distValue;
          return (
            <button
              key={dist}
              type="button"
              onClick={() => onChange("radiusKm", isHighlighted ? "" : distValue)}
              className={`h-10 text-xs ${choiceBase} ${isHighlighted ? choiceSelected : choiceIdle}`}
            >
              {dist}
            </button>
          );
        })}
      </div>

      <div className="mt-2.5 text-xs leading-relaxed">
        {locationStatus === "loading" ? (
          <p className="animate-pulse font-medium text-[#457d00]">Finding your location…</p>
        ) : locationStatus === "error" ? (
          <div className="space-y-1">
            <p className="text-rose-700">{locationError}</p>
            {onUseCoordinates ? (
              <button
                type="button"
                onClick={() => onUseCoordinates(7.0731, 125.6128, values.radiusKm || "10")}
                className="font-semibold text-[#457d00] underline underline-offset-2 hover:opacity-80 cursor-pointer"
              >
                Use Davao City center instead
              </button>
            ) : null}
          </div>
        ) : hasLocation ? (
          <p className="font-medium text-[#5F7367]">Showing stalls within {values.radiusKm || "10"}km of you.</p>
        ) : (
          <p className="text-[#5F7367]">Pick a distance to find stalls near you.</p>
        )}
      </div>
    </div>
  );
}
