import { useState, useEffect, useCallback } from "react";
import {
  fetchSellerProduct,
  adjustProductStock,
  archiveSellerProduct,
  reactivateSellerProduct,
} from "../api/products";
import { fetchStockAdjustments } from "../api/stock-adjustments";
import type { Product, StockAdjustment } from "../types";

export function useProduct(productId: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [history, setHistory] = useState<StockAdjustment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProduct = useCallback(async () => {
    if (!productId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSellerProduct(productId);
      setProduct(data);
    } catch (err: any) {
      console.error("Failed to load product", err);
      setError(err?.message || "Failed to load product details.");
    } finally {
      setLoading(false);
    }
  }, [productId]);

  const loadHistory = useCallback(async () => {
    if (!productId) return;
    setLoadingHistory(true);
    try {
      const res = await fetchStockAdjustments({ productId, limit: 20 });
      setHistory(res.items);
    } catch (err) {
      console.error("Failed to load product stock history", err);
    } finally {
      setLoadingHistory(false);
    }
  }, [productId]);

  useEffect(() => {
    loadProduct();
    loadHistory();
  }, [loadProduct, loadHistory]);

  const adjustStock = useCallback(
    async (delta: number, reason: string) => {
      setActionLoading(true);
      try {
        const updated = await adjustProductStock(productId, delta, reason);
        setProduct(updated);
        await loadHistory();
        return updated;
      } finally {
        setActionLoading(false);
      }
    },
    [productId, loadHistory],
  );

  const archive = useCallback(async () => {
    setActionLoading(true);
    try {
      const updated = await archiveSellerProduct(productId);
      setProduct(updated);
      return updated;
    } finally {
      setActionLoading(false);
    }
  }, [productId]);

  const reactivate = useCallback(async () => {
    setActionLoading(true);
    try {
      const updated = await reactivateSellerProduct(productId);
      setProduct(updated);
      return updated;
    } finally {
      setActionLoading(false);
    }
  }, [productId]);

  return {
    product,
    history,
    loading,
    loadingHistory,
    actionLoading,
    error,
    refresh: loadProduct,
    adjustStock,
    archive,
    reactivate,
  };
}
