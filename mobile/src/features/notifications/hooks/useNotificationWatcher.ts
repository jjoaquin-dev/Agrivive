import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import { useAuth } from "../../../context/AuthContext";
import { fetchSellerOrders } from "../../orders/api/seller-orders";
import { fetchConversations } from "../../conversations/api";
import { fetchSellerBoostPrompts } from "../../boost/api/visibility-boosts";
import { getNotificationsModule } from "../utils/notificationsModule";

export function useNotificationWatcher() {
  const { session } = useAuth();
  const knownOrderIds = useRef<Set<string>>(new Set());
  const knownConvoMsgIds = useRef<Map<string, string>>(new Map());
  const knownBoostIds = useRef<Set<string>>(new Set());
  const isInitialized = useRef(false);

  useEffect(() => {
    const currentUserId = session?.user?.id;
    if (Platform.OS === "web" || !currentUserId) return;

    let active = true;

    async function pollAndNotify() {
      if (!active) return;
      try {
        const Notifications = await getNotificationsModule();

        const [ordersRes, convosRes, boostsRes] = await Promise.allSettled([
          fetchSellerOrders({ limit: 5 }),
          fetchConversations(),
          fetchSellerBoostPrompts({ limit: 5 }),
        ]);

        if (!active) return;

        // 1. Check Orders
        if (ordersRes.status === "fulfilled") {
          for (const order of ordersRes.value.orders) {
            if (isInitialized.current && !knownOrderIds.current.has(order.id) && order.status === "pending") {
              const summary = order.items.map((i) => `${i.quantity} ${i.scalingType} ${i.productName}`).join(", ") || "Vegetables";
              if (Notifications) {
                await Notifications.scheduleNotificationAsync({
                  content: {
                    title: "🔔 New Reservation Received!",
                    body: `RSV-${order.id.slice(0, 4).toUpperCase()} · ${summary}`,
                    data: { path: `/(app)/orders/${order.id}` },
                    sound: true,
                  },
                  trigger: null,
                });
              }
            }
            knownOrderIds.current.add(order.id);
          }
        }

        // 2. Check Conversations
        if (convosRes.status === "fulfilled") {
          const list = Array.isArray(convosRes.value) ? convosRes.value : (convosRes.value as any)?.items || [];
          for (const convo of list) {
            if (convo.lastMessageBody) {
              const prev = knownConvoMsgIds.current.get(convo.id);
              const isFromBuyer = convo.lastMessageSenderId
                ? convo.lastMessageSenderId !== currentUserId
                : true;
              const isNewMessage = isInitialized.current && (prev === undefined || prev !== convo.lastMessageBody);

              if (isNewMessage && isFromBuyer && convo.lastMessageSenderId !== currentUserId && (convo.unreadCount || 0) > 0) {
                if (Notifications) {
                  await Notifications.scheduleNotificationAsync({
                    content: {
                      title: `💬 New message from ${convo.buyerName || "Buyer"}`,
                      body: convo.lastMessageBody,
                      data: { path: `/(app)/conversations/${convo.id}` },
                      sound: true,
                    },
                    trigger: null,
                  });
                }
              }
              knownConvoMsgIds.current.set(convo.id, convo.lastMessageBody);
            }
          }
        }

        // 3. Check Boost Prompts
        if (boostsRes.status === "fulfilled") {
          for (const prompt of boostsRes.value.items) {
            if (isInitialized.current && !knownBoostIds.current.has(prompt.id) && !prompt.readAt) {
              if (Notifications) {
                await Notifications.scheduleNotificationAsync({
                  content: {
                    title: "🚀 Listing Visibility Boost Ready",
                    body: `${prompt.productName} price was reduced. Tap to boost its visibility!`,
                    data: { path: "/(app)/notifications" },
                    sound: true,
                  },
                  trigger: null,
                });
              }
            }
            knownBoostIds.current.add(prompt.id);
          }
        }

        isInitialized.current = true;
      } catch {
        // Silently continue polling
      }
    }

    void pollAndNotify();
    const interval = setInterval(() => { void pollAndNotify(); }, 15_000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [session?.user?.id]);
}
