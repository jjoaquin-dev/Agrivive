import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fonts, radii, spacing } from "../../../theme";

export type MarketingSection = "active" | "history" | "visibility";

interface Props {
  value: MarketingSection;
  activeCount?: number;
  onChange: (value: MarketingSection) => void;
}

/** Three sections of the Marketing hub as a standard social mobile segmented control (Jakob's Law). */
export function MarketingSectionTabs({ value, activeCount = 0, onChange }: Props) {
  const sections: { value: MarketingSection; label: string; count?: number }[] = [
    { value: "active", label: "Running", count: activeCount > 0 ? activeCount : undefined },
    { value: "history", label: "History" },
    { value: "visibility", label: "How Buyers Find You" },
  ];

  return (
    <View style={styles.container} accessibilityRole="tablist">
      {sections.map((section) => {
        const selected = value === section.value;
        return (
          <Pressable
            key={section.value}
            onPress={() => onChange(section.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            style={[styles.tab, selected && styles.tabSelected]}
          >
            <View style={styles.tabContent}>
              <Text style={[styles.text, selected && styles.textSelected]} numberOfLines={2}>
                {section.label}
              </Text>
              {section.count != null ? (
                <View style={[styles.badge, selected && styles.badgeSelected]}>
                  <Text style={[styles.badgeText, selected && styles.badgeTextSelected]}>
                    {section.count}
                  </Text>
                </View>
              ) : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.button,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 3,
    marginTop: spacing.base,
    marginBottom: spacing.base,
  },
  tab: {
    flex: 1,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.button - 2,
    paddingHorizontal: spacing.xs,
  },
  tabSelected: {
    backgroundColor: colors.white,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  tabContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  text: {
    fontFamily: fonts.body.medium,
    fontSize: 13,
    color: colors.textMuted,
  },
  textSelected: {
    color: colors.text,
    fontFamily: fonts.body.semiBold,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radii.full,
    backgroundColor: colors.border,
  },
  badgeSelected: {
    backgroundColor: colors.primary,
  },
  badgeText: {
    fontFamily: fonts.body.semiBold,
    fontSize: 11,
    color: colors.textMuted,
  },
  badgeTextSelected: {
    color: colors.white,
  },
});
