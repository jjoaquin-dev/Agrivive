import React, { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { ButtonComponent } from "../../../components/ButtonComponent";
import { colors, fonts, radii, spacing, touchTargets } from "../../../theme";
import { dateKey, formatRange, lastDays, parseKey, type DateRange } from "../dateRange";

const BLUE = "#2563EB";
const BLUE_LIGHT = "#DBEAFE";
const weekdays = ["S", "M", "T", "W", "T", "F", "S"];
const presets = [{ days: 7, label: "Last 7 days" }, { days: 30, label: "Last 30 days" }, { days: 90, label: "Last 90 days" }];

interface Props { visible: boolean; range: DateRange; onApply: (range: DateRange) => void; onClose: () => void }

/** Pick the first and last day on a calendar. Every day in between turns blue. */
export function AnalyticsDateSheet({ visible, range, onApply, onClose }: Props) {
  const [start, setStart] = useState<string | null>(range.from);
  const [end, setEnd] = useState<string | null>(range.to);
  const [month, setMonth] = useState(() => parseKey(range.to));
  const today = dateKey(new Date());

  useEffect(() => {
    if (!visible) return;
    setStart(range.from); setEnd(range.to); setMonth(parseKey(range.to));
  }, [visible, range.from, range.to]);

  const pick = (key: string) => {
    if (!start || end) { setStart(key); setEnd(null); }
    else if (key < start) setStart(key);
    else setEnd(key);
  };

  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells: (string | null)[] = [...Array(first.getDay()).fill(null), ...Array.from({ length: count }, (_, i) => dateKey(new Date(first.getFullYear(), first.getMonth(), i + 1)))];
  const nextDisabled = dateKey(new Date(first.getFullYear(), first.getMonth() + 1, 1)) > today;
  const move = (by: number) => setMonth(new Date(first.getFullYear(), first.getMonth() + by, 1));
  const usePreset = (days: number) => { const r = lastDays(days); setStart(r.from); setEnd(r.to); setMonth(parseKey(r.to)); };
  const picked: DateRange | null = start ? { from: start, to: end ?? start } : null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close calendar" />
      <View style={styles.sheet}>
        <Text style={styles.title}>Choose Dates</Text>
        <Text style={styles.hint}>{!start ? "Tap the first day." : !end ? "Now tap the last day." : "Tap a day to start over."}</Text>
        <View style={styles.presets}>
          {presets.map((p) => (
            <Pressable key={p.days} onPress={() => usePreset(p.days)} accessibilityRole="button" style={styles.preset}><Text style={styles.presetText}>{p.label}</Text></Pressable>
          ))}
        </View>
        <View style={styles.monthRow}>
          <Pressable onPress={() => move(-1)} accessibilityRole="button" accessibilityLabel="Earlier month" style={styles.nav}><ChevronLeft size={22} color={colors.text} /></Pressable>
          <Text style={styles.month}>{first.toLocaleDateString([], { month: "long", year: "numeric" })}</Text>
          <Pressable onPress={() => move(1)} disabled={nextDisabled} accessibilityRole="button" accessibilityLabel="Later month" style={[styles.nav, nextDisabled && styles.off]}><ChevronRight size={22} color={colors.text} /></Pressable>
        </View>
        <View style={styles.grid}>
          {weekdays.map((w, i) => <Text key={i} style={styles.weekday}>{w}</Text>)}
          {cells.map((key, i) => {
            if (!key) return <View key={`e${i}`} style={styles.cell} />;
            const edge = key === start || key === (end ?? start);
            const inside = !!start && !!end && key > start && key < end;
            const future = key > today;
            return (
              <Pressable key={key} disabled={future} onPress={() => pick(key)} accessibilityRole="button" accessibilityState={{ selected: edge || inside, disabled: future }}
                accessibilityLabel={parseKey(key).toLocaleDateString([], { month: "long", day: "numeric" })} style={[styles.cell, inside && styles.inside, edge && styles.edge]}>
                <Text style={[styles.day, future && styles.future, edge && styles.edgeText, inside && styles.insideText]}>{Number(key.slice(8))}</Text>
              </Pressable>
            );
          })}
        </View>
        {picked ? <Text style={styles.summary}>{formatRange(picked)}</Text> : null}
        <ButtonComponent title="Show This Period" disabled={!picked} onPress={() => { if (picked) { onApply(picked); onClose(); } }} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)" },
  sheet: { backgroundColor: colors.surface, borderTopLeftRadius: radii.card, borderTopRightRadius: radii.card, padding: spacing.base, gap: spacing.sm },
  title: { fontFamily: fonts.heading.bold, fontSize: 20, color: colors.text },
  hint: { fontFamily: fonts.body.regular, fontSize: 14, color: colors.textMuted },
  presets: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  preset: { minHeight: 40, paddingHorizontal: spacing.md, justifyContent: "center", borderRadius: radii.full, borderWidth: 1, borderColor: colors.border },
  presetText: { fontFamily: fonts.body.medium, fontSize: 13, color: colors.text },
  monthRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  month: { fontFamily: fonts.heading.semiBold, fontSize: 16, color: colors.text },
  nav: { width: touchTargets.min, height: touchTargets.min, alignItems: "center", justifyContent: "center" },
  off: { opacity: 0.3 },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  weekday: { width: "14.2857%", textAlign: "center", fontFamily: fonts.body.semiBold, fontSize: 12, color: colors.textMuted, paddingBottom: spacing.xs },
  cell: { width: "14.2857%", height: 44, alignItems: "center", justifyContent: "center" },
  inside: { backgroundColor: BLUE_LIGHT },
  edge: { backgroundColor: BLUE, borderRadius: 22 },
  day: { fontFamily: fonts.body.medium, fontSize: 15, color: colors.text },
  insideText: { color: BLUE, fontFamily: fonts.body.semiBold },
  edgeText: { color: colors.white, fontFamily: fonts.body.semiBold },
  future: { color: colors.textMuted, opacity: 0.4 },
  summary: { fontFamily: fonts.body.semiBold, fontSize: 15, color: BLUE, textAlign: "center" },
});
