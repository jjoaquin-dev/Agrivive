import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Package, User } from "lucide-react-native";
import { colors, fonts, radii, spacing, touchTargets } from "../../../theme";
import type { Conversation } from "../types";

interface ConversationListItemProps {
  conversation: Conversation;
  onPress: () => void;
}

function formatConversationTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }
  if (diffDays === 1) {
    return "Yesterday";
  }
  if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: "short" });
  }
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

export function ConversationListItem({ conversation, onPress }: ConversationListItemProps) {
  const isProduct = conversation.contextType === "product";
  const title = isProduct
    ? conversation.productName || "Product Listing"
    : conversation.sellerShopName || conversation.sellerName || "Order Conversation";
  const contextLabel = isProduct
    ? "Listing Inquiry"
    : conversation.contextType === "seller"
    ? "Direct Inquiry"
    : "Reservation Order";
  const hasUnread = conversation.unreadCount > 0;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${contextLabel}${hasUnread ? `, ${conversation.unreadCount} unread` : ""}`}
      style={({ pressed }) => [styles.container, pressed && styles.pressed, hasUnread && styles.unreadContainer]}
    >
      <View style={styles.avatarBox}>
        {isProduct ? (
          <Package size={22} color={colors.primary} />
        ) : (
          <User size={22} color={colors.primary} />
        )}
        {hasUnread && <View style={styles.onlineDot} />}
      </View>

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={[styles.title, hasUnread && styles.unreadTitle]} numberOfLines={1}>
            {title}
          </Text>
          <Text style={[styles.time, hasUnread && styles.unreadTime]}>
            {formatConversationTime(conversation.lastMessageAt)}
          </Text>
        </View>

        <View style={styles.contextRow}>
          <Text style={styles.contextBadge}>{contextLabel}</Text>
        </View>

        <View style={styles.bottomRow}>
          <Text style={[styles.snippet, hasUnread && styles.unreadSnippet]} numberOfLines={1}>
            {conversation.lastMessageBody || "Tap to chat with buyer"}
          </Text>
          {hasUnread && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {conversation.unreadCount > 99 ? "99+" : conversation.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
    minHeight: touchTargets.min,
  },
  unreadContainer: {
    backgroundColor: "rgba(31, 77, 58, 0.03)",
    borderColor: colors.primary,
  },
  pressed: {
    opacity: 0.75,
  },
  avatarBox: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(31, 77, 58, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginRight: spacing.md,
  },
  onlineDot: {
    position: "absolute",
    bottom: 1,
    right: 1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  content: {
    flex: 1,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    flex: 1,
    fontFamily: fonts.body.semiBold,
    fontSize: 15,
    color: colors.text,
    marginRight: spacing.sm,
  },
  unreadTitle: {
    fontFamily: fonts.heading.bold,
    color: colors.text,
  },
  time: {
    fontFamily: fonts.body.regular,
    fontSize: 11,
    color: colors.textMuted,
  },
  unreadTime: {
    color: colors.primary,
    fontFamily: fonts.body.semiBold,
  },
  contextRow: {
    marginTop: 2,
  },
  contextBadge: {
    fontFamily: fonts.body.medium,
    fontSize: 11,
    color: colors.textMuted,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 3,
  },
  snippet: {
    flex: 1,
    fontFamily: fonts.body.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginRight: spacing.sm,
  },
  unreadSnippet: {
    fontFamily: fonts.body.medium,
    color: colors.text,
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  badgeText: {
    fontFamily: fonts.body.semiBold,
    fontSize: 11,
    color: colors.white,
  },
});
