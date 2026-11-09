import React from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { Minus, Plus } from "lucide-react-native";
import { colors, fonts, spacing, touchTargets } from "../../../theme";
import { minuteLabel, stepMinute, weekdayNames } from "../stallFormat";

export interface HoursDay { weekday: number; isClosed: boolean; opensMinute: number; closesMinute: number }

/** The same opening hours for Stall Hours and for first-time setup, so a seller sets them the same way both times (Jakob's Law, Jakob Nielsen). */
export const defaultHours = (): HoursDay[] =>
  [0, 1, 2, 3, 4, 5, 6].map((weekday) => ({ weekday, isClosed: false, opensMinute: 480, closesMinute: 1200 }));

function Stepper({ label, value, onChange }: { label: string; value: number; onChange: (direction: 1 | -1) => void }) {
  return (
    <View style={styles.stepper}>
      <Pressable accessibilityRole="button" accessibilityLabel={`Earlier ${label}`} onPress={() => onChange(-1)} style={styles.stepButton}><Minus size={16} color={colors.primary} /></Pressable>
      <Text style={styles.stepValue}>{minuteLabel(value)}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel={`Later ${label}`} onPress={() => onChange(1)} style={styles.stepButton}><Plus size={16} color={colors.primary} /></Pressable>
    </View>
  );
}

export function StallHoursEditor({ days, onChange }: { days: HoursDay[]; onChange: (weekday: number, patch: Partial<HoursDay>) => void }) {
  return (
    <>
      {days.map((day) => (
        <View key={day.weekday} style={styles.dayRow}>
          <View style={styles.dayHead}>
            <Text style={styles.dayName}>{weekdayNames[day.weekday]}</Text>
            <View style={styles.openRow}>
              <Text style={styles.hint}>{day.isClosed ? "Closed" : "Open"}</Text>
              <Switch value={!day.isClosed} trackColor={{ true: colors.primary }} accessibilityLabel={`${weekdayNames[day.weekday]} open`}
                onValueChange={(open) => onChange(day.weekday, { isClosed: !open, opensMinute: day.opensMinute >= day.closesMinute ? 480 : day.opensMinute, closesMinute: day.closesMinute <= day.opensMinute ? 1200 : day.closesMinute })} />
            </View>
          </View>
          {!day.isClosed ? (
            <View style={styles.times}>
              <View style={styles.timeRow}><Text style={styles.to}>From</Text><Stepper label="opening time" value={day.opensMinute} onChange={(d) => onChange(day.weekday, { opensMinute: stepMinute(day.opensMinute, d, 0, day.closesMinute - 60) })} /></View>
              <View style={styles.timeRow}><Text style={styles.to}>To</Text><Stepper label="closing time" value={day.closesMinute} onChange={(d) => onChange(day.weekday, { closesMinute: stepMinute(day.closesMinute, d, day.opensMinute + 60, 1440) })} /></View>
            </View>
          ) : null}
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  hint: { fontFamily: fonts.body.regular, fontSize: 12, lineHeight: 17, color: colors.textMuted, marginTop: 2 },
  dayRow: { borderTopWidth: 1, borderTopColor: colors.border, paddingVertical: spacing.md, marginTop: spacing.sm },
  dayHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  dayName: { fontFamily: fonts.body.semiBold, fontSize: 15, color: colors.text },
  openRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  times: { gap: spacing.sm, marginTop: spacing.sm },
  timeRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  to: { fontFamily: fonts.body.regular, color: colors.textMuted },
  stepper: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  stepButton: { width: touchTargets.min, height: touchTargets.min, borderRadius: touchTargets.min / 2, backgroundColor: colors.primaryLight, alignItems: "center", justifyContent: "center" },
  stepValue: { minWidth: 72, textAlign: "center", fontFamily: fonts.body.semiBold, fontSize: 14, color: colors.text },
});
