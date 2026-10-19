import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { Bell, BellDot, MessageCircle, MessageCircleMore, Store } from "lucide-react-native";
import { colors, fonts, radii, spacing, touchTargets } from "../../../theme";

interface DashboardHeaderProps {
  sellerName: string;
  shopName?: string | null;
  unreadCount: number;
  openMessageCount: number;
  onPressMessages: () => void;
  onPressNotifications: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  sellerName,
  shopName,
  unreadCount,
  openMessageCount,
  onPressMessages,
  onPressNotifications,
}) => {
  const hasMessages = openMessageCount > 0;
  const hasNotifs = unreadCount > 0;

  return (
    <View style={styles.header}>
      <View style={styles.topRow}>
        <View style={styles.textColumn}>
          <Text style={styles.greeting}>Maayong adlaw,</Text>
          <Text style={styles.sellerName} numberOfLines={1}>{sellerName}</Text>
          {shopName ? (
            <View style={styles.shopBadge}>
              <Store size={14} color={colors.primary} style={styles.shopIcon} />
              <Text style={styles.shopText} numberOfLines={1}>{shopName}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.actions}>
          <Pressable
            onPress={onPressMessages}
            accessibilityRole="button"
            accessibilityLabel={hasMessages ? `${openMessageCount} unread buyer messages` : "Buyer messages"}
            style={[styles.iconButton, hasMessages && styles.iconButtonActive]}
          >
            {hasMessages ? (
              <MessageCircleMore size={22} color={colors.terracotta} />
            ) : (
              <MessageCircle size={22} color={colors.primary} />
            )}
            {hasMessages ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {openMessageCount > 9 ? "9+" : openMessageCount}
                </Text>
              </View>
            ) : null}
          </Pressable>

          <Pressable
            onPress={onPressNotifications}
            accessibilityRole="button"
            accessibilityLabel={hasNotifs ? `${unreadCount} unread notifications` : "Notifications"}
            style={[styles.iconButton, hasNotifs && styles.iconButtonActive]}
          >
            {hasNotifs ? (
              <BellDot size={22} color={colors.terracotta} />
            ) : (
              <Bell size={22} color={colors.primary} />
            )}
            {hasNotifs ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Text>
              </View>
            ) : null}
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.base,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  textColumn: {
    flex: 1,
    marginRight: spacing.sm,
  },
  greeting: {
    fontFamily: fonts.body.regular,
    fontSize: 14,
    color: colors.textMuted,
  },
  sellerName: {
    fontFamily: fonts.heading.bold,
    fontSize: 24,
    color: colors.text,
    marginTop: 2,
  },
  shopBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(31, 77, 58, 0.08)",
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radii.full,
    marginTop: spacing.xs,
  },
  shopIcon: {
    marginRight: 4,
  },
  shopText: {
    fontFamily: fonts.body.medium,
    fontSize: 12,
    color: colors.primary,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  iconButton: {
    width: touchTargets.min,
    height: touchTargets.min,
    borderRadius: radii.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  iconButtonActive: {
    borderColor: colors.terracotta,
    backgroundColor: "rgba(201, 120, 80, 0.08)",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 4,
    borderRadius: 10,
    backgroundColor: colors.error,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.background,
  },
  badgeText: {
    fontFamily: fonts.body.semiBold,
    fontSize: 10,
    color: colors.white,
  },
});
