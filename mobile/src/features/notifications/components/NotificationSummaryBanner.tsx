import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fonts, radii, spacing } from "../../../theme";

interface Props {
  unreadCount: number;
  urgentCount: number;
  onMarkAllRead: () => void;
}

export function NotificationSummaryBanner({ unreadCount, urgentCount, onMarkAllRead }: Props) {
  return (
    <View style={styles.banner}>
      <View style={styles.copyContainer}>
        <Text style={styles.heading}>
          {unreadCount > 0 ? `${unreadCount} Unread` : "All Caught Up"}
        </Text>
        <Text style={styles.subheading}>
          {urgentCount > 0
            ? `${urgentCount} require immediate attention`
            : "No urgent actions required"}
        </Text>
      </View>

      {unreadCount > 0 && (
        <Pressable
          onPress={onMarkAllRead}
          accessibilityRole="button"
          accessibilityLabel="Mark all as read"
          style={({ pressed }) => [styles.markButton, pressed && styles.pressed]}
        >
          <Text style={styles.markText}>Mark All Read</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: "#065F46",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: spacing.sm,
  },
  copyContainer: {
    flex: 1,
    marginRight: spacing.sm,
  },
  heading: {
    fontFamily: fonts.heading.bold,
    fontSize: 20,
    color: colors.white,
    letterSpacing: -0.3,
  },
  subheading: {
    fontFamily: fonts.body.regular,
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.85)",
    marginTop: 2,
  },
  markButton: {
    backgroundColor: "#16A34A",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radii.full,
    minHeight: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  markText: {
    fontFamily: fonts.body.semiBold,
    fontSize: 12,
    color: colors.white,
  },
  pressed: {
    opacity: 0.85,
  },
});
