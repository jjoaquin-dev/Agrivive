import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import {
  fetchSellerPromotions,
  markAllSellerPromotionsRead,
  markSellerPromotionRead,
} from "../api/seller-promotions";
import type { SellerPromotion } from "../types";

export function useSellerPromotions() {
  const [items, setItems] = useState<SellerPromotion[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (reset = true) => {
    if (reset) setLoading(true);
    else setLoadingMore(true);
    setError(null);
    try {
      const response = await fetchSellerPromotions({
        limit: 10,
        cursor: reset ? undefined : nextCursor ?? undefined,
      });
      setItems((previous) => reset ? response.items : [...previous, ...response.items]);
      setNextCursor(response.nextCursor);
      setUnreadCount(response.unreadCount);
    } catch (err: any) {
      console.error("Failed to load seller promotions", err);
      setError(err?.message || "Could not load Priority Boost drafts. Please try again.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }, [nextCursor]);

  useFocusEffect(useCallback(() => { void load(true); }, []));

  const refresh = useCallback(() => {
    setRefreshing(true);
    setNextCursor(null);
    void load(true);
  }, [load]);

  const loadMore = useCallback(() => {
    if (nextCursor && !loading && !loadingMore) void load(false);
  }, [load, loading, loadingMore, nextCursor]);

  const markRead = useCallback(async (id: string) => {
    const result = await markSellerPromotionRead(id);
    setItems((current) => current.map((item) => item.id === id ? { ...item, readAt: result.readAt } : item));
    setUnreadCount((count) => Math.max(0, count - 1));
  }, []);

  const markAllRead = useCallback(async () => {
    await markAllSellerPromotionsRead();
    const readAt = new Date().toISOString();
    setItems((current) => current.map((item) => ({ ...item, readAt: item.readAt ?? readAt })));
    setUnreadCount(0);
  }, []);

  return {
    items, nextCursor, unreadCount, loading, refreshing, loadingMore, error,
    refresh, loadMore, markRead, markAllRead,
  };
}
