import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, fonts, radii, spacing, touchTargets } from "../../../theme";
import type { ReviewFilter } from "../types";

interface ReviewFilterTabsProps {
  currentFilter: ReviewFilter;
  onSelectFilter: (filter: ReviewFilter) => void;
  unansweredCount: number;
  selectedRating?: number;
  onSelectRating: (rating?: number) => void;
}

export const ReviewFilterTabs: React.FC<ReviewFilterTabsProps> = ({
  currentFilter,
  onSelectFilter,
  unansweredCount,
  selectedRating,
  onSelectRating,
}) => {
  const tabs: { key: ReviewFilter; label: string; count?: number }[] = [
    { key: "all", label: "All" },
    { key: "unanswered", label: "Needs Reply", count: unansweredCount },
    { key: "replied", label: "Replied" },
  ];

  const starFilters = [5, 4, 3, 2, 1];

  return (
    <View style={styles.container}>
      <View style={styles.mainTabs}>
        {tabs.map((tab) => {
          const isActive = currentFilter === tab.key;
          return (
            <Pressable
              key={tab.key}
              onPress={() => onSelectFilter(tab.key)}
              style={[styles.tab, isActive && styles.tabActive]}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={tab.label}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab.label}
              </Text>
              {tab.count && tab.count > 0 ? (
                <View style={[styles.badge, isActive && styles.badgeActive]}>
                  <Text style={[styles.badgeText, isActive && styles.badgeTextActive]}>
                    {tab.count}
                  </Text>
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.starRow}
      >
        <Pressable
          onPress={() => onSelectRating(undefined)}
          style={[styles.starPill, selectedRating === undefined && styles.starPillActive]}
          accessibilityRole="button"
          accessibilityLabel="All star ratings"
        >
          <Text
            style={[
              styles.starPillText,
              selectedRating === undefined && styles.starPillTextActive,
            ]}
          >
            All Ratings
          </Text>
        </Pressable>

        {starFilters.map((stars) => {
          const isSelected = selectedRating === stars;
          return (
            <Pressable
              key={stars}
              onPress={() => onSelectRating(isSelected ? undefined : stars)}
              style={[styles.starPill, isSelected && styles.starPillActive]}
              accessibilityRole="button"
              accessibilityLabel={`${stars} stars filter`}
            >
              <Text
                style={[
                  styles.starPillText,
                  isSelected && styles.starPillTextActive,
                ]}
              >
                {stars} ★
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.base,
    gap: spacing.sm,
  },
  mainTabs: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: radii.button,
    padding: 3,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minHeight: touchTargets.min - 8,
    borderRadius: radii.button - 2,
    gap: 6,
  },
  tabActive: {
    backgroundColor: colors.surface,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: {
    fontFamily: fonts.body.medium,
    fontSize: 13,
    color: colors.textMuted,
  },
  tabTextActive: {
    fontFamily: fonts.body.semiBold,
    color: colors.text,
  },
  badge: {
    backgroundColor: "#F59E0B",
    borderRadius: radii.full,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  badgeActive: {
    backgroundColor: "#D97706",
  },
  badgeText: {
    fontFamily: fonts.body.semiBold,
    fontSize: 11,
    color: colors.white,
  },
  badgeTextActive: {
    color: colors.white,
  },
  starRow: {
    gap: spacing.xs,
    paddingVertical: 2,
  },
  starPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radii.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  starPillActive: {
    backgroundColor: "#0F920F",
    borderColor: "#0F920F",
  },
  starPillText: {
    fontFamily: fonts.body.medium,
    fontSize: 12,
    color: colors.textMuted,
  },
  starPillTextActive: {
    fontFamily: fonts.body.semiBold,
    color: colors.white,
  },
});
