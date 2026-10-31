import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fonts, radii, spacing } from "../../../theme";

export type MarketingSection = "active" | "history" | "visibility";

const sections: { value: MarketingSection; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "history", label: "History" },
  { value: "visibility", label: "Visibility Guide" },
];

interface Props {
  value: MarketingSection;
  onChange: (value: MarketingSection) => void;
}

/** Three sections of the Marketing hub as one segmented control (Jakob's Law: a familiar pattern). */
export function MarketingSectionTabs({ value, onChange }: Props) {
  return (
    <View style={styles.row} accessibilityRole="tablist">
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
            <Text style={[styles.text, selected && styles.textSelected]} numberOfLines={1}>{section.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", backgroundColor: colors.surface, borderRadius: radii.button, borderWidth: 1, borderColor: colors.border, padding: 3, marginTop: spacing.base, marginBottom: spacing.md },
  tab: { flex: 1, minHeight: 44, alignItems: "center", justifyContent: "center", borderRadius: radii.button, paddingHorizontal: spacing.xs },
  tabSelected: { backgroundColor: colors.primary },
  text: { fontFamily: fonts.body.medium, fontSize: 13, color: colors.text },
  textSelected: { color: colors.white, fontFamily: fonts.body.semiBold },
});
