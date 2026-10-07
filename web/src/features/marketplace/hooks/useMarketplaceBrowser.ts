"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ApiError, isAbortError } from "@/src/lib/api";
import { listMarketplaceProducts } from "../api/marketplace";
import { listMarketplaceSellersMap } from "../api/seller-map";
import type { MarketplaceProduct, MarketplaceSellerMapResponse } from "../types";
import type { MarketplaceFilterValues } from "../components/MarketplaceFilters";
import { useMarketplaceLocation } from "./useMarketplaceLocation";

export function useMarketplaceBrowser() {
  const router = useRouter();
  const pathname = usePathname() ?? "/marketplace";
  const searchParams = useSearchParams() ?? new URLSearchParams();
  const searchKey = searchParams.toString();
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);
  const [resultKey, setResultKey] = useState<string | null>(null);
  const [sellerMap, setSellerMap] = useState<MarketplaceSellerMapResponse>({ sellers: [], unmappedSellerCount: 0 });
  const [sellerMapLoading, setSellerMapLoading] = useState(true);
  const [sellerMapError, setSellerMapError] = useState("");
  const [sellerMapRetryKey, setSellerMapRetryKey] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(searchKey);
    setSearchInput(params.get("search") ?? "");
    const controller = new AbortController();
    let active = true;
    setLoading(true);
    setError("");
    listMarketplaceProducts(params, controller.signal)
      .then((result) => {
        if (active) {
          setProducts(result.products);
          setNextCursor(result.nextCursor);
          setResultKey(searchKey);
        }
      })
      .catch((reason: unknown) => {
        if (active && !isAbortError(reason)) {
          setError(reason instanceof ApiError ? reason.message : "We could not load the marketplace.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [searchKey, retryKey]);

  useEffect(() => {
    const params = new URLSearchParams(searchKey);
    params.delete("cursor");
    params.delete("limit");
    const controller = new AbortController();
    let active = true;
    setSellerMapLoading(true);
    setSellerMapError("");
    listMarketplaceSellersMap(params, controller.signal)
      .then((result) => {
        if (active) setSellerMap(result);
      })
      .catch((reason: unknown) => {
        if (active && !isAbortError(reason)) {
          setSellerMapError(reason instanceof ApiError ? reason.message : "We could not refresh the seller map.");
        }
      })
      .finally(() => {
        if (active) setSellerMapLoading(false);
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [searchKey, sellerMapRetryKey]);

  const filters = useMemo<MarketplaceFilterValues>(() => {
    const params = new URLSearchParams(searchKey);
    return {
      productType: params.get("productType") ?? "",
      unit: params.get("unit") ?? "",
      sellerType: params.get("sellerType") ?? "",
      minPrice: params.get("minPrice") ?? "",
      maxPrice: params.get("maxPrice") ?? "",
      minQuantity: params.get("minQuantity") ?? "",
      maxQuantity: params.get("maxQuantity") ?? "",
      radiusKm: params.get("radiusKm") ?? "10",
    };
  }, [searchKey]);

  function navigateWithParams(params: URLSearchParams) {
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  const { locationStatus, locationError, handleRemoveLocation, handleUseLocation } = useMarketplaceLocation(searchKey, navigateWithParams);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams(searchKey);
    if (searchInput.trim()) params.set("search", searchInput.trim());
    else params.delete("search");
    navigateWithParams(params);
  }

  function handleFilterChange(key: keyof MarketplaceFilterValues, value: string) {
    const params = new URLSearchParams(searchKey);
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("cursor");
    navigateWithParams(params);
  }

  function handleRemoveSearch() {
    setSearchInput("");
    const params = new URLSearchParams(searchKey);
    params.delete("search");
    navigateWithParams(params);
  }

  function clearFilters() {
    const params = new URLSearchParams();
    const search = searchParams.get("search");
    if (search) params.set("search", search);
    navigateWithParams(params);
  }

  async function handleLoadMore() {
    if (!nextCursor || loadingMore || resultKey !== searchKey) return;
    setLoadingMore(true);
    try {
      const params = new URLSearchParams(searchKey);
      params.set("cursor", nextCursor);
      const result = await listMarketplaceProducts(params);
      setProducts((current) => [...current, ...result.products]);
      setNextCursor(result.nextCursor);
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : "We could not load more listings.");
    } finally {
      setLoadingMore(false);
    }
  }

  const filterProps = {
    values: filters,
    onChange: handleFilterChange,
  };

  return {
    searchKey,
    products,
    nextCursor,
    searchInput,
    setSearchInput,
    loading,
    staleProducts: products.length > 0 && (loading || resultKey !== searchKey || Boolean(error)),
    loadingMore,
    error,
    sellerMap,
    sellerMapLoading,
    sellerMapError,
    filters,
    searchQuery: searchParams.get("search") ?? "",
    hasLocation: Boolean(searchParams.get("latitude") && searchParams.get("longitude")),
    locationStatus,
    locationError,
    handleUseLocation,
    filterProps,
    handleSearch,
    handleFilterChange,
    handleRemoveSearch,
    handleRemoveLocation,
    clearFilters,
    handleLoadMore,
    retrySellerMap: () => setSellerMapRetryKey((current) => current + 1),
    retry: () => setRetryKey((current) => current + 1),
  };
}
