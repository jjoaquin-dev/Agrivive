import { useCallback, useEffect, useState } from "react";
import { Share } from "react-native";
import { useRouter } from "expo-router";
import { useSellerNotifications } from "./useSellerNotifications";
import { useSellerPromotions } from "./useSellerPromotions";
import { fetchSellerBoostPrompts } from "../../boost/api/visibility-boosts";
import { fetchSellerOrders } from "../../orders/api/seller-orders";
import { fetchConversations } from "../../conversations/api";
import { fetchSellerProducts } from "../../inventory/api/products";
import { getSellerPromotionShare } from "../api/seller-promotions";
import type { NotificationCategory, UnifiedNotificationItem } from "../types";

function formatRelativeTime(date: Date): string {
  const diffMin = Math.floor((Date.now() - date.getTime()) / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? "s" : ""} ago`;
  if (Math.floor(diffHours / 24) === 1) return "Yesterday";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function useUnifiedNotifications() {
  const router = useRouter();
  const sellerNotices = useSellerNotifications();
  const sellerPromotions = useSellerPromotions();
  const [items, setItems] = useState<UnifiedNotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [ordersRes, convosRes, boostsRes, prodsRes] = await Promise.allSettled([
        fetchSellerOrders({ limit: 15 }),
        fetchConversations(),
        fetchSellerBoostPrompts(),
        fetchSellerProducts(),
      ]);

      const list: UnifiedNotificationItem[] = [];

      // 1. Live Orders (Reservations)
      if (ordersRes.status === "fulfilled") {
        for (const order of ordersRes.value.orders) {
          const itemSummary = order.items.map((i) => `${i.quantity ?? ""} ${i.scalingType ?? ""} of ${i.productName ?? "Produce"}`.trim()).join(", ") || "Reserved items";
          const shortCode = `RSV-${order.id.slice(0, 4).toUpperCase()}`;
          const expiresAt = order.expiresAt ? new Date(order.expiresAt) : null;
          const isExpiringSoon = order.status === "pending" && expiresAt && (expiresAt.getTime() - Date.now() < 3 * 3600 * 1000) && (expiresAt.getTime() > Date.now());
          const date = new Date(order.updatedAt || order.createdAt);

          if (order.status === "pending") {
            list.push({
              id: `order:${order.id}`, category: "reservations", kind: isExpiringSoon ? "reservation_expiring" : "new_reservation",
              title: isExpiringSoon ? "Reservation Expiring Soon" : "New Reservation",
              subtitle: `${shortCode} · ${itemSummary} · ${isExpiringSoon ? "Expires in 2 hrs" : "Expires in 6 hrs"}`,
              timestamp: formatRelativeTime(date), rawDate: date, read: !isExpiringSoon, urgent: Boolean(isExpiringSoon),
              iconType: isExpiringSoon ? "clock" : "package",
              primaryAction: { label: "View Reservation", onPress: () => router.push({ pathname: "/(app)/orders/[id]", params: { id: order.id } }), variant: isExpiringSoon ? "warning" : "primary" },
              secondaryAction: isExpiringSoon ? { label: "Scan QR", onPress: () => router.push("/(app)/orders/scan") } : { label: "Message Buyer", onPress: () => router.push("/(app)/(tabs)/messages") },
            });
          } else if (order.status === "completed") {
            list.push({
              id: `order:${order.id}`, category: "reservations", kind: "pickup_completed", title: "Pickup Completed",
              subtitle: `${shortCode} · ${itemSummary} · Pickup confirmed successfully`,
              timestamp: formatRelativeTime(date), rawDate: date, read: true, urgent: false, iconType: "celebration",
              primaryAction: { label: "View Details", onPress: () => router.push({ pathname: "/(app)/orders/[id]", params: { id: order.id } }) },
              secondaryAction: { label: "View Analytics", onPress: () => router.push("/(app)/analytics") },
            });
          } else if (order.status === "cancelled") {
            list.push({
              id: `order:${order.id}`, category: "reservations", kind: "reservation_cancelled", title: "Reservation Cancelled",
              subtitle: `${shortCode} · ${itemSummary} · Quantity returned to listing`,
              timestamp: formatRelativeTime(date), rawDate: date, read: true, urgent: false, iconType: "cross",
              primaryAction: { label: "View Details", onPress: () => router.push({ pathname: "/(app)/orders/[id]", params: { id: order.id } }) },
              secondaryAction: { label: "View Listing", onPress: () => router.push("/(app)/(tabs)/inventory") },
            });
          }
        }
      }

      // 2. Live Conversations (Buyer Messages)
      if (convosRes.status === "fulfilled") {
        for (const convo of convosRes.value) {
          if (convo.lastMessageBody) {
            const date = new Date(convo.lastMessageAt || convo.createdAt);
            list.push({
              id: `convo:${convo.id}`, category: "messages", kind: "buyer_message", title: "New Buyer Message",
              subtitle: `${convo.buyerName || "Buyer"}${convo.productName ? ` about ${convo.productName}` : ""} — '${convo.lastMessageBody}'`,
              timestamp: formatRelativeTime(date), rawDate: date, read: (convo.unreadCount || 0) === 0, urgent: false, iconType: "message",
              primaryAction: { label: "Reply", onPress: () => router.push({ pathname: "/(app)/conversations/[id]", params: { id: convo.id } }) },
              secondaryAction: { label: "View Product", onPress: () => router.push("/(app)/(tabs)/inventory") },
            });
          }
        }
      }

      // 3. Live Trust Notices
      for (const notice of sellerNotices.items) {
        const date = new Date(notice.createdAt);
        const isUrgent = notice.kind.includes("warning");
        list.push({
          id: `notice:${notice.id}`, category: notice.kind.includes("inquiry") ? "messages" : "trust", kind: notice.kind,
          title: isUrgent ? "Buyer Question Waiting" : "Seller Trust Update",
          subtitle: "Please check your pending customer inquiry or account compliance record.",
          timestamp: formatRelativeTime(date), rawDate: date, read: Boolean(notice.readAt), urgent: isUrgent, iconType: isUrgent ? "clock" : "shield",
          primaryAction: { label: notice.kind.includes("inquiry") ? "Reply" : "View Details", onPress: () => notice.orderId ? router.push({ pathname: "/(app)/orders/[id]", params: { id: notice.orderId } }) : router.push("/(app)/trust") },
        });
      }

      // 4. Live Promotions & Visibility Boosts
      for (const promo of sellerPromotions.items) {
        const date = new Date(promo.readyAt || promo.createdAt);
        list.push({
          id: `promo:${promo.id}`, category: "listings", kind: "promotion_ready", title: "Promotional Content Ready",
          subtitle: promo.headline || `Ready-to-share social caption for ${promo.productName}.`,
          timestamp: formatRelativeTime(date), rawDate: date, read: Boolean(promo.readAt), urgent: false, iconType: "megaphone",
          primaryAction: {
            label: "Share Product",
            onPress: async () => {
              try {
                const payload = await getSellerPromotionShare(promo.id);
                await Share.share({ message: `${payload.title}\n${payload.message}\n${payload.shareUrl}` });
              } catch {}
            },
          },
        });
      }

      if (boostsRes.status === "fulfilled") {
        for (const boost of boostsRes.value.items) {
          const date = new Date(boost.createdAt);
          list.push({
            id: `boost:${boost.id}`, category: "listings", kind: "boost_prompt", title: "Priority Visibility Boost",
            subtitle: `${boost.productName} is eligible for priority boost promotion.`,
            timestamp: formatRelativeTime(date), rawDate: date, read: Boolean(boost.readAt), urgent: false, iconType: "megaphone",
            primaryAction: { label: "Preview Post", onPress: () => router.push({ pathname: "/(app)/boost/[productId]", params: { productId: boost.productId, promptId: boost.id } }) },
          });
        }
      }

      // 5. Live Product Listings (Published Listings)
      if (prodsRes.status === "fulfilled") {
        for (const prod of prodsRes.value.slice(0, 3)) {
          if (prod.publishedAt) {
            const date = new Date(prod.publishedAt);
            list.push({
              id: `prod:${prod.id}`, category: "listings", kind: "listing_published", title: "Listing Published",
              subtitle: `Your ${prod.productName} listing is now live · ${prod.productQty} ${prod.scalingType} · ₱${Number(prod.productPrice).toFixed(2)}/${prod.scalingType}`,
              timestamp: formatRelativeTime(date), rawDate: date, read: true, urgent: false, iconType: "check",
              primaryAction: { label: "View Listing", onPress: () => router.push("/(app)/(tabs)/inventory") },
              secondaryAction: { label: "Share", onPress: () => void Share.share({ message: `Check out our fresh ${prod.productName} on Agrivive!` }) },
            });
          }
        }
      }

      // Sort newest first
      list.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());
      setItems(list);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router, sellerNotices.items, sellerPromotions.items]);

  useEffect(() => { void loadData(); }, [loadData]);

  const refresh = () => {
    setRefreshing(true);
    void sellerNotices.refresh();
    void sellerPromotions.refresh();
    void loadData();
  };

  const markAllRead = async () => {
    try {
      await Promise.allSettled([sellerNotices.markAllRead(), sellerPromotions.markAllRead()]);
      setItems((prev) => prev.map((item) => ({ ...item, read: true })));
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

  return { items, counts, unreadCount, urgentCount, loading, refreshing, refresh, markAllRead };
}
