import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ArrowLeft, BellRing, CheckCheck, MoreHorizontal } from "lucide-react-native";
import { useRouter } from "expo-router";
import { colors, radii, spacing, touchTargets, typography } from "../../../theme";
import { safeBack } from "../../../utils/safeBack";

interface Props {
  unreadCount: number;
  onMarkAllRead: () => void;
  onOpenMenu?: () => void;
  onOpenSettings?: () => void;
}

export function NotificationHeaderBar({ unreadCount, onMarkAllRead, onOpenMenu, onOpenSettings }: Props) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => safeBack(router)}
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
          onPress={onOpenSettings}
          accessibilityRole="button"
          accessibilityLabel="Phone alert settings"
          style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
        >
          <BellRing size={20} color={colors.text} />
          {unreadCount > 0 && <View style={styles.bellDot} />}
        </Pressable>

        <Pressable
          onPress={onMarkAllRead}
          accessibilityRole="button"
          accessibilityLabel="Mark all notifications as read"
          style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
        >
          <CheckCheck size={20} color={colors.text} />
        </Pressable>

        <Pressable
          onPress={onOpenMenu}
          accessibilityRole="button"
          accessibilityLabel="More options"
          style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
        >
          <MoreHorizontal size={20} color={colors.text} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: 56, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: spacing.base, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border, },
  iconButton: { width: touchTargets.min - 4, height: touchTargets.min - 4, borderRadius: radii.full, backgroundColor: colors.transparent, alignItems: "center", justifyContent: "center", },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  title: { ...typography.sectionHeading, fontSize: 18, color: colors.text, },
  unreadBadge: { backgroundColor: colors.terracotta, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radii.full, },
  unreadBadgeText: { ...typography.caption, color: colors.white, },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  actionButton: { width: touchTargets.min - 4, height: touchTargets.min - 4, borderRadius: radii.full, backgroundColor: colors.transparent, alignItems: "center", justifyContent: "center", },
  pressed: { opacity: 0.7 },
  bellDot: { position: "absolute", top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.terracotta, },
});
