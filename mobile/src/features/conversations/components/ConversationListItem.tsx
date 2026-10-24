import React, { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { fonts, radii, spacing } from "../../../theme";
import type { Conversation } from "../types";
import { formatRelativeTime, getAvatarColor, getInitials } from "../utils/avatar";

interface ConversationListItemProps {
  conversation: Conversation;
  onPress: () => void;
}

export function ConversationListItem({ conversation, onPress }: ConversationListItemProps) {
  const [imgError, setImgError] = useState(false);
  const isOrder = conversation.contextType === "order";
  const isSystem = conversation.buyerName?.toLowerCase().includes("system");
  const buyerName = conversation.buyerName || (isSystem ? "Agrivive System" : "Buyer");
  const initials = getInitials(buyerName);
  const avatarBg = getAvatarColor(buyerName);
  const hasUnread = conversation.unreadCount > 0;
  const tagLabel = conversation.productName || (isOrder ? "Reservation Order" : "Listing Inquiry");

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${buyerName}, ${tagLabel}${hasUnread ? `, ${conversation.unreadCount} unread` : ""}`}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <View style={[styles.avatarBox, { backgroundColor: avatarBg }]}>
        {conversation.buyerImage && !imgError ? (
          <Image
            source={{ uri: conversation.buyerImage }}
            style={styles.avatarImage}
            onError={() => setImgError(true)}
          />
        ) : (
          <Text style={styles.initialsText}>{initials}</Text>
        )}
        <View style={styles.onlineDot} />
      </View>

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.nameText} numberOfLines={1}>
            {buyerName}
          </Text>
          <Text style={[styles.timeText, hasUnread && styles.timeTextUnread]}>
            {formatRelativeTime(conversation.lastMessageAt)}
          </Text>
        </View>

        <View style={styles.middleRow}>
          {isSystem ? (
            <View style={styles.systemTag}>
              <Text style={styles.systemTagText}>⚠️ System</Text>
            </View>
          ) : (
            <View style={styles.produceTag}>
              <Text style={styles.produceTagText} numberOfLines={1}>
                {tagLabel}
              </Text>
            </View>
          )}

          {hasUnread && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>
                {conversation.unreadCount > 99 ? "99+" : conversation.unreadCount}
              </Text>
            </View>
          )}
        </View>

        <Text style={[styles.snippetText, hasUnread && styles.snippetTextUnread]} numberOfLines={1}>
          {conversation.lastMessageBody || "No messages yet"}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  pressed: { backgroundColor: "#F9FAFB" },
  avatarBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginRight: spacing.md,
  },
  avatarImage: { width: 48, height: 48, borderRadius: 24 },
  initialsText: { fontFamily: fonts.heading.bold, fontSize: 16, color: "#FFFFFF" },
  onlineDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#22C55E",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  content: { flex: 1 },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  nameText: { fontFamily: fonts.heading.bold, fontSize: 16, color: "#111827", flex: 1, marginRight: spacing.sm },
  timeText: { fontFamily: fonts.body.regular, fontSize: 12, color: "#6B7280" },
  timeTextUnread: { color: "#16A34A", fontFamily: fonts.body.semiBold },
  middleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 4 },
  produceTag: { backgroundColor: "#DCFCE7", paddingHorizontal: 8, paddingVertical: 2, borderRadius: radii.full, alignSelf: "flex-start", maxWidth: "80%" },
  produceTagText: { fontFamily: fonts.body.medium, fontSize: 11, color: "#166534" },
  systemTag: { backgroundColor: "#FEF3C7", paddingHorizontal: 8, paddingVertical: 2, borderRadius: radii.full },
  systemTagText: { fontFamily: fonts.body.medium, fontSize: 11, color: "#92400E" },
  unreadBadge: { minWidth: 20, height: 20, borderRadius: 10, backgroundColor: "#16A34A", alignItems: "center", justifyContent: "center", paddingHorizontal: 6 },
  unreadBadgeText: { fontFamily: fonts.heading.bold, fontSize: 11, color: "#FFFFFF" },
  snippetText: { fontFamily: fonts.body.regular, fontSize: 13, color: "#6B7280", marginTop: 4 },
  snippetTextUnread: { fontFamily: fonts.body.medium, color: "#111827" },
});
