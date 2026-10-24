import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ArrowLeft, CheckCheck, MoreHorizontal } from "lucide-react-native";
import { useRouter } from "expo-router";
import { colors, fonts, radii, spacing } from "../../../theme";

interface Props {
  unreadCount: number;
  onMarkAllRead: () => void;
  onOpenMenu?: () => void;
}

export function NotificationHeaderBar({ unreadCount, onMarkAllRead, onOpenMenu }: Props) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
      >
        <ArrowLeft size={20} color={colors.text} />
      </Pressable>

      <View style={styles.titleRow}>
        <Text style={styles.title}>Notifications</Text>
        {unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>{unreadCount} unread</Text>
          </View>
        )}
      </View>

      <View style={styles.rightActions}>
        <Pressable
          onPress={onMarkAllRead}
          accessibilityRole="button"
          accessibilityLabel="Mark all notifications as read"
          style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
        >
          <CheckCheck size={18} color={colors.textMuted} />
        </Pressable>

        <Pressable
          onPress={onOpenMenu}
          accessibilityRole="button"
          accessibilityLabel="More options"
          style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
        >
          <MoreHorizontal size={18} color={colors.textMuted} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.base,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  title: {
    fontFamily: fonts.heading.bold,
    fontSize: 18,
    color: colors.text,
  },
  unreadBadge: {
    backgroundColor: "#EA580C",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  unreadBadgeText: {
    fontFamily: fonts.body.semiBold,
    fontSize: 11,
    color: colors.white,
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.7,
  },
});
