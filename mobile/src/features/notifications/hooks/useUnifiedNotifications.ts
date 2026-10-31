import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useIsFocused, useRouter } from "expo-router";
import { useRefreshOnSignal } from "../../../hooks/useRefreshOnSignal";
import { useSellerNotifications } from "./useSellerNotifications";
import { useSellerPromotions } from "./useSellerPromotions";
import { fetchSellerBoostPrompts, markAllSellerBoostPromptsRead } from "../../boost/api/visibility-boosts";
import { fetchConversations, markAllConversationsRead } from "../../conversations/api";
import { mapUnifiedNotificationItems } from "../utils/unifiedNotificationMappers";
import type { NotificationCategory, SellerBoostPrompt } from "../types";
import type { Conversation } from "../../conversations/types";

export function useUnifiedNotifications() {
  const router = useRouter();
  const sellerNotices = useSellerNotifications();
  const sellerPromotions = useSellerPromotions();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [boosts, setBoosts] = useState<SellerBoostPrompt[]>([]);
  const [boostCursor, setBoostCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [readVersion, setReadVersion] = useState(0);
  const markedReadIdsRef = useRef<Set<string>>(new Set());

  const loadData = useCallback(async (reset = true, cursor: string | null = null) => {
    if (reset) setLoading(true);
    else setLoadingMore(true);

    try {
      const [convosRes, boostsRes] = await Promise.allSettled([
        fetchConversations(),
        fetchSellerBoostPrompts({ limit: 15, cursor: cursor ?? undefined }),
      ]);
      if (convosRes.status === "fulfilled") {
        const raw = convosRes.value;
        setConversations(Array.isArray(raw) ? raw : (raw as any)?.items || []);
      }
      if (boostsRes.status === "fulfilled") {
        const next = boostsRes.value.items;
        setBoosts((previous) => (reset ? next : [...previous, ...next]));
        setBoostCursor(boostsRes.value.nextCursor ?? null);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => { void loadData(true); }, [loadData]);

  const isFocused = useIsFocused();
  useRefreshOnSignal(() => loadData(true), { pushTypes: ["seller_message", "seller_alert"], enabled: isFocused });

  const items = useMemo(() => {
    const list = mapUnifiedNotificationItems({
      conversations,
      notices: sellerNotices.items,
      promotions: sellerPromotions.items,
      boosts,
      router,
      markedReadIds: markedReadIdsRef.current,
    });
    return list.sort((a, b) => {
      const timeA = a.rawDate && !isNaN(a.rawDate.getTime()) ? a.rawDate.getTime() : 0;
      const timeB = b.rawDate && !isNaN(b.rawDate.getTime()) ? b.rawDate.getTime() : 0;
      return timeB - timeA;
    });
    // readVersion re-runs the mapping after "mark all read" updates the ref.
  }, [boosts, conversations, router, sellerNotices.items, sellerPromotions.items, readVersion]);

  const refresh = () => {
    setRefreshing(true);
    void sellerNotices.refresh();
    void sellerPromotions.refresh();
    void loadData(true);
  };

  const loadMore = () => {
    if (loading || loadingMore) return;
    if (!boostCursor && !sellerNotices.hasMore) return;
    if (sellerNotices.hasMore) sellerNotices.loadMore();
    if (boostCursor) void loadData(false, boostCursor);
  };

  const markAllRead = async () => {
    items.forEach((item) => markedReadIdsRef.current.add(item.id));
    setReadVersion((version) => version + 1);
    await Promise.allSettled([
      sellerNotices.markAllRead(),
      sellerPromotions.markAllRead(),
      markAllSellerBoostPromptsRead(),
      markAllConversationsRead(),
    ]);
  };

  const counts: Record<NotificationCategory, number> = {
    all: items.length,
    reservations: items.filter((i) => i.category === "reservations").length,
    messages: items.filter((i) => i.category === "messages").length,
    listings: items.filter((i) => i.category === "listings").length,
    trust: items.filter((i) => i.category === "trust").length,
  };

  return {
    items,
    counts,
    unreadCount: items.filter((i) => !i.read).length,
    urgentCount: items.filter((i) => i.urgent).length,
    loading,
    refreshing,
    loadingMore,
    hasMore: Boolean(boostCursor || sellerNotices.hasMore),
    refresh,
    loadMore,
    markAllRead,
  };
}
