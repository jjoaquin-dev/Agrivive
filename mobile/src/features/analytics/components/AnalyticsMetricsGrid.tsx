import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  CheckCircle2,
  Clock,
  Leaf,
  PackageCheck,
  RefreshCw,
  TrendingUp,
} from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import type { AnalyticsUnit, SellerAnalyticsMetrics } from "../types";

interface AnalyticsMetricsGridProps {
  metrics: SellerAnalyticsMetrics;
  unit?: AnalyticsUnit;
  sellThroughNotComputable: boolean;
  changeNotComputable: boolean;
}

export function AnalyticsMetricsGrid({
  metrics,
  unit,
  sellThroughNotComputable,
  changeNotComputable,
}: AnalyticsMetricsGridProps) {
  const unitSuffix = unit === "kilo" ? "kg" : unit ? `${unit}s` : "units";
  const revenueFormatted = Number(metrics.completedSalesTotal || 0).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const change = metrics.completedQuantityChange;
  const isPositiveChange = change !== null && change > 0;
  const isNegativeChange = change !== null && change < 0;

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Key Performance</Text>
        <Text style={styles.sectionTag}>Actual metrics</Text>
      </View>

      <View style={styles.grid}>
        {/* 1. Posted Produce */}
        <View style={styles.card}>
          <View style={[styles.iconCircle, { backgroundColor: "rgba(22, 163, 74, 0.12)" }]}>
            <Leaf size={18} color="#16A34A" />
          </View>
          <Text style={styles.metricValue}>{metrics.postedQuantity} {unitSuffix}</Text>
          <Text style={styles.metricLabel}>Posted Produce</Text>
          <Text style={styles.metricSubtext}>Declared surplus batches</Text>
        </View>

        {/* 2. Completed Pickups */}
        <View style={styles.card}>
          <View style={[styles.iconCircle, { backgroundColor: "rgba(5, 150, 105, 0.12)" }]}>
            <CheckCircle2 size={18} color="#059669" />
          </View>
          <Text style={styles.metricValue}>{metrics.completedQuantity} {unitSuffix}</Text>
          <Text style={styles.metricLabel}>Completed Pickups</Text>
          {!changeNotComputable && change !== null ? (
            <View style={[styles.trendBadge, isPositiveChange ? styles.trendPos : isNegativeChange ? styles.trendNeg : styles.trendNeutral]}>
              {isPositiveChange ? <ArrowUpRight size={12} color="#16A34A" /> : isNegativeChange ? <ArrowDownRight size={12} color="#DC2626" /> : null}
              <Text style={[styles.trendText, isPositiveChange ? styles.trendPosText : isNegativeChange ? styles.trendNegText : styles.trendNeutralText]}>
                {change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`} vs prev
              </Text>
            </View>
          ) : (
            <Text style={styles.metricSubtext}>Collected by buyers</Text>
          )}
        </View>

        {/* 3. Sell-Through Rate */}
        <View style={styles.card}>
          <View style={[styles.iconCircle, { backgroundColor: "rgba(79, 70, 229, 0.12)" }]}>
            <TrendingUp size={18} color="#4F46E5" />
          </View>
          <Text style={styles.metricValue}>
            {sellThroughNotComputable || metrics.sellThroughRate === null ? "N/A" : `${metrics.sellThroughRate.toFixed(1)}%`}
          </Text>
          <Text style={styles.metricLabel}>Sell-Through Rate</Text>
          <Text style={styles.metricSubtext}>Volume conversion rate</Text>
        </View>

        {/* 4. Gross Sales Value */}
        <View style={styles.card}>
          <View style={[styles.iconCircle, { backgroundColor: "rgba(217, 119, 6, 0.12)" }]}>
            <Banknote size={18} color="#D97706" />
          </View>
          <Text style={styles.metricValue} numberOfLines={1}>₱{revenueFormatted}</Text>
          <Text style={styles.metricLabel}>Gross Sales Value</Text>
          <Text style={styles.metricSubtext}>From completed pickups</Text>
        </View>

        {/* 5. Available Surplus */}
        <View style={styles.card}>
          <View style={[styles.iconCircle, { backgroundColor: "rgba(2, 132, 199, 0.12)" }]}>
            <PackageCheck size={18} color="#0284C7" />
          </View>
          <Text style={styles.metricValue}>{metrics.availableQuantity} {unitSuffix}</Text>
          <Text style={styles.metricLabel}>Available Surplus</Text>
          <Text style={styles.metricSubtext}>Active in marketplace</Text>
        </View>

        {/* 6. Reserved Produce */}
        <View style={styles.card}>
          <View style={[styles.iconCircle, { backgroundColor: "rgba(234, 88, 12, 0.12)" }]}>
            <Clock size={18} color="#EA580C" />
          </View>
          <Text style={styles.metricValue}>{metrics.reservedQuantity} {unitSuffix}</Text>
          <Text style={styles.metricLabel}>Reserved Produce</Text>
          <Text style={styles.metricSubtext}>Pending pickup pass</Text>
        </View>

        {/* 7. Repeat Listings */}
        <View style={styles.card}>
          <View style={[styles.iconCircle, { backgroundColor: "rgba(13, 148, 136, 0.12)" }]}>
            <RefreshCw size={18} color="#0D9488" />
          </View>
          <Text style={styles.metricValue}>{metrics.recurringListings} cycles</Text>
          <Text style={styles.metricLabel}>Repeat Listings</Text>
          <Text style={styles.metricSubtext}>Relisted produce cycles</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.base },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.sm },
  sectionTitle: { fontFamily: fonts.heading.bold, fontSize: 16, color: colors.text },
  sectionTag: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  card: {
    width: "48.5%",
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    minHeight: 128,
    justifyContent: "space-between",
  },
  iconCircle: { width: 34, height: 34, borderRadius: radii.full, alignItems: "center", justifyContent: "center", marginBottom: 6 },
  metricValue: { fontFamily: fonts.heading.bold, fontSize: 17, lineHeight: 22, color: colors.text },
  metricLabel: { fontFamily: fonts.body.semiBold, fontSize: 12, color: colors.textMuted, marginTop: 2 },
  metricSubtext: { fontFamily: fonts.body.regular, fontSize: 11, color: colors.textMuted, marginTop: 2 },
  trendBadge: { flexDirection: "row", alignItems: "center", gap: 2, paddingHorizontal: 6, paddingVertical: 2, borderRadius: radii.full, alignSelf: "flex-start", marginTop: 4 },
  trendPos: { backgroundColor: "rgba(22, 163, 74, 0.1)" },
  trendNeg: { backgroundColor: "rgba(220, 38, 38, 0.1)" },
  trendNeutral: { backgroundColor: colors.surfaceMuted },
  trendText: { fontFamily: fonts.body.semiBold, fontSize: 10 },
  trendPosText: { color: "#16A34A" },
  trendNegText: { color: "#DC2626" },
  trendNeutralText: { color: colors.textMuted },
});
