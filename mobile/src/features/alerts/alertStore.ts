import { useEffect, useSyncExternalStore } from "react";
import { fetchSellerNotifications } from "../notifications/api/seller-notifications";
import { fetchConversationUnreadCount } from "../conversations/api";
import { fetchSellerOrders } from "../orders/api/seller-orders";
import { useRefreshOnSignal } from "../../hooks/useRefreshOnSignal";

export type AlertCounts = { notifications: number; orders: number; messages: number };

let counts: AlertCounts = { notifications: 0, orders: 0, messages: 0 };
const listeners = new Set<() => void>();

function set(next: Partial<AlertCounts>) {
  counts = { ...counts, ...next };
  listeners.forEach((l) => l());
}

/** Reloads every badge number. Each call is separate so one failure keeps the other numbers. */
export async function refreshAlerts() {
  await Promise.allSettled([
    fetchSellerNotifications({ limit: 1 }).then((r) => set({ notifications: r.unreadCount })),
    fetchConversationUnreadCount().then((r) => set({ messages: r.unreadMessages ?? 0 })),
    fetchSellerOrders({ status: "pending", limit: 50 }).then((r) => set({ orders: r.orders.length })),
  ]);
}

export function clearAlerts() {
  set({ notifications: 0, orders: 0, messages: 0 });
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => { listeners.delete(l); };
}

/** Badge numbers shared by the tab bar and every screen header (Visibility of System Status, Nielsen). */
export function useAlertCounts(): AlertCounts {
  return useSyncExternalStore(subscribe, () => counts);
}

/** Mount once in the signed-in layout: refreshes on open, on foreground and when a push arrives. */
export function useAlertRefresh() {
  useEffect(() => { void refreshAlerts(); }, []);
  useRefreshOnSignal(refreshAlerts, { pushTypes: ["seller_message", "seller_alert"] });
}
