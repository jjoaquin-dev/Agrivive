import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, spacing } from "../../../theme";

interface AuthStepBarProps {
  step: number;
  total?: number;
  name: string;
}

/** "Step 1 of 3 · Email" with a bar per step (Goal-Gradient Effect, Hull). */
export const AuthStepBar: React.FC<AuthStepBarProps> = ({ step, total = 3, name }) => (
  <View style={styles.wrap}>
    <View style={styles.labelRow}>
      <Text style={styles.label}>{`Step ${step} of ${total} · ${name}`}</Text>
      <View style={styles.pill}><Text style={styles.pillText}>In progress</Text></View>
    </View>
    <View style={styles.bars}>
      {Array.from({ length: total }, (_, i) => (
        <View key={i} style={[styles.bar, i < step && styles.barOn]} />
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.lg },
  labelRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  label: { fontFamily: fonts.body.regular, fontSize: 14, color: colors.textMuted },
  pill: { backgroundColor: colors.primaryLight, borderRadius: 9999, paddingHorizontal: 10, paddingVertical: 3 },
  pillText: { fontFamily: fonts.body.semiBold, fontSize: 12, color: colors.primary },
  bars: { flexDirection: "row", gap: 8, marginTop: spacing.sm },
  bar: { flex: 1, height: 6, borderRadius: 3, backgroundColor: "#E5E2DA" },
  barOn: { backgroundColor: colors.primary },
});
