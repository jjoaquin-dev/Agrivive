"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ApiError, isAbortError } from "@/src/lib/api";
import { listMarketplaceProducts } from "../api/marketplace";
import type { MarketplaceProduct } from "../types";
import type { MarketplaceFilterValues } from "../components/MarketplaceFilters";

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

  useEffect(() => {
    const params = new URLSearchParams(searchKey);
    setSearchInput(params.get("search") ?? "");
    const controller = new AbortController();
    let active = true;
    setLoading(true);
    setError("");
    setProducts([]);
    setNextCursor(null);
    listMarketplaceProducts(params, controller.signal)
      .then((result) => {
        if (active) {
          setProducts(result.products);
          setNextCursor(result.nextCursor);
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
  }, [searchKey]);

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
    };
  }, [searchKey]);

  function navigateWithParams(params: URLSearchParams) {
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

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

  function handleRemoveLocation() {
    const params = new URLSearchParams(searchKey);
    params.delete("latitude");
    params.delete("longitude");
    params.delete("radiusKm");
    navigateWithParams(params);
  }

  function clearFilters() {
    const params = new URLSearchParams();
    const search = searchParams.get("search");
    if (search) params.set("search", search);
    navigateWithParams(params);
  }

  async function handleLoadMore() {
    if (!nextCursor || loadingMore) return;
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
    loadingMore,
    error,
    filters,
    searchQuery: searchParams.get("search") ?? "",
    hasLocation: Boolean(searchParams.get("latitude") && searchParams.get("longitude")),
    filterProps,
    handleSearch,
    handleFilterChange,
    handleRemoveSearch,
    handleRemoveLocation,
    clearFilters,
    handleLoadMore,
    retry: () => navigateWithParams(new URLSearchParams(searchKey)),
  };
}
