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
  { id: "trust", label: "Account" },
];

export function NotificationCategoryTabs({ selected, onSelect, counts }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
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
            <Text style={[styles.pillText, { color: isSelected ? colors.white : colors.text }]}>{tab.label}</Text>
            {count > 0 ? (
              <View style={[styles.badge, { backgroundColor: isSelected ? colors.white : colors.primary }]}>
                <Text style={[styles.badgeText, { color: isSelected ? colors.primary : colors.white }]}>{count}</Text>
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", gap: spacing.sm, paddingHorizontal: spacing.base, paddingVertical: spacing.sm },
  pill: { height: 40, paddingHorizontal: spacing.md + 2, borderRadius: radii.full, flexDirection: "row", alignItems: "center", gap: spacing.sm, borderWidth: 1 },
  pillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  pillInactive: { backgroundColor: colors.surface, borderColor: colors.border },
  pillText: { fontFamily: fonts.body.medium, fontSize: 14 },
  badge: { minWidth: 18, height: 18, borderRadius: 9, paddingHorizontal: 4, alignItems: "center", justifyContent: "center" },
  badgeText: { fontFamily: fonts.heading.bold, fontSize: 11 },
});
