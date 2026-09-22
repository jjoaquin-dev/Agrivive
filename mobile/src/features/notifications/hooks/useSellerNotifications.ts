import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import {
  fetchSellerNotifications,
  markAllSellerNotificationsRead,
  markSellerNotificationRead,
} from "../api/seller-notifications";
import type { SellerNotification } from "../types";

export function useSellerNotifications() {
  const [items, setItems] = useState<SellerNotification[]>([]);
  const [unreadOnly, setUnreadOnly] = useState(false);
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
      const response = await fetchSellerNotifications({
        limit: 20,
        cursor: reset ? undefined : nextCursor ?? undefined,
        unreadOnly,
      });
      setItems((previous) => (reset ? response.items : [...previous, ...response.items]));
      setNextCursor(response.nextCursor);
      setUnreadCount(response.unreadCount);
    } catch (err: any) {
      console.error("Failed to load seller notifications", err);
      setError(err?.message || "Could not load notifications. Please try again.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }, [nextCursor, unreadOnly]);

  useFocusEffect(
    useCallback(() => {
      void load(true);
    }, [unreadOnly]),
  );

  const refresh = useCallback(() => {
    setRefreshing(true);
    setNextCursor(null);
    void load(true);
  }, [load]);

  const loadMore = useCallback(() => {
    if (!nextCursor || loadingMore || loading) return;
    void load(false);
  }, [load, loading, loadingMore, nextCursor]);

  const markRead = useCallback(async (notificationId: string) => {
    const updated = await markSellerNotificationRead(notificationId);
    setItems((previous) => previous.map((item) => (
      item.id === updated.id ? updated : item
    )));
    setUnreadCount((count) => Math.max(0, count - 1));
    return updated;
  }, []);

  const markAllRead = useCallback(async () => {
    await markAllSellerNotificationsRead();
    setItems((previous) => previous.map((item) => ({ ...item, readAt: new Date().toISOString() })));
    setUnreadCount(0);
  }, []);

  return {
    items,
    unreadOnly,
    setUnreadOnly: (value: boolean) => {
      setNextCursor(null);
      setUnreadOnly(value);
    },
    unreadCount,
    loading,
    refreshing,
    loadingMore,
    error,
    refresh,
    loadMore,
    markRead,
    markAllRead,
  };
}
