import React from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import type { MessagesTabFilter } from "../hooks/useConversationFilters";

interface MessagesChipRowProps {
  activeTab: MessagesTabFilter;
  onSelectTab: (tab: MessagesTabFilter) => void;
  unreadCount: number;
  openCount: number;
}

export function MessagesChipRow({
  activeTab,
  onSelectTab,
  unreadCount,
  openCount,
}: MessagesChipRowProps) {
  const tabs: { key: MessagesTabFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "unread", label: unreadCount > 0 ? `Unread ${unreadCount}` : "Unread" },
    { key: "produce", label: "Produce" },
    { key: "reservations", label: "Reservations" },
    { key: "questions", label: openCount > 0 ? `Questions ${openCount}` : "Questions" },
  ];

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
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  container: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  chip: {
    height: 36,
    paddingHorizontal: spacing.md,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceMuted,
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
    fontSize: 13,
    color: colors.textMuted,
  },
  chipTextActive: {
    fontFamily: fonts.body.semiBold,
    color: colors.primaryPressed,
  },
});
