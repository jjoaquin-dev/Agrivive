import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Check, Clock, Store, Tag } from "lucide-react-native";
import { ButtonComponent } from "../../../components/ButtonComponent";
import { colors, fonts, radii, spacing } from "../../../theme";

export interface StockSaved {
  productName: string;
  category: string;
  unit: string;
  previous: number;
  delta: number;
  current: number;
  reason: string;
}

/** Shows the result inside the sheet, so the seller sees the new amount without an extra pop-up (Peak-End Rule, Kahneman). */
export function StockSavedPanel({ saved, onDone }: { saved: StockSaved; onDone: () => void }) {
  const added = saved.delta > 0;
  return (
    <View style={styles.wrap}>
      <View style={styles.check}><Check size={32} color={colors.primary} strokeWidth={3} /></View>
      <Text style={styles.title}>Amount Updated!</Text>
      <Text style={styles.sub}>{saved.productName} · {saved.category}</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Previous available</Text>
          <Text style={styles.value}>{saved.previous.toFixed(2)} {saved.unit}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>{added ? "Produce added" : "Produce taken away"}</Text>
          <Text style={[styles.value, styles.delta, !added && { color: colors.error }]}>
            {added ? "+" : "−"}{Math.abs(saved.delta).toFixed(2)} {saved.unit}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>New available amount</Text>
          <Text style={styles.total}>{saved.current.toFixed(2)} <Text style={styles.totalUnit}>{saved.unit}</Text></Text>
        </View>
        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Tag size={14} color={colors.primary} />
            <Text style={styles.metaText} numberOfLines={2}>Reason: <Text style={styles.metaStrong}>{saved.reason}</Text></Text>
          </View>
          <View style={styles.metaItem}>
            <Clock size={12} color="#9CA3AF" />
            <Text style={[styles.metaText, { color: "#9CA3AF" }]}>Updated just now</Text>
          </View>
        </View>
      </View>

      <View style={styles.note}>
        <View style={styles.noteIcon}><Store size={14} color={colors.primary} /></View>
        <Text style={styles.noteText}>
          Buyers can now reserve up to <Text style={styles.noteStrong}>{saved.current.toFixed(2)} {saved.unit}</Text> of your {saved.productName}.
        </Text>
      </View>

      <ButtonComponent title="Done" icon={<Check size={20} color={colors.white} />} onPress={onDone} style={styles.done} textStyle={styles.doneText} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", paddingHorizontal: spacing.xl, paddingTop: spacing.base, paddingBottom: spacing.xl },
  check: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#F0FDF4", borderWidth: 2, borderColor: "#BBF7D0", alignItems: "center", justifyContent: "center" },
  title: { fontFamily: fonts.heading.bold, fontSize: 22, color: colors.text, marginTop: spacing.base },
  sub: { fontFamily: fonts.body.regular, fontSize: 14, color: colors.textMuted, marginTop: 4, textAlign: "center" },
  card: { alignSelf: "stretch", backgroundColor: colors.surfaceMuted, borderWidth: 1, borderColor: colors.border, borderRadius: radii.card - 2, padding: spacing.base, marginTop: spacing.lg },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  label: { fontFamily: fonts.body.regular, fontSize: 14, color: colors.textMuted },
  value: { fontFamily: fonts.body.medium, fontSize: 14, color: colors.text },
  delta: { fontFamily: fonts.heading.bold, color: colors.primary },
  divider: { height: 1, backgroundColor: colors.border, marginBottom: 10 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  totalLabel: { fontFamily: fonts.body.semiBold, fontSize: 15, color: colors.text },
  total: { fontFamily: fonts.heading.bold, fontSize: 22, color: colors.primary },
  totalUnit: { fontSize: 14 },
  meta: { marginTop: 10, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border, borderStyle: "dashed", gap: 6 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  metaText: { flex: 1, fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted },
  metaStrong: { fontFamily: fonts.body.medium, color: "#374151" },
  note: { alignSelf: "stretch", flexDirection: "row", alignItems: "flex-start", gap: 10, marginTop: spacing.base, paddingHorizontal: 4 },
  noteIcon: { width: 24, height: 24, borderRadius: 12, backgroundColor: "#F0FDF4", alignItems: "center", justifyContent: "center" },
  noteText: { flex: 1, fontFamily: fonts.body.regular, fontSize: 13, lineHeight: 20, color: colors.text },
  noteStrong: { fontFamily: fonts.body.semiBold },
  done: { alignSelf: "stretch", minHeight: 52, borderRadius: radii.button, marginTop: spacing.xl },
  doneText: { fontFamily: fonts.heading.bold, fontSize: 16 },
});
