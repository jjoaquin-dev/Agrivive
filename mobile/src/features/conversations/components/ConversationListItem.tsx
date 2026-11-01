import React, { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import type { Conversation } from "../types";
import { formatRelativeTime, getAvatarColor, getInitials } from "../utils/avatar";

interface ConversationListItemProps {
  conversation: Conversation;
  onPress: () => void;
}

function parseLastMessage(body: string | null, isMine: boolean): string {
  if (!body) return "No messages yet";
  const match = body.match(/(https?:\/\/[^\s]+?\.(?:png|jpg|jpeg|webp|gif)(?:\?[^\s]*)?)/i);
  const isOnlyPhoto = match && body.replace(match[1], "").trim() === "";
  const preview = isOnlyPhoto ? "📷 Photo" : body;
  return isMine ? `You: ${preview}` : preview;
}

function getWaitingInfo(lastMessageAt: string) {
  const diffMs = Math.max(0, Date.now() - new Date(lastMessageAt).getTime());
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  const label = diffHours < 1 ? `Waiting ${Math.max(1, diffMins)} min` : `Waiting ${diffHours} hrs`;
  let color: string = colors.textMuted;
  let bg: string = colors.surfaceMuted;

  if (diffHours >= 24) {
    color = colors.error;
    bg = "#FEE2E2";
  } else if (diffHours >= 12) {
    color = colors.warning;
    bg = "#FEF3C7";
  }

  return { label, color, bg };
}

export function ConversationListItem({ conversation, onPress }: ConversationListItemProps) {
  const [imgError, setImgError] = useState(false);
  const buyerName = conversation.buyerName || "Buyer";
  const initials = getInitials(buyerName);
  const avatarBg = getAvatarColor(buyerName);
  const hasUnread = conversation.unreadCount > 0;
  const isClosed = conversation.status === "closed";
  const isBuyerLast = conversation.lastMessageSenderId === conversation.buyerId;
  const isSellerLast = conversation.lastMessageSenderId === conversation.sellerId;
  const waitingInfo = isBuyerLast && !isClosed ? getWaitingInfo(conversation.lastMessageAt) : null;

  const tagLabel =
    conversation.productName || (conversation.contextType === "order" ? "Reservation" : "Chat");

  const snippet = parseLastMessage(conversation.lastMessageBody, isSellerLast);

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
          <View style={styles.tagWrap}>
            {conversation.productImageUrl ? (
              <Image source={{ uri: conversation.productImageUrl }} style={styles.productThumb} />
            ) : null}
            <Text style={styles.tagText} numberOfLines={1}>
              {tagLabel}
            </Text>
          </View>

          <View style={styles.badgesRight}>
            {isClosed ? (
              <View style={styles.closedTag}>
                <Text style={styles.closedTagText}>Closed</Text>
              </View>
            ) : waitingInfo ? (
              <View style={[styles.waitingPill, { backgroundColor: waitingInfo.bg }]}>
                <Text style={[styles.waitingPillText, { color: waitingInfo.color }]}>
                  {waitingInfo.label}
                </Text>
              </View>
            ) : null}

            {hasUnread && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>
                  {conversation.unreadCount > 99 ? "99+" : conversation.unreadCount}
                </Text>
              </View>
            )}
          </View>
        </View>

        <Text style={[styles.snippetText, hasUnread && styles.snippetTextUnread]} numberOfLines={1}>
          {snippet}
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
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pressed: { backgroundColor: colors.surfaceMuted },
  avatarBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
    overflow: "hidden",
  },
  avatarImage: { width: 48, height: 48, borderRadius: 24 },
  initialsText: { fontFamily: fonts.heading.bold, fontSize: 16, color: colors.white },
  content: { flex: 1 },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  nameText: { fontFamily: fonts.heading.bold, fontSize: 16, color: colors.text, flex: 1, marginRight: spacing.sm },
  timeText: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted },
  timeTextUnread: { color: colors.primary, fontFamily: fonts.body.semiBold },
  middleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  tagWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.full,
    maxWidth: "65%",
  },
  productThumb: { width: 20, height: 20, borderRadius: 4, marginRight: 4 },
  tagText: { fontFamily: fonts.body.medium, fontSize: 11, color: colors.primaryPressed },
  badgesRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  closedTag: { backgroundColor: colors.border, paddingHorizontal: 8, paddingVertical: 2, borderRadius: radii.full },
  closedTagText: { fontFamily: fonts.body.medium, fontSize: 11, color: colors.textMuted },
  waitingPill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: radii.full },
  waitingPillText: { fontFamily: fonts.body.semiBold, fontSize: 11 },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  unreadBadgeText: { fontFamily: fonts.heading.bold, fontSize: 11, color: colors.white },
  snippetText: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted, marginTop: 4 },
  snippetTextUnread: { fontFamily: fonts.body.medium, color: colors.text },
});
