import { useState, useCallback, useMemo } from "react";
import { useFocusEffect } from "expo-router";
import { fetchSellerProducts } from "../api/products";
import type { InventorySummary, Product, ProductCategory, ProductScalingType } from "../types";

export type InventoryFilterTab = "all" | "low_stock" | "out_of_stock" | "archived";

export function useInventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "all">("all");
  const [filterTab, setFilterTab] = useState<InventoryFilterTab>("all");

  const loadProducts = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const data = await fetchSellerProducts();
      setProducts(data);
    } catch (err: any) {
      console.error("Failed to load seller products", err);
      setError(err?.message || "Could not load products. Please check connection.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadProducts();
    }, [loadProducts]),
  );

  const onRefresh = useCallback(() => {
    loadProducts(true);
  }, [loadProducts]);

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
      totalProducts: activeCount,
      lowStockCount,
      outOfStockCount,
      activeCount,
      archivedCount,
      unitTotals,
    };
  }, [products]);

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

        if (filterTab === "low_stock") {
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
    error,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filterTab,
    setFilterTab,
    refresh: onRefresh,
  };
}
