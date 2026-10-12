"use client";

import { MapPin } from "lucide-react";

interface MarketplaceLocationFilterProps {
  hasLocation: boolean;
  locationStatus: "idle" | "loading" | "error";
  locationError: string;
  onUseLocation: () => void;
}

export function MarketplaceLocationFilter({
  hasLocation,
  locationStatus,
  locationError,
  onUseLocation,
}: MarketplaceLocationFilterProps) {
  return (
    <div className="border-t border-border/70 pt-4">
      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Nearby Stalls
      </label>
      <button
        type="button"
        onClick={onUseLocation}
        disabled={locationStatus === "loading"}
        className="flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-agrivive-primary/40 bg-agrivive-background px-3 text-xs font-semibold text-agrivive-primary hover:bg-agrivive-primary/10"
      >
        <MapPin className="size-3.5" />
        {locationStatus === "loading" ? "Finding you…" : hasLocation ? "Location active" : "Find near me"}
      </button>
      {locationError ? (
        <p className="mt-1 text-[11px] text-destructive">{locationError}</p>
      ) : null}
    </div>
  );
}
