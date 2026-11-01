import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Check } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import { profileColors } from "../profileTokens";

const STEPS = ["Email", "Stall", "Password"];

/** current: 1 to 3. Email is done once you reach Stall. */
export function SetupProgress({ current }: { current: number }) {
  return (
    <View style={styles.row}>
      {STEPS.map((label, index) => {
        const n = index + 1;
        const done = n < current;
        const active = n === current;
        return (
          <React.Fragment key={label}>
            {index > 0 ? <View style={[styles.bar, n <= current && styles.barOn]} /> : null}
            <View style={[styles.item, active && styles.itemOn]}>
              {done ? <View style={styles.tick}><Check size={13} color={colors.white} strokeWidth={3} /></View>
                : <View style={[styles.dot, active && styles.dotOn]} />}
              <Text style={[styles.label, (done || active) && styles.labelOn]}>{label}</Text>
            </View>
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", marginTop: spacing.md },
  item: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 4, paddingVertical: 4, borderRadius: radii.full },
  itemOn: { backgroundColor: profileColors.mint, paddingHorizontal: 10 },
  tick: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  dot: { width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: profileColors.border },
  dotOn: { borderColor: colors.primary, backgroundColor: colors.primary },
  label: { fontFamily: fonts.body.medium, fontSize: 14, color: colors.textMuted },
  labelOn: { fontFamily: fonts.body.semiBold, color: colors.primary },
  bar: { flex: 1, height: 2, backgroundColor: profileColors.border, marginHorizontal: 4 },
  barOn: { backgroundColor: colors.primary },
});
