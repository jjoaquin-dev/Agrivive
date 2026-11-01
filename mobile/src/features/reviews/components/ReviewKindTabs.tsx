import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import type { ReviewKind } from "../types";

const TABS: { id: ReviewKind; label: string }[] = [
  { id: "pickup", label: "Pickup Reviews" },
  { id: "product", label: "Product Reviews" },
];

interface ReviewKindTabsProps {
  kind: ReviewKind;
  onSelect: (kind: ReviewKind) => void;
}

/** Two clear groups so the long list stays short (Hick-Hyman Law, Hick & Hyman). */
export const ReviewKindTabs: React.FC<ReviewKindTabsProps> = ({ kind, onSelect }) => (
  <View style={styles.row} accessibilityRole="tablist">
    {TABS.map((tab) => {
      const selected = tab.id === kind;
      return (
        <Pressable
          key={tab.id}
          onPress={() => onSelect(tab.id)}
          accessibilityRole="tab"
          accessibilityState={{ selected }}
          style={[styles.tab, selected && styles.tabOn]}
        >
          <Text style={[styles.label, selected && styles.labelOn]}>{tab.label}</Text>
        </Pressable>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.md },
  tab: { flex: 1, minHeight: 44, alignItems: "center", justifyContent: "center", borderRadius: radii.full, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  tabOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  label: { fontFamily: fonts.body.semiBold, fontSize: 14, color: colors.text },
  labelOn: { color: colors.white },
});
