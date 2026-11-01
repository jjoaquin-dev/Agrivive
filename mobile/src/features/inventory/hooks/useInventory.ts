import { useState, useCallback, useMemo } from "react";
import { useFocusEffect } from "expo-router";
import { fetchSellerProducts } from "../api/products";
import type { InventorySummary, Product, ProductCategory, ProductScalingType } from "../types";

export type InventoryFilterTab = "all" | "selling" | "low_stock" | "out_of_stock" | "archived";

export function useInventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [serverSummary, setServerSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "all">("all");
  const [filterTab, setFilterTab] = useState<InventoryFilterTab>("all");

  const loadProducts = useCallback(async (reset = true) => {
    if (reset) {
      if (products.length === 0) setLoading(true);
      setError(null);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await fetchSellerProducts({
        limit: 20,
        cursor: reset ? undefined : nextCursor ?? undefined,
      });
      setProducts((prev) => (reset ? response.items : [...prev, ...response.items]));
      setNextCursor(response.nextCursor);
      if (response.summary) {
        setServerSummary(response.summary);
      }
    } catch (err: any) {
      console.error("Failed to load seller products", err);
      setError(err?.message || "Could not load products. Please check connection.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }, [nextCursor, products.length]);

  useFocusEffect(
    useCallback(() => {
      void loadProducts(true);
    }, []),
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setNextCursor(null);
    void loadProducts(true);
  }, [loadProducts]);

  const loadMore = useCallback(() => {
    if (!nextCursor || loadingMore || loading) return;
    void loadProducts(false);
  }, [loadProducts, loading, loadingMore, nextCursor]);

  // Inventory Dashboard Summaries
  const summary = useMemo<InventorySummary>(() => {
    let lowStockCount = 0;
    let outOfStockCount = 0;
    let activeCount = 0;
    let archivedCount = 0;

    const unitTotals: Record<ProductScalingType, number> = {
      kilo: 0,
      sack: 0,
      pile: 0,
    };

    for (const p of products) {
      if (!p.isActive) {
        archivedCount++;
        continue;
      }
      activeCount++;
      const qty = parseFloat(p.productQty as string) || 0;
      const threshold = p.lowStockThreshold != null ? parseFloat(p.lowStockThreshold as string) : null;
      const isLowAmount = threshold != null && qty <= threshold;

      if (isLowAmount) {
        lowStockCount++;
      }
      if (qty <= 0) {
        outOfStockCount++;
      }

      if (p.scalingType in unitTotals) {
        unitTotals[p.scalingType] += qty;
      }
    }

    return {
      totalProducts: serverSummary?.totalProducts ?? activeCount,
      lowStockCount: serverSummary?.lowStockCount ?? lowStockCount,
      outOfStockCount: serverSummary?.outOfStockCount ?? outOfStockCount,
      activeCount: serverSummary?.activeCount ?? activeCount,
      archivedCount: serverSummary?.archivedCount ?? archivedCount,
      unitTotals,
    };
  }, [products, serverSummary]);

  // Low stock products list (for alerts on Home)
  const lowStockProducts = useMemo(() => {
    return products.filter((p) => {
      if (!p.isActive) return false;
      const qty = parseFloat(p.productQty as string) || 0;
      const threshold = p.lowStockThreshold != null ? parseFloat(p.lowStockThreshold as string) : null;
      return threshold != null && qty <= threshold;
    });
  }, [products]);

  // Filtered products list for Inventory Screen
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Tab filter
      if (filterTab === "archived") {
        if (p.isActive) return false;
      } else {
        if (!p.isActive) return false;
        const qty = parseFloat(p.productQty as string) || 0;
        const threshold = p.lowStockThreshold != null ? parseFloat(p.lowStockThreshold as string) : null;

        if (filterTab === "selling") {
          if (qty <= 0) return false;
        } else if (filterTab === "low_stock") {
          if (threshold == null || qty > threshold) return false;
        } else if (filterTab === "out_of_stock") {
          if (qty > 0) return false;
        }
      }

      // Category filter
      if (selectedCategory !== "all" && p.productType !== selectedCategory) {
        return false;
      }

      // Search query (Doherty threshold fast match)
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchesName = p.productName.toLowerCase().includes(query);
        const matchesCat = p.productType.toLowerCase().includes(query);
        if (!matchesName && !matchesCat) return false;
      }

      return true;
    });
  }, [products, filterTab, selectedCategory, searchQuery]);

  return {
    products,
    filteredProducts,
    summary,
    lowStockProducts,
    loading,
    refreshing,
    loadingMore,
    hasMore: Boolean(nextCursor),
    error,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filterTab,
    setFilterTab,
    refresh: onRefresh,
    loadMore,
  };
}
