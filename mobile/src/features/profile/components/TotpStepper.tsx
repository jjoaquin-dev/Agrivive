import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Check } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import { profileColors } from "../profileTokens";

const STEPS = ["Password", "Scan", "Verify", "Backup"];

/** current: 1 to 4. Done steps get a tick, the current one a green pill. */
export function TotpStepper({ current }: { current: number }) {
  return (
    <View style={styles.row}>
      {STEPS.map((label, index) => {
        const n = index + 1;
        const done = n < current;
        const active = n === current;
        return (
          <View key={label} style={styles.item}>
            <View style={styles.line}>
              <View style={[styles.bar, index === 0 && styles.hidden, n <= current && styles.barOn]} />
              {done ? <View style={styles.dot}><Check size={14} color={colors.white} strokeWidth={3} /></View>
                : active ? <View style={styles.pill}><Text style={styles.pillText}>{n}. {label}</Text></View>
                : <View style={styles.idle}><Text style={styles.idleText}>{n}</Text></View>}
              <View style={[styles.bar, index === STEPS.length - 1 && styles.hidden, n < current && styles.barOn]} />
            </View>
            <Text style={[styles.label, active && styles.labelOn]}>{done ? label : active ? "Active" : label}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "flex-start", marginBottom: spacing.base },
  item: { flex: 1, alignItems: "center" },
  line: { flexDirection: "row", alignItems: "center", alignSelf: "stretch", justifyContent: "center" },
  bar: { flex: 1, height: 2, backgroundColor: profileColors.border },
  barOn: { backgroundColor: colors.primary },
  hidden: { opacity: 0 },
  dot: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  pill: { backgroundColor: colors.primary, borderRadius: radii.full, paddingHorizontal: 8, paddingVertical: 4 },
  pillText: { fontFamily: fonts.body.semiBold, fontSize: 11, color: colors.white },
  idle: { width: 24, height: 24, borderRadius: 12, borderWidth: 1.5, borderColor: profileColors.border, alignItems: "center", justifyContent: "center", backgroundColor: colors.white },
  idleText: { fontFamily: fonts.body.semiBold, fontSize: 11, color: colors.textMuted },
  label: { fontFamily: fonts.body.regular, fontSize: 11, color: colors.textMuted, marginTop: 4 },
  labelOn: { fontFamily: fonts.body.semiBold, color: colors.primary },
});
