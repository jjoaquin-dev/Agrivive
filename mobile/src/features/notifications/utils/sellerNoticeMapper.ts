import type { useRouter } from "expo-router";
import { markSellerNotificationRead } from "../api/seller-notifications";
import type { SellerNotification, UnifiedNotificationItem } from "../types";

type RouterInstance = ReturnType<typeof useRouter>;
type IconType = UnifiedNotificationItem["iconType"];

const icons: Record<string, IconType> = {
  new_reservation: "package",
  reservation_ending: "clock",
  reservation_ended: "cross",
  buyer_cancelled: "cross",
  pickup_done: "celebration",
  listing_live: "check",
  running_low: "thermometer",
  sold_out: "cross",
  price_lowered: "megaphone",
  final_price_reached: "check",
  price_drop_setup: "megaphone",
  boost_started: "megaphone",
  boost_posted: "celebration",
  boost_failed: "cross",
  inquiry_12h_reminder: "clock",
  inquiry_24h_warning: "clock",
};

const urgentKinds = new Set([
  "reservation_ending",
  "boost_failed",
  "inquiry_12h_reminder",
  "inquiry_24h_warning",
  "seller_cancellation_warning",
  "trust_action_warning",
  "trust_action_restriction",
  "trust_action_blocked",
]);

function actionFor(notice: SellerNotification, router: RouterInstance) {
  if (notice.orderId && notice.category !== "trust") {
    const orderId = notice.orderId;
    return {
      label: notice.category === "messages" ? "Reply" : "View Reservation",
      onPress: () => router.push({ pathname: "/(app)/orders/[id]", params: { id: orderId } }),
    };
  }
  if (notice.productId && notice.kind === "price_drop_setup") {
    const productId = notice.productId;
    return { label: "Set Price Drop", onPress: () => router.push(`/(app)/marketing/${productId}`) };
  }
  if (notice.productId) {
    return { label: "View Listing", onPress: () => router.push("/(app)/(tabs)/inventory") };
  }
  if (notice.category === "trust") {
    return { label: "View Details", onPress: () => router.push("/(app)/trust") };
  }
  return { label: "View Details", onPress: () => router.push("/(app)/(tabs)/inventory") };
}

/** Turns a stored seller notification into a card, using the server's title and body. */
export function mapSellerNotice(input: {
  notice: SellerNotification;
  router: RouterInstance;
  markedReadIds: Set<string>;
  timestamp: string;
}): UnifiedNotificationItem {
  const { notice, router, markedReadIds, timestamp } = input;
  const id = `notice:${notice.id}`;
  const date = new Date(notice.createdAt);
  const primary = actionFor(notice, router);
  const urgent = urgentKinds.has(notice.kind);
  return {
    id,
    category: notice.category,
    kind: notice.kind,
    title: notice.title,
    subtitle: notice.body,
    timestamp,
    rawDate: isNaN(date.getTime()) ? new Date() : date,
    read: Boolean(notice.readAt) || markedReadIds.has(id),
    urgent,
    iconType: icons[notice.kind] ?? (notice.category === "trust" ? "shield" : "check"),
    primaryAction: {
      label: primary.label,
      variant: urgent ? "warning" : "primary",
      onPress: () => {
        markedReadIds.add(id);
        void markSellerNotificationRead(notice.id).catch(() => {});
        primary.onPress();
      },
    },
    secondaryAction: notice.kind === "reservation_ending"
      ? { label: "Scan QR", onPress: () => router.push("/(app)/orders/scan") }
      : undefined,
  };
}
