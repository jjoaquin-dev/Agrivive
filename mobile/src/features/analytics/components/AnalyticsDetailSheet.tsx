import React from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { X } from "lucide-react-native";
import { colors, fonts, radii, spacing, touchTargets } from "../../../theme";

export type BreakdownRow = { label: string; value: string; strong?: boolean };

interface Props {
  visible: boolean;
  title: string;
  subtitle?: string;
  rows: BreakdownRow[];
  children?: React.ReactNode;
  onClose: () => void;
}

/** The breakdown that opens when a report number or chart is pressed: the parts behind the total. */
export function AnalyticsDetailSheet({ visible, title, subtitle, rows, children, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close breakdown" />
      <View style={styles.sheet}>
        <View style={styles.head}>
          <View style={styles.headText}>
            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
          <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Close" style={styles.close}><X size={22} color={colors.textMuted} /></Pressable>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          {children}
          {rows.map((row, i) => (
            <View key={`${row.label}-${i}`} style={[styles.row, i === 0 && !children && styles.rowFirst]}>
              <Text style={[styles.label, row.strong && styles.strong]}>{row.label}</Text>
              <Text style={[styles.value, row.strong && styles.strong]}>{row.value}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)" },
  sheet: { maxHeight: "80%", backgroundColor: colors.surface, borderTopLeftRadius: radii.card, borderTopRightRadius: radii.card, padding: spacing.base },
  head: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm, marginBottom: spacing.sm },
  headText: { flex: 1 },
  title: { fontFamily: fonts.heading.bold, fontSize: 20, color: colors.text },
  subtitle: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted, marginTop: 2 },
  close: { width: touchTargets.min, height: touchTargets.min, alignItems: "center", justifyContent: "center" },
  row: { flexDirection: "row", justifyContent: "space-between", gap: spacing.md, minHeight: 48, alignItems: "center", borderTopWidth: 1, borderTopColor: colors.border },
  rowFirst: { borderTopWidth: 0 },
  label: { flex: 1, fontFamily: fonts.body.regular, fontSize: 15, color: colors.text },
  value: { fontFamily: fonts.body.semiBold, fontSize: 15, color: colors.text },
  strong: { fontFamily: fonts.heading.bold },
});
