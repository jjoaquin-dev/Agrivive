import { useCallback, useState } from "react";
import { useFocusEffect, useIsFocused } from "expo-router";
import { useRefreshOnSignal } from "../../../hooks/useRefreshOnSignal";
import { fetchConversations } from "../api";
import type { Conversation } from "../types";

/** The seller chat list. Pass archived to get the archived ones; enabled=false waits until they are needed. */
export function useSellerConversations(archived = false, enabled = true) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (reset = true) => {
    if (reset) {
      if (conversations.length === 0) setLoading(true);
      setError(null);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await fetchConversations({
        limit: 20,
        archived,
        cursor: reset ? undefined : nextCursor ?? undefined,
      });
      setConversations((prev) => (reset ? response.items : [...prev, ...response.items]));
      setNextCursor(response.nextCursor);
    } catch (reason: any) {
      setError(reason?.message || "Could not load conversations. Please try again.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }, [nextCursor, conversations.length]);

  useFocusEffect(useCallback(() => {
    if (enabled) void load(true);
  }, [enabled]));

  const isFocused = useIsFocused();
  useRefreshOnSignal(() => load(true), { pushTypes: ["seller_message"], enabled: isFocused && enabled });

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
    conversations,
    loading,
    refreshing,
    loadingMore,
    hasMore: Boolean(nextCursor),
    error,
    refresh,
    loadMore,
  };
}
