import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";
import { useSellerNotifications } from "./useSellerNotifications";
import { useSellerPromotions } from "./useSellerPromotions";
import { fetchSellerBoostPrompts, markAllSellerBoostPromptsRead } from "../../boost/api/visibility-boosts";
import { fetchSellerOrders } from "../../orders/api/seller-orders";
import { fetchConversations, markAllConversationsRead } from "../../conversations/api";
import { fetchSellerProducts } from "../../inventory/api/products";
import { mapUnifiedNotificationItems } from "../utils/unifiedNotificationMappers";
import type { NotificationCategory, SellerBoostPrompt, UnifiedNotificationItem } from "../types";
import type { SellerOrder } from "../../orders/types";
import type { Conversation } from "../../conversations/types";

export function useUnifiedNotifications() {
  const router = useRouter();
  const sellerNotices = useSellerNotifications();
  const sellerPromotions = useSellerPromotions();
  const [items, setItems] = useState<UnifiedNotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [orderCursor, setOrderCursor] = useState<string | null>(null);
  const [boostCursor, setBoostCursor] = useState<string | null>(null);
  const [accumulatedOrders, setAccumulatedOrders] = useState<SellerOrder[]>([]);
  const [accumulatedBoosts, setAccumulatedBoosts] = useState<SellerBoostPrompt[]>([]);
  const markedReadIdsRef = useRef<Set<string>>(new Set());

  const loadData = useCallback(async (reset = true) => {
    if (reset) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const [ordersRes, convosRes, boostsRes, prodsRes] = await Promise.allSettled([
        fetchSellerOrders({ limit: 15, cursor: reset ? undefined : orderCursor ?? undefined }),
        fetchConversations(),
        fetchSellerBoostPrompts({ limit: 15, cursor: reset ? undefined : boostCursor ?? undefined }),
        fetchSellerProducts({ limit: 5 }),
      ]);

      const newOrders = ordersRes.status === "fulfilled" ? ordersRes.value.orders : [];
      const newBoosts = boostsRes.status === "fulfilled" ? boostsRes.value.items : [];
      if (ordersRes.status === "fulfilled") setOrderCursor(ordersRes.value.nextCursor);
      if (boostsRes.status === "fulfilled") setBoostCursor(boostsRes.value.nextCursor ?? null);

      const allOrders = reset ? newOrders : [...accumulatedOrders, ...newOrders];
      const allBoosts = reset ? newBoosts : [...accumulatedBoosts, ...newBoosts];
      setAccumulatedOrders(allOrders);
      setAccumulatedBoosts(allBoosts);

      const rawConvos = convosRes.status === "fulfilled" ? convosRes.value : [];
      const convos: Conversation[] = Array.isArray(rawConvos) ? rawConvos : (rawConvos as any)?.items || [];
      const prods = prodsRes.status === "fulfilled" ? prodsRes.value.items : [];

      const list = mapUnifiedNotificationItems({
        orders: allOrders,
        conversations: convos,
        notices: sellerNotices.items,
        promotions: sellerPromotions.items,
        boosts: allBoosts,
        products: prods,
        router,
        markedReadIds: markedReadIdsRef.current,
      });

      list.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());
      setItems(list);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, [accumulatedBoosts, accumulatedOrders, boostCursor, orderCursor, router, sellerNotices.items, sellerPromotions.items]);

  useEffect(() => { void loadData(true); }, []);

  const refresh = () => {
    setRefreshing(true);
    setOrderCursor(null);
    setBoostCursor(null);
    void sellerNotices.refresh();
    void sellerPromotions.refresh();
    void loadData(true);
  };

  const loadMore = () => {
    if (loading || loadingMore) return;
    if (!orderCursor && !boostCursor && !sellerNotices.loadMore) return;
    if (sellerNotices.loadMore) sellerNotices.loadMore();
    void loadData(false);
  };

  const markAllRead = async () => {
    items.forEach((item) => markedReadIdsRef.current.add(item.id));
    setItems((prev) => prev.map((item) => ({ ...item, read: true })));
    try {
      await Promise.allSettled([
        sellerNotices.markAllRead(),
        sellerPromotions.markAllRead(),
        markAllSellerBoostPromptsRead(),
        markAllConversationsRead(),
      ]);
    } catch {}
  };

  const counts: Record<NotificationCategory, number> = {
    all: items.length,
    reservations: items.filter((i) => i.category === "reservations").length,
    messages: items.filter((i) => i.category === "messages").length,
    listings: items.filter((i) => i.category === "listings").length,
    trust: items.filter((i) => i.category === "trust").length,
  };

  const unreadCount = items.filter((i) => !i.read).length;
  const urgentCount = items.filter((i) => i.urgent).length;

  return {
    items,
    counts,
    unreadCount,
    urgentCount,
    loading,
    refreshing,
    loadingMore,
    hasMore: Boolean(orderCursor || boostCursor),
    refresh,
    loadMore,
    markAllRead,
  };
}
