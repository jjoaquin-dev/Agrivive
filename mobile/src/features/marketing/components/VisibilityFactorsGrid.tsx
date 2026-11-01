import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import type { SellerVisibilityItem } from "../api/seller-visibility";

interface VisibilityFactorsGridProps {
  item: SellerVisibilityItem;
}

function percent(value: number | undefined): number | null {
  return typeof value === "number" && Number.isFinite(value) ? Math.round(Math.min(1, Math.max(0, value)) * 100) : null;
}

/** The four things that decide how high a listing shows, biggest first. */
export function VisibilityFactorsGrid({ item }: VisibilityFactorsGridProps) {
  const factors = [
    { label: "Fresh", weight: 40, value: percent(item.criteria?.freshness ?? item.inputs?.postingAge) },
    { label: "Amount left", weight: 30, value: percent(item.criteria?.stockAvailability ?? item.inputs?.remainingQuantity) },
    { label: "Reliability", weight: 20, value: percent(item.criteria?.sellerReliability ?? item.inputs?.sellerReliability) },
    { label: "Sells often", weight: 10, value: percent(item.criteria?.recurrence ?? item.inputs?.recurrence) },
  ];

  return (
    <View style={styles.container}>
      {factors.map((factor) => (
        <View key={factor.label} style={styles.item}>
          <View style={styles.row}>
            <Text style={styles.label}>
              {factor.label}
              <Text style={styles.weight}> · {factor.weight}% of score</Text>
            </Text>
            <Text style={styles.value}>{factor.value === null ? "—" : `${factor.value}%`}</Text>
          </View>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${factor.value ?? 0}%` }]} />
          </View>
        </View>
      ))}
      <Text style={styles.note}>Fresher, bigger, reliable listings show higher.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.surfaceMuted, borderWidth: 1, borderColor: colors.border, borderRadius: radii.card, padding: spacing.md, marginTop: spacing.md, gap: spacing.sm },
  item: { gap: 6 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  label: { fontFamily: fonts.body.semiBold, fontSize: 13, color: colors.text },
  weight: { fontFamily: fonts.body.regular, color: colors.textMuted },
  value: { fontFamily: fonts.body.semiBold, fontSize: 13, color: colors.text },
  track: { height: 6, borderRadius: 3, backgroundColor: colors.border, overflow: "hidden" },
  fill: { height: 6, borderRadius: 3, backgroundColor: colors.primary },
  note: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.sm },
});
