import React from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import type { MessagesTabFilter } from "../hooks/useConversationFilters";
import { surface } from "../../../theme/surface";

interface MessagesChipRowProps {
  activeTab: MessagesTabFilter;
  onSelectTab: (tab: MessagesTabFilter) => void;
  unreadCount: number;
  openCount: number;
  /** Tabs with nothing in them are left out. All and Archived always show, and so does the tab that is open. */
  available?: Partial<Record<MessagesTabFilter, boolean>>;
}

export function MessagesChipRow({
  activeTab,
  onSelectTab,
  unreadCount,
  openCount,
  available = {},
}: MessagesChipRowProps) {
  const allTabs: { key: MessagesTabFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "unread", label: unreadCount > 0 ? `Unread ${unreadCount}` : "Unread" },
    { key: "produce", label: "Produce" },
    { key: "reservations", label: "Reservations" },
    { key: "questions", label: openCount > 0 ? `Questions ${openCount}` : "Questions" },
    { key: "archived", label: "Archived" },
  ];
  const tabs = allTabs.filter((tab) => tab.key === "all" || tab.key === "archived" || tab.key === activeTab || available[tab.key] !== false);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.container}
    >
      {tabs.map((tab) => {
        const selected = activeTab === tab.key;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onSelectTab(tab.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            hitSlop={{ top: 4, bottom: 4, left: 2, right: 2 }}
            style={[styles.chip, selected && styles.chipActive]}
          >
            <Text style={[styles.chipText, selected && styles.chipTextActive]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
    backgroundColor: surface.page,
  },
  container: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xs,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  chip: {
    height: 38,
    paddingHorizontal: spacing.base,
    borderRadius: radii.full,
    backgroundColor: surface.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  chipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  chipText: {
    fontFamily: fonts.body.medium,
    fontSize: 14,
    color: colors.textMuted,
  },
  chipTextActive: {
    fontFamily: fonts.body.semiBold,
    color: colors.primaryPressed,
  },
});
