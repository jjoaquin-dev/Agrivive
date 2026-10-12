"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { MarketplaceFilterValues } from "./MarketplaceFilters";
import type { MarketplaceUnit } from "../types";
import { MarketplaceLocationFilter } from "./MarketplaceLocationFilter";

const categories = [
  "Leafy Greens",
  "Fruit Vegetables",
  "Root Vegetables",
  "Pod Vegetables",
  "Tuber Vegetables",
  "Bulb Vegetables",
];

const units: MarketplaceUnit[] = ["kilo", "pile", "sack"];

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
}

export function MarketplaceFilterSidebar({
  values,
  onChange,
  onClearAll,
  resultsCount,
  showMap,
  onToggleMap,
  hasLocation,
  locationStatus,
  locationError,
  onUseLocation,
}: MarketplaceFilterSidebarProps) {
  return (
    <aside className="space-y-5 rounded-[24px] border border-border/80 bg-white p-5 shadow-[0_8px_24px_rgba(31,77,58,0.04)]">
      {/* Top Header: Results & Map Toggle */}
      <div className="flex items-center justify-between border-b border-border/70 pb-4">
        <div>
          <span className="font-heading text-base font-bold text-foreground">
            {resultsCount} listings
          </span>
          <p className="text-xs text-muted-foreground">Davao Public Markets</p>
        </div>
        <label className="flex cursor-pointer select-none items-center gap-2 text-xs font-semibold text-agrivive-primary">
          <span>Show on map</span>
          <button
            type="button"
            role="switch"
            aria-checked={showMap}
            onClick={() => onToggleMap(!showMap)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-agrivive-primary ${
              showMap ? "bg-agrivive-primary" : "bg-muted"
            }`}
          >
            <span
              className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                showMap ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </label>
      </div>

      {/* Produce Category Pills */}
      <div>
        <label className="mb-2.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Vegetable Category
        </label>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => onChange("productType", "")}
            className={`min-h-9 rounded-full px-3 text-xs font-medium transition-colors ${
              !values.productType
                ? "bg-agrivive-primary text-white shadow-xs"
                : "border border-border/80 bg-background text-foreground hover:bg-muted"
            }`}
          >
            All Produce
          </button>
          {categories.map((cat) => {
            const active = values.productType === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onChange("productType", active ? "" : cat)}
                className={`min-h-9 rounded-full px-3 text-xs font-medium transition-colors ${
                  active
                    ? "bg-agrivive-primary text-white shadow-xs"
                    : "border border-border/80 bg-background text-foreground hover:bg-muted"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Price Range (PHP)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            aria-label="Min Price"
            type="number"
            min="0"
            step="1"
            placeholder="Min ₱"
            value={values.minPrice}
            onChange={(e) => onChange("minPrice", e.target.value)}
            className="h-10 rounded-xl text-xs"
          />
          <Input
            aria-label="Max Price"
            type="number"
            min="0"
            step="1"
            placeholder="Max ₱"
            value={values.maxPrice}
            onChange={(e) => onChange("maxPrice", e.target.value)}
            className="h-10 rounded-xl text-xs"
          />
        </div>
      </div>

      {/* Selling Unit Pills */}
      <div>
        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Selling Unit
        </label>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => onChange("unit", "")}
            className={`min-h-8 rounded-lg px-2.5 text-xs font-medium ${
              !values.unit
                ? "bg-agrivive-primary text-white"
                : "border border-border/80 bg-background text-muted-foreground hover:bg-muted"
            }`}
          >
            Any
          </button>
          {units.map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => onChange("unit", values.unit === u ? "" : u)}
              className={`min-h-8 rounded-lg px-2.5 text-xs font-medium capitalize ${
                values.unit === u
                  ? "bg-agrivive-primary text-white"
                  : "border border-border/80 bg-background text-muted-foreground hover:bg-muted"
              }`}
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      {/* Nearby GPS Pickup */}
      <MarketplaceLocationFilter
        hasLocation={hasLocation}
        locationStatus={locationStatus}
        locationError={locationError}
        onUseLocation={onUseLocation}
      />

      {/* Clear All Action */}
      <div className="border-t border-border/70 pt-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="w-full gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="size-3.5" />
          Reset filters
        </Button>
      </div>
    </aside>
  );
}
