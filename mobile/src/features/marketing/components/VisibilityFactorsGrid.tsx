import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import type { SellerVisibilityItem } from "../api/seller-visibility";
import { formatPeso } from "../../../utils/money";

interface VisibilityFactorsGridProps {
  item: SellerVisibilityItem;
}

const fallbackWeights = { postingAge: 0.3507, priceDrop: 0.3507, stockLevel: 0.1892, sellerReliability: 0.1093 };

function barPercent(value: number | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? Math.round(Math.min(1, Math.max(0, value)) * 100) : 0;
}

function hoursText(hours: number | undefined) {
  if (typeof hours !== "number") return "—";
  return hours < 1 ? "Under 1 hour" : `${Math.floor(hours)} hr`;
}

/** The four things that decide how high a listing shows, biggest weight first. The bar shows how this listing compares with the others. */
export function VisibilityFactorsGrid({ item }: VisibilityFactorsGridProps) {
  const raw = item.criteria ?? item.inputs;
  const weights = item.weights ?? fallbackWeights;
  const bars = item.normalizedCriteria;
  const factors = [
    { label: "Time Posted", weight: weights.postingAge, bar: bars?.postingAge, text: hoursText(raw?.postingAge) },
    { label: "Price Drop", weight: weights.priceDrop, bar: bars?.priceDrop, text: raw ? `${formatPeso(raw.priceDrop)}` : "—" },
    { label: "Amount left", weight: weights.stockLevel, bar: bars?.stockLevel, text: raw ? `${Number(raw.stockLevel.toFixed(2))}` : "—" },
    { label: "Reliability", weight: weights.sellerReliability, bar: bars?.sellerReliability, text: raw ? `${raw.sellerReliability.toFixed(1)} / 5` : "—" },
  ];

  return (
    <View style={styles.container}>
      {factors.map((factor) => (
        <View key={factor.label} style={styles.item}>
          <View style={styles.row}>
            <Text style={styles.label}>
              {factor.label}
              <Text style={styles.weight}> · Counts for {Math.round(factor.weight * 100)}%</Text>
            </Text>
            <Text style={styles.value}>{factor.text}</Text>
          </View>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${barPercent(factor.bar)}%` }]} />
          </View>
        </View>
      ))}
      <Text style={styles.note}>Older listings, bigger price drops, more stock and better ratings show higher.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.surfaceMuted, borderWidth: 1, borderColor: colors.border, borderRadius: radii.card, padding: spacing.md, marginTop: spacing.md, gap: spacing.sm },
  item: { gap: 8 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  label: { fontFamily: fonts.body.semiBold, fontSize: 13, color: colors.text },
  weight: { fontFamily: fonts.body.regular, color: colors.textMuted },
  value: { fontFamily: fonts.body.semiBold, fontSize: 13, color: colors.text },
  track: { height: 6, borderRadius: 4, backgroundColor: colors.border, overflow: "hidden" },
  fill: { height: 6, borderRadius: 4, backgroundColor: colors.primary },
  note: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.sm },
});
