"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { MarketplaceFilterValues } from "../components/MarketplaceFilters";
import { useMarketplaceLocation } from "./useMarketplaceLocation";

// Filters live in the URL, so the navbar and the page read the same values.
export function useMarketplaceFilterParams() {
  const router = useRouter();
  const pathname = usePathname() ?? "/marketplace";
  const searchParams = useSearchParams() ?? new URLSearchParams();
  const searchKey = searchParams.toString();

  const filters = useMemo<MarketplaceFilterValues>(() => {
    const params = new URLSearchParams(searchKey);
    return {
      productType: params.get("productType") ?? "",
      unit: params.get("unit") ?? "",
      minPrice: params.get("minPrice") ?? "",
      maxPrice: params.get("maxPrice") ?? "",
      minQuantity: params.get("minQuantity") ?? "",
      maxQuantity: params.get("maxQuantity") ?? "",
      radiusKm: params.get("radiusKm") ?? "",
    };
  }, [searchKey]);

  function navigateWithParams(params: URLSearchParams) {
    const query = params.toString();
    // From other buyer pages (the shared navbar), filters open the marketplace.
    if (!pathname.startsWith("/marketplace")) {
      router.push(query ? `/marketplace?${query}` : "/marketplace");
      return;
    }
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  const location = useMarketplaceLocation(searchKey, navigateWithParams);

  function handleFilterChange(key: keyof MarketplaceFilterValues, value: string) {
    if (key === "radiusKm") {
      if (!value) {
        location.handleRemoveLocation();
        return;
      }
      if (!searchParams.get("latitude") || !searchParams.get("longitude")) {
        location.handleUseLocation(value);
        return;
      }
    }
    const params = new URLSearchParams(searchKey);
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("cursor");
    navigateWithParams(params);
  }

  function clearFilters() {
    const params = new URLSearchParams();
    const search = searchParams.get("search");
    if (search) params.set("search", search);
    navigateWithParams(params);
  }

  return {
    searchKey,
    filters,
    hasLocation: Boolean(searchParams.get("latitude") && searchParams.get("longitude")),
    navigateWithParams,
    handleFilterChange,
    clearFilters,
    ...location,
  };
}
