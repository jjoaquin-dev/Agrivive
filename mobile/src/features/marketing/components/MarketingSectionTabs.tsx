import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, fonts, radii, spacing } from "../../../theme";

export type MarketingSection = "active" | "drops" | "history" | "visibility";

interface Props {
  value: MarketingSection;
  activeCount?: number;
  onChange: (value: MarketingSection) => void;
}

/** Three activity tabs of the Marketing hub as underlined tabs with room between them, like other social apps (Jakob's Law). */
export function MarketingSectionTabs({ value, activeCount = 0, onChange }: Props) {
  const sections: { value: MarketingSection; label: string; count?: number }[] = [
    { value: "active", label: "Running", count: activeCount > 0 ? activeCount : undefined },
    { value: "drops", label: "Price Drops" },
    { value: "history", label: "History" },
  ];

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} accessibilityRole="tablist" style={styles.scroll} contentContainerStyle={styles.container}>
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
            <Text style={[styles.text, selected && styles.textSelected]}>{section.label}</Text>
            {section.count != null ? (
              <View style={[styles.badge, selected && styles.badgeSelected]}>
                <Text style={[styles.badgeText, selected && styles.badgeTextSelected]}>{section.count}</Text>
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 0, marginTop: spacing.base, marginBottom: spacing.base, borderBottomWidth: 1, borderBottomColor: colors.border },
  container: { gap: spacing.xl },
  tab: { minHeight: 48, flexDirection: "row", alignItems: "center", gap: 6, borderBottomWidth: 3, borderBottomColor: colors.transparent },
  tabSelected: { borderBottomColor: colors.primary },
  text: { fontFamily: fonts.body.medium, fontSize: 14, color: colors.textMuted },
  textSelected: { color: colors.text, fontFamily: fonts.body.semiBold },
  badge: { paddingHorizontal: 6, paddingVertical: 1, borderRadius: radii.full, backgroundColor: colors.border },
  badgeSelected: { backgroundColor: colors.primary },
  badgeText: { fontFamily: fonts.body.semiBold, fontSize: 11, color: colors.textMuted },
  badgeTextSelected: { color: colors.white },
});
