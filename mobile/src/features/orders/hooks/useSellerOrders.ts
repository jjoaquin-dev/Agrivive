import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { fetchSellerOrders } from "../api/seller-orders";
import type { SellerOrder, SellerOrderFilter } from "../types";

export function useSellerOrders() {
  const [filter, setFilter] = useState<SellerOrderFilter>("pending");
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = useCallback(async (reset = true) => {
    if (reset) setLoading(true);
    else setLoadingMore(true);
    setError(null);

    try {
      const response = await fetchSellerOrders({
        status: filter,
        limit: 20,
        cursor: reset ? undefined : nextCursor ?? undefined,
      });
      setOrders((previous) => (reset ? response.orders : [...previous, ...response.orders]));
      setNextCursor(response.nextCursor);
    } catch (err: any) {
      console.error("Failed to load seller orders", err);
      setError(err?.message || "Could not load orders. Please try again.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }, [filter, nextCursor]);

  useFocusEffect(
    useCallback(() => {
      void loadOrders(true);
    }, [filter]),
  );

  const refresh = useCallback(() => {
    setRefreshing(true);
    setNextCursor(null);
    void loadOrders(true);
  }, [loadOrders]);

  const loadMore = useCallback(() => {
    if (!nextCursor || loadingMore || loading) return;
    void loadOrders(false);
  }, [loadOrders, loading, loadingMore, nextCursor]);

  return {
    filter,
    setFilter: (nextFilter: SellerOrderFilter) => {
      setNextCursor(null);
      setFilter(nextFilter);
    },
    orders,
    loading,
    refreshing,
    loadingMore,
    error,
    refresh,
    loadMore,
  };
}
