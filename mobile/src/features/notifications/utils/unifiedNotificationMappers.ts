import { type useRouter } from "expo-router";
import { markSellerBoostPromptRead } from "../../marketing/api/visibility-boosts";
import type { SellerBoostPrompt, SellerNotification, UnifiedNotificationItem } from "../types";
import type { Conversation } from "../../conversations/types";
import { mapSellerNotice } from "./sellerNoticeMapper";

type RouterInstance = ReturnType<typeof useRouter>;

function parseDate(raw?: string | null): Date {
  if (!raw) return new Date();
  const d = new Date(raw);
  return isNaN(d.getTime()) ? new Date() : d;
}

export function formatRelativeTime(date: Date): string {
  if (!date || isNaN(date.getTime())) return "Recently";
  const diffMin = Math.floor((Date.now() - date.getTime()) / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHours = Math.floor(diffMin / 60);
  return diffHours < 24
    ? `${diffHours} hr${diffHours > 1 ? "s" : ""} ago`
    : Math.floor(diffHours / 24) === 1
    ? "Yesterday"
    : date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function mapUnifiedNotificationItems(input: {
  conversations: Conversation[];
  notices: SellerNotification[];
  boosts: SellerBoostPrompt[];
  router: RouterInstance;
  markedReadIds: Set<string>;
}): UnifiedNotificationItem[] {
  const { conversations, notices, boosts, router, markedReadIds } = input;
  const list: UnifiedNotificationItem[] = [];

  // Conversations
  for (const convo of conversations || []) {
    if (convo && convo.id && convo.lastMessageBody) {
      const date = parseDate(convo.lastMessageAt || convo.createdAt);
      list.push({
        id: `convo:${convo.id}`, category: "messages", kind: "buyer_message", title: "New Buyer Message",
        subtitle: `${convo.buyerName || "Buyer"}${convo.productName ? ` about ${convo.productName}` : ""} — '${convo.lastMessageBody}'`,
        timestamp: formatRelativeTime(date), rawDate: date, read: (convo.unreadCount || 0) === 0, urgent: false, iconType: "message",
        primaryAction: { label: "Reply", onPress: () => router.push({ pathname: "/(app)/conversations/[id]", params: { id: convo.id } }) },
        secondaryAction: { label: "View Product", onPress: () => router.push("/(app)/(tabs)/inventory") },
      });
    }
  }

  // Stored seller notifications (reservations, stock, Boost, account)
  for (const notice of notices || []) {
    if (notice && notice.id) {
      list.push(mapSellerNotice({
        notice, router, markedReadIds, timestamp: formatRelativeTime(parseDate(notice.createdAt)),
      }));
    }
  }

  // Boosts
  for (const boost of boosts || []) {
    if (boost && boost.id) {
      const date = parseDate(boost.createdAt);
      const isRead = Boolean(boost.readAt) || markedReadIds.has(`boost:${boost.id}`);
      list.push({
        id: `boost:${boost.id}`, category: "listings", kind: "boost_prompt", title: "Boost Again?",
        subtitle: boost.priceBefore && boost.priceAfter
          ? `${boost.productName} went from ₱${Number(boost.priceBefore).toFixed(2)} to ₱${Number(boost.priceAfter).toFixed(2)}. Post the new price.`
          : `${boost.productName} has a new price. Post it on the Agrivive Facebook Page.`,
        timestamp: formatRelativeTime(date), rawDate: date, read: isRead, urgent: false, iconType: "megaphone",
        primaryAction: {
          label: "Boost Again",
          onPress: () => {
            markedReadIds.add(`boost:${boost.id}`);
            void markSellerBoostPromptRead(boost.id);
            router.push({ pathname: "/(app)/marketing/[productId]", params: { productId: boost.productId, promptId: boost.id } });
          },
        },
      });
    }
  }

  return list;
}
