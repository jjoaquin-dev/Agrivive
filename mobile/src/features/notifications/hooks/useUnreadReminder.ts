import { useEffect, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";
import { fetchSellerNotifications } from "../api/seller-notifications";
import { fetchConversations } from "../../conversations/api";
import { getNotificationsModule } from "../utils/notificationsModule";

const REMINDER_INTERVAL_MS = 60_000; // 60 seconds

export function useUnreadReminder() {
  const { session } = useAuth();
  const lastReminderTime = useRef<number>(0);

  useEffect(() => {
    if (!session?.user?.id) return;

    let active = true;

    async function checkUnreadAndRemind() {
      if (!active) return;

      try {
        const [notifRes, convosRes] = await Promise.all([
          fetchSellerNotifications({ unreadOnly: true, limit: 1 }).catch(() => null),
          fetchConversations().catch(() => ({ items: [], nextCursor: null })),
        ]);

        if (!active) return;

        const unreadNotifs = notifRes?.unreadCount ?? 0;
        const convoList = Array.isArray(convosRes) ? convosRes : (convosRes?.items || []);
        const unreadConvos = convoList.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
        const totalUnread = unreadNotifs + unreadConvos;

        if (totalUnread > 0) {
          const now = Date.now();
          // Ensure at least 60 seconds between reminder triggers
          if (now - lastReminderTime.current >= REMINDER_INTERVAL_MS - 5000) {
            lastReminderTime.current = now;

            const Notifications = await getNotificationsModule();
            if (Notifications) {
              await Notifications.scheduleNotificationAsync({
                content: {
                  title: "Agrivive Reminder",
                  body: `You have ${totalUnread} unread update${totalUnread === 1 ? "" : "s"}. Tap to check your notifications.`,
                  data: { path: "/(app)/notifications" },
                  sound: true,
                },
                trigger: null,
              });
            }
          }
        }
      } catch (err) {
        // Silently swallow reminder check error so background tasks don't crash
      }
    }

    // Set 60-second periodic reminder timer
    const timer = setInterval(() => {
      void checkUnreadAndRemind();
    }, REMINDER_INTERVAL_MS);

    // Initial check after 30 seconds
    const initialTimer = setTimeout(() => {
      void checkUnreadAndRemind();
    }, 30_000);

    return () => {
      active = false;
      clearInterval(timer);
      clearTimeout(initialTimer);
    };
  }, [session?.user?.id]);
}
