import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { fetchSellerMessages } from "../api/seller-messages";
import type { SellerMessage, SellerMessageFilter } from "../types";

export function useSellerMessages() {
  const [filter, setFilter] = useState<SellerMessageFilter>("open");
  const [messages, setMessages] = useState<SellerMessage[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [openCount, setOpenCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (reset = true) => {
    if (reset) setLoading(true);
    else setLoadingMore(true);
    setError(null);

    try {
      const response = await fetchSellerMessages({
        status: filter,
        limit: 20,
        cursor: reset ? undefined : nextCursor ?? undefined,
      });
      setMessages((previous) => (reset ? response.items : [...previous, ...response.items]));
      setNextCursor(response.nextCursor);
      setOpenCount(response.openCount);
    } catch (err: any) {
      console.error("Failed to load seller messages", err);
      setError(err?.message || "Could not load messages. Please try again.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }, [filter, nextCursor]);

  useFocusEffect(useCallback(() => {
    void load(true);
  }, [filter]));

  const refresh = useCallback(() => {
    setRefreshing(true);
    setNextCursor(null);
    void load(true);
  }, [load]);

  const loadMore = useCallback(() => {
    if (!nextCursor || loadingMore || loading) return;
    void load(false);
  }, [load, loading, loadingMore, nextCursor]);

  return {
    filter,
    setFilter: (value: SellerMessageFilter) => {
      setNextCursor(null);
      setFilter(value);
    },
    messages,
    openCount,
    loading,
    refreshing,
    loadingMore,
    error,
    refresh,
    loadMore,
  };
}
