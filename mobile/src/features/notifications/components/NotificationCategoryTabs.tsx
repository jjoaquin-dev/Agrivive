import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import type { NotificationCategory } from "../types";

interface Props {
  selected: NotificationCategory;
  onSelect: (category: NotificationCategory) => void;
  counts: Record<NotificationCategory, number>;
}

const TABS: { id: NotificationCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "reservations", label: "Reservations" },
  { id: "messages", label: "Messages" },
  { id: "listings", label: "Listings" },
  { id: "trust", label: "Trust" },
];

export function NotificationCategoryTabs({ selected, onSelect, counts }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {TABS.map((tab) => {
        const isSelected = selected === tab.id;
        const count = counts[tab.id] ?? 0;
        return (
          <Pressable
            key={tab.id}
            onPress={() => onSelect(tab.id)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            style={[styles.pill, isSelected ? styles.pillActive : styles.pillInactive]}
          >
            <Text style={[styles.pillText, isSelected ? styles.pillTextActive : styles.pillTextInactive]}>
              {tab.label}
            </Text>
            {count > 0 && (
              <View style={[styles.countBadge, isSelected ? styles.badgeActive : styles.badgeInactive]}>
                <Text style={[styles.countText, isSelected ? styles.countTextActive : styles.countTextInactive]}>
                  {count}
                </Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: spacing.xs,
  },
  pill: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: radii.full,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
  },
  pillActive: {
    backgroundColor: "#16A34A",
    borderColor: "#16A34A",
  },
  pillInactive: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  pillText: {
    fontSize: 13,
  },
  pillTextActive: {
    fontFamily: fonts.body.semiBold,
    color: colors.white,
  },
  pillTextInactive: {
    fontFamily: fonts.body.medium,
    color: colors.text,
  },
  countBadge: {
    minWidth: 18,
    height: 18,
    paddingHorizontal: 5,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeActive: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
  },
  badgeInactive: {
    backgroundColor: "#F3F4F6",
  },
  countText: {
    fontSize: 11,
  },
  countTextActive: {
    fontFamily: fonts.body.semiBold,
    color: colors.white,
  },
  countTextInactive: {
    fontFamily: fonts.body.medium,
    color: colors.textMuted,
  },
});
