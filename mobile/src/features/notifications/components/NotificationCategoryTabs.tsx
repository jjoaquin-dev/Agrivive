import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, fonts, radii, spacing, typography } from "../../../theme";
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
              {count > 0 ? `${tab.label} (${count})` : tab.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", gap: spacing.sm, paddingVertical: spacing.xs },
  pill: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radii.full, flexDirection: "row", alignItems: "center", borderWidth: 1 },
  pillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  pillInactive: { backgroundColor: colors.surface, borderColor: colors.border },
  pillText: { ...typography.labelSmall },
  pillTextActive: { fontFamily: fonts.body.semiBold, color: colors.white },
  pillTextInactive: { color: colors.text },
});
