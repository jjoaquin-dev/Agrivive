import React, { useState } from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { Minus, Plus } from "lucide-react-native";
import { colors, fonts, spacing, touchTargets } from "../../../theme";
import { minuteLabel, stepMinute, weekdayNames } from "../stallFormat";
import { groupDays, is24Hours, weekOrder, type HoursDay, type ScheduleCard } from "../stallSchedule";

export type { HoursDay };

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

type Change = (weekday: number, patch: Partial<HoursDay>) => void;

function ScheduleCardView({ card, onChange, onTime }: { card: ScheduleCard; onChange: Change; onTime: (patch: { opensMinute?: number; closesMinute?: number }) => void }) {
  const all = is24Hours(card.opensMinute, card.closesMinute);
  return (
    <View style={styles.card}>
      <View style={styles.dayHead}>
        <Text style={styles.dayName}>Open 24 hours</Text>
        <Switch value={all} trackColor={{ true: colors.primary }} accessibilityLabel="Open 24 hours"
          onValueChange={(on) => onTime(on ? { opensMinute: 0, closesMinute: 1440 } : { opensMinute: 480, closesMinute: 1200 })} />
      </View>
      {!all ? (
        <View style={styles.times}>
          <View style={styles.timeRow}><Text style={styles.to}>From</Text><Stepper label="opening time" value={card.opensMinute} onChange={(d) => onTime({ opensMinute: stepMinute(card.opensMinute, d, 0, card.closesMinute - 60) })} /></View>
          <View style={styles.timeRow}><Text style={styles.to}>To</Text><Stepper label="closing time" value={card.closesMinute} onChange={(d) => onTime({ closesMinute: stepMinute(card.closesMinute, d, card.opensMinute + 60, 1440) })} /></View>
        </View>
      ) : null}
      <Text style={styles.hint}>Repeats on</Text>
      <View style={styles.chips}>
        {weekOrder.map((weekday) => {
          const on = card.weekdays.includes(weekday);
          return (
            <Pressable key={weekday} accessibilityRole="checkbox" accessibilityState={{ checked: on }} accessibilityLabel={weekdayNames[weekday]}
              onPress={() => onChange(weekday, on ? { isClosed: true } : { isClosed: false, opensMinute: card.opensMinute, closesMinute: card.closesMinute })}
              style={[styles.chip, on && styles.chipOn]}>
              <Text style={[styles.chipText, on && styles.chipTextOn]}>{weekdayNames[weekday].slice(0, 3)}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

/** Set hours once, then pick the weekdays they repeat on, like an alarm. Days not picked are closed. Add another schedule for days with different hours. */
export function StallHoursEditor({ days, onChange }: { days: HoursDay[]; onChange: Change }) {
  const cards = groupDays(days);
  const [drafts, setDrafts] = useState<ScheduleCard[]>([]);
  const empty = !cards.length && !drafts.length;
  const shown = [...cards, ...drafts];
  const setTime = (card: ScheduleCard, isDraft: number | null, patch: { opensMinute?: number; closesMinute?: number }) => {
    if (isDraft !== null) setDrafts((rows) => rows.map((row, index) => (index === isDraft ? { ...row, ...patch } : row)));
    else card.weekdays.forEach((weekday) => onChange(weekday, patch));
  };
  return (
    <>
      {empty ? <Text style={styles.hint}>Every day is closed. Add a schedule to open your stall.</Text> : null}
      {shown.map((card, index) => (
        <ScheduleCardView key={`${index}-${card.weekdays.join("")}`} card={card}
          onChange={(weekday, patch) => {
            onChange(weekday, patch);
            // A new schedule becomes a real one as soon as it has a day.
            if (index >= cards.length && !patch.isClosed) setDrafts((rows) => rows.filter((_, at) => at !== index - cards.length));
          }}
          onTime={(patch) => setTime(card, index >= cards.length ? index - cards.length : null, patch)} />
      ))}
      <Pressable accessibilityRole="button" onPress={() => setDrafts((rows) => [...rows, { opensMinute: 480, closesMinute: 1200, weekdays: [] }])} style={styles.add}>
        <Plus size={16} color={colors.primary} /><Text style={styles.addText}>Add another schedule</Text>
      </Pressable>
      <Text style={styles.hint}>Days you do not pick stay closed. Buyers get a reminder 30 minutes before you close.</Text>
    </>
  );
}

const styles = StyleSheet.create({
  hint: { fontFamily: fonts.body.regular, fontSize: 12, lineHeight: 17, color: colors.textMuted, marginTop: 2 },
  card: { borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: spacing.md, marginTop: spacing.sm },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs, marginTop: spacing.xs },
  chip: { minHeight: touchTargets.min, minWidth: touchTargets.min, paddingHorizontal: spacing.sm, borderRadius: touchTargets.min / 2, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontFamily: fonts.body.semiBold, fontSize: 13, color: colors.text },
  chipTextOn: { color: "#FFFFFF" },
  add: { flexDirection: "row", alignItems: "center", gap: spacing.xs, minHeight: touchTargets.min, marginTop: spacing.sm },
  addText: { fontFamily: fonts.body.semiBold, fontSize: 14, color: colors.primary },
  dayHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  dayName: { fontFamily: fonts.body.semiBold, fontSize: 15, color: colors.text },
  times: { gap: spacing.sm, marginTop: spacing.sm },
  timeRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  to: { fontFamily: fonts.body.regular, color: colors.textMuted },
  stepper: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  stepButton: { width: touchTargets.min, height: touchTargets.min, borderRadius: touchTargets.min / 2, backgroundColor: colors.primaryLight, alignItems: "center", justifyContent: "center" },
  stepValue: { minWidth: 72, textAlign: "center", fontFamily: fonts.body.semiBold, fontSize: 14, color: colors.text },
});
