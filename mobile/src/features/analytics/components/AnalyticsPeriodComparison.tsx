import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ArrowDownRight, ArrowUpRight } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import type { AnalyticsUnit, SellerAnalyticsResponse } from "../types";

interface AnalyticsPeriodComparisonProps {
  analytics: SellerAnalyticsResponse;
  unit?: AnalyticsUnit;
}

export function AnalyticsPeriodComparison({ analytics, unit }: AnalyticsPeriodComparisonProps) {
  const { period, metrics, notComputable } = analytics;
  const unitSuffix = unit === "kilo" ? "kg" : unit ? `${unit}s` : "units";

  const change = metrics.completedQuantityChange;
  const isPos = change !== null && change > 0;
  const isNeg = change !== null && change < 0;

  const currentSold = Number(metrics.completedQuantity) || 0;
  // If change is present, calculate previous completed: current / (1 + change/100)
  const prevSold = change !== null && change !== -100
    ? (currentSold / (1 + change / 100)).toFixed(0)
    : "0";

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Period Comparison</Text>
        <Text style={styles.subtitle}>
          {period.from} to {period.to} vs {period.previousFrom} to {period.previousTo}
        </Text>
      </View>

      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.tableHeaderRow}>
          <Text style={[styles.th, styles.colMetric]}>Metric</Text>
          <Text style={[styles.th, styles.colCurrent]}>Current</Text>
          <Text style={[styles.th, styles.colPrev]}>Previous</Text>
          <Text style={[styles.th, styles.colChange]}>Variation</Text>
        </View>

        {/* Row 1: Pickups */}
        <View style={styles.tableRow}>
          <Text style={[styles.td, styles.colMetric, styles.metricName]}>Completed</Text>
          <Text style={[styles.td, styles.colCurrent]}>{metrics.completedQuantity} {unitSuffix}</Text>
          <Text style={[styles.td, styles.colPrev]}>{notComputable.completedQuantityChange ? "0" : `${prevSold} ${unitSuffix}`}</Text>
          <View style={[styles.colChange, styles.changeCell]}>
            {!notComputable.completedQuantityChange && change !== null ? (
              <View style={[styles.varPill, isPos ? styles.varPos : isNeg ? styles.varNeg : styles.varZero]}>
                {isPos ? <ArrowUpRight size={10} color="#457D00" /> : isNeg ? <ArrowDownRight size={10} color="#B85450" /> : null}
                <Text style={[styles.varText, isPos ? styles.varPosText : isNeg ? styles.varNegText : styles.varZeroText]}>
                  {change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`}
                </Text>
              </View>
            ) : (
              <Text style={styles.naText}>N/A</Text>
            )}
          </View>
        </View>

        {/* Row 2: Posted Surplus */}
        <View style={styles.tableRow}>
          <Text style={[styles.td, styles.colMetric, styles.metricName]}>Posted</Text>
          <Text style={[styles.td, styles.colCurrent]}>{metrics.postedQuantity} {unitSuffix}</Text>
          <Text style={[styles.td, styles.colPrev]}>—</Text>
          <View style={[styles.colChange, styles.changeCell]}>
            <Text style={styles.naText}>Base</Text>
          </View>
        </View>

        {/* Row 3: Revenue */}
        <View style={styles.tableRow}>
          <Text style={[styles.td, styles.colMetric, styles.metricName]}>Revenue</Text>
          <Text style={[styles.td, styles.colCurrent]}>₱{Number(metrics.completedSalesTotal).toFixed(0)}</Text>
          <Text style={[styles.td, styles.colPrev]}>—</Text>
          <View style={[styles.colChange, styles.changeCell]}>
            <Text style={styles.naText}>—</Text>
          </View>
        </View>

        {/* Row 4: Sell-Through */}
        <View style={[styles.tableRow, styles.lastRow]}>
          <Text style={[styles.td, styles.colMetric, styles.metricName]}>Conversion</Text>
          <Text style={[styles.td, styles.colCurrent]}>
            {notComputable.sellThroughRate || metrics.sellThroughRate === null ? "N/A" : `${metrics.sellThroughRate.toFixed(1)}%`}
          </Text>
          <Text style={[styles.td, styles.colPrev]}>—</Text>
          <View style={[styles.colChange, styles.changeCell]}>
            <Text style={styles.naText}>—</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
    marginBottom: spacing.base,
  },
  header: { marginBottom: spacing.md },
  title: { fontFamily: fonts.heading.bold, fontSize: 16, color: colors.text },
  subtitle: { fontFamily: fonts.body.regular, fontSize: 11, color: colors.textMuted, marginTop: 2 },
  table: { borderWidth: 1, borderColor: colors.border, borderRadius: radii.input, overflow: "hidden" },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: colors.surfaceMuted,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  th: { fontFamily: fonts.body.semiBold, fontSize: 11, color: colors.textMuted },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceMuted,
  },
  lastRow: { borderBottomWidth: 0 },
  td: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.text },
  colMetric: { flex: 1.2 },
  colCurrent: { flex: 1.2, textAlign: "left" },
  colPrev: { flex: 1, textAlign: "left" },
  colChange: { flex: 1, alignItems: "flex-end" },
  metricName: { fontFamily: fonts.body.semiBold, color: colors.text },
  changeCell: { justifyContent: "center" },
  varPill: { flexDirection: "row", alignItems: "center", gap: 2, paddingHorizontal: 5, paddingVertical: 1, borderRadius: radii.full },
  varPos: { backgroundColor: "rgba(22, 163, 74, 0.1)" },
  varNeg: { backgroundColor: "rgba(220, 38, 38, 0.1)" },
  varZero: { backgroundColor: colors.surfaceMuted },
  varText: { fontFamily: fonts.body.semiBold, fontSize: 10 },
  varPosText: { color: "#457D00" },
  varNegText: { color: "#B85450" },
  varZeroText: { color: colors.textMuted },
  naText: { fontFamily: fonts.body.regular, fontSize: 11, color: colors.textMuted },
});
