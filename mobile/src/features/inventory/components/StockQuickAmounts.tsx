import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fonts, spacing } from "../../../theme";

interface Props {
  actionType: "in" | "out";
  unitLabel: string;
  value: number;
  onPick: (amount: number) => void;
}

/** One-tap amounts so common changes need no typing (Fitts's Law, Paul Fitts). */
export function StockQuickAmounts({ actionType, unitLabel, value, onPick }: Props) {
  const amounts = unitLabel === "kg" ? [2, 5, 10] : [1, 2, 5];
  const sign = actionType === "in" ? "+" : "−";
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{actionType === "in" ? "Quick add:" : "Quick take away:"}</Text>
      {amounts.map((amount) => {
        const selected = value === amount;
        return (
          <Pressable
            key={amount}
            onPress={() => onPick(amount)}
            accessibilityRole="button"
            accessibilityLabel={`${actionType === "in" ? "Add" : "Take away"} ${amount} ${unitLabel}`}
            style={[styles.chip, selected && styles.chipSelected]}
          >
            <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{sign}{amount} {unitLabel}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: spacing.sm, marginTop: -spacing.xs, marginBottom: spacing.base },
  label: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted },
  chip: { minHeight: 36, paddingHorizontal: spacing.md, justifyContent: "center", borderRadius: 8, backgroundColor: "#F3F1EA", borderWidth: 1, borderColor: "transparent" },
  chipSelected: { backgroundColor: "#F0FDF4", borderColor: "#BBF7D0" },
  chipText: { fontFamily: fonts.body.medium, fontSize: 12, color: "#374151" },
  chipTextSelected: { fontFamily: fonts.body.semiBold, color: colors.primary },
});
