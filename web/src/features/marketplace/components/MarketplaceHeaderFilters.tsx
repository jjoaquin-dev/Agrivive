"use client";

import { ChevronDown } from "lucide-react";
import { Popover } from "@base-ui/react/popover";
import { useMarketplaceFilterParams } from "../hooks/useMarketplaceFilterParams";
import { DistanceFilterPanel, PriceFilterPanel } from "./MarketplaceFilterPanels";

// Text dropdowns, styled like the category dropdown beside them.
const triggerBase = "inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap border-l border-neutral-200 pl-2.5 pr-1 text-xs font-semibold transition-colors cursor-pointer";
const triggerIdle = "text-neutral-600 hover:text-neutral-900";
const triggerActive = "text-[#2F5400] font-bold";

// Price and distance dropdowns in the navbar search, beside the category. Filters are read from and written to the URL.
export function MarketplaceHeaderFilters() {
  const {
    filters,
    hasLocation,
    handleFilterChange,
    locationStatus,
    locationError,
    handleUseCoordinates,
  } = useMarketplaceFilterParams();

  const priceActive = Boolean(filters.minPrice || filters.maxPrice);
  const distanceActive = hasLocation && Boolean(filters.radiusKm);
  const priceLabel = priceActive ? `₱${filters.minPrice || "0"} – ₱${filters.maxPrice || "1000"}` : "Any price";
  const distanceLabel = distanceActive ? `Within ${filters.radiusKm}km` : "Any distance";

  return (
    <>
      <Popover.Root>
        <Popover.Trigger type="button" className={`${triggerBase} ${priceActive ? triggerActive : triggerIdle}`}>
          <span>Price</span>
          <span className="hidden font-normal opacity-80 xl:inline">{priceLabel}</span>
          <ChevronDown aria-hidden="true" className="size-3.5" />
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner sideOffset={8} className="z-50">
            <Popover.Popup className="w-[min(92vw,320px)] rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-[0_16px_40px_rgba(0,0,0,0.12)]">
              <PriceFilterPanel values={filters} onChange={handleFilterChange} />
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>

      <Popover.Root>
        <Popover.Trigger type="button" className={`${triggerBase} ${distanceActive ? triggerActive : triggerIdle}`}>
          <span>Distance</span>
          <span className="hidden font-normal opacity-80 xl:inline">{distanceLabel}</span>
          <ChevronDown aria-hidden="true" className="size-3.5" />
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner sideOffset={8} className="z-50">
            <Popover.Popup className="w-[min(92vw,320px)] rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-[0_16px_40px_rgba(0,0,0,0.12)]">
              <DistanceFilterPanel
                values={filters}
                onChange={handleFilterChange}
                hasLocation={hasLocation}
                locationStatus={locationStatus}
                locationError={locationError}
                onUseCoordinates={handleUseCoordinates}
              />
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </>
  );
}
