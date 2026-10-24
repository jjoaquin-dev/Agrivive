import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import type { SellerVisibilityItem } from "../api/seller-visibility";

interface VisibilityFactorsGridProps {
  item: SellerVisibilityItem;
}

function factorPercent(value: number | undefined) {
  return typeof value === "number" && Number.isFinite(value)
    ? `${(value * 100).toFixed(0)}%`
    : "Not available";
}

export function VisibilityFactorsGrid({ item }: VisibilityFactorsGridProps) {
  const freshness = item.criteria?.freshness ?? item.inputs?.postingAge;
  const stock = item.criteria?.stockAvailability ?? item.inputs?.remainingQuantity;
  const reliability = item.criteria?.sellerReliability ?? item.inputs?.sellerReliability;
  const recurrence = item.criteria?.recurrence ?? item.inputs?.recurrence;

  // Criteria sorted strictly from highest visibility weight to lowest
  const factors = [
    { label: "Freshness (Recency)", weight: "40% WT", value: factorPercent(freshness), maxPts: "0.40 pts max" },
    { label: "Available Stock", weight: "30% WT", value: factorPercent(stock), maxPts: "0.30 pts max" },
    { label: "Seller Reliability", weight: "20% WT", value: factorPercent(reliability), maxPts: "0.20 pts max" },
    { label: "Surplus Recurrence", weight: "10% WT", value: factorPercent(recurrence), maxPts: "0.10 pts max" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Evaluation Criteria (Highest Weight at Top)</Text>
      <View style={styles.grid}>
        {factors.map((f, i) => (
          <View key={i} style={styles.item}>
            <View style={styles.row}>
              <Text style={styles.label}>{f.label}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{f.weight}</Text>
              </View>
            </View>
            <Text style={styles.value}>{f.value}</Text>
            <Text style={styles.subtext}>{f.maxPts}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
  },
  headerTitle: {
    fontFamily: fonts.body.medium,
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  item: {
    width: "48%",
    backgroundColor: colors.background,
    borderRadius: radii.input,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontFamily: fonts.body.medium,
    fontSize: 11,
    color: colors.textMuted,
    flex: 1,
  },
  badge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: radii.sm,
  },
  badgeText: {
    fontFamily: fonts.body.semiBold,
    fontSize: 9,
    color: colors.primary,
  },
  value: {
    fontFamily: fonts.heading.bold,
    fontSize: 15,
    color: colors.text,
    marginTop: 2,
  },
  subtext: {
    fontFamily: fonts.body.regular,
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 1,
  },
});
