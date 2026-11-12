"use client";

import type { MarketplaceFilterValues } from "./MarketplaceFilters";
import { MarketplacePriceSlider } from "./MarketplacePriceSlider";

const distances = ["1km", "3km", "5km", "10km"];

const choiceBase = "flex cursor-pointer select-none items-center justify-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-agrivive-primary/30";
const choiceSelected = "border-agrivive-primary/50 bg-agrivive-primary/8 font-bold text-agrivive-ink";
const choiceIdle = "border-neutral-200/80 bg-white font-semibold text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50";

type FilterChange = (key: keyof MarketplaceFilterValues, value: string) => void;

export function PriceFilterPanel({ values, onChange }: { values: MarketplaceFilterValues; onChange: FilterChange }) {
  return (
    <div>
      <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-agrivive-stone">Price range (PHP)</span>
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
        <span className="text-xs font-bold uppercase tracking-wider text-agrivive-stone">Seller distance</span>
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
          <p className="animate-pulse font-medium text-agrivive-primary">Finding your location…</p>
        ) : locationStatus === "error" ? (
          <div className="space-y-1">
            <p className="text-destructive">{locationError}</p>
            {onUseCoordinates ? (
              <button
                type="button"
                onClick={() => onUseCoordinates(7.0731, 125.6128, values.radiusKm || "10")}
                className="font-semibold text-agrivive-primary underline underline-offset-2 hover:opacity-80 cursor-pointer"
              >
                Use Davao City center instead
              </button>
            ) : null}
          </div>
        ) : hasLocation ? (
          <p className="font-medium text-agrivive-stone">Showing stalls within {values.radiusKm || "10"}km of you.</p>
        ) : (
          <p className="text-agrivive-stone">Pick a distance to find stalls near you.</p>
        )}
      </div>
    </div>
  );
}
