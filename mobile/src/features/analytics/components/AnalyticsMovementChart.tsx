import React, { useMemo } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { colors, fonts, radii, spacing } from "../../../theme";
import type { AnalyticsUnit, SellerAnalyticsMetrics } from "../types";

interface AnalyticsMovementChartProps {
  metrics: SellerAnalyticsMetrics;
  unit?: AnalyticsUnit;
}

export function AnalyticsMovementChart({ metrics, unit }: AnalyticsMovementChartProps) {
  const screenWidth = Dimensions.get("window").width;
  const chartWidth = Math.max(screenWidth - 80, 260);

  const posted = Math.max(0, Number(metrics.postedQuantity) || 0);
  const completed = Math.max(0, Number(metrics.completedQuantity) || 0);
  const reserved = Math.max(0, Number(metrics.reservedQuantity) || 0);
  const available = Math.max(0, Number(metrics.availableQuantity) || 0);
  const unclaimed = Math.max(0, (Number(metrics.cancelledQuantity) || 0) + (Number(metrics.expiredQuantity) || 0));

  const unitSuffix = unit === "kilo" ? "kg" : unit ? `${unit}s` : "units";

  const barData = useMemo(() => [
    { value: posted, label: "Posted", frontColor: "#16A34A" },
    { value: completed, label: "Sold", frontColor: "#059669" },
    { value: reserved, label: "Reserved", frontColor: "#0284C7" },
    { value: available, label: "Stock", frontColor: "#D97706" },
    { value: unclaimed, label: "Unclaimed", frontColor: "#DC2626" },
  ], [posted, completed, reserved, available, unclaimed]);

  const maxValue = Math.max(posted, completed, reserved, available, unclaimed, 10);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Surplus Volume Flow</Text>
        <Text style={styles.subtitle}>Volume movement by category ({unitSuffix})</Text>
      </View>

      <View style={styles.chartWrapper}>
        <BarChart
          data={barData}
          barWidth={32}
          spacing={24}
          roundedTop
          roundedBottom={false}
          hideRules={false}
          rulesColor="#F3F4F6"
          yAxisColor="transparent"
          xAxisColor="#E5E7EB"
          yAxisTextStyle={styles.axisText}
          xAxisLabelTextStyle={styles.axisText}
          maxValue={maxValue * 1.15}
          noOfSections={4}
          width={chartWidth}
          height={180}
          isAnimated
        />
      </View>

      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#16A34A" }]} />
          <Text style={styles.legendLabel}>Posted: {posted.toFixed(0)}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#059669" }]} />
          <Text style={styles.legendLabel}>Sold: {completed.toFixed(0)}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#0284C7" }]} />
          <Text style={styles.legendLabel}>Reserved: {reserved.toFixed(0)}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#D97706" }]} />
          <Text style={styles.legendLabel}>Stock: {available.toFixed(0)}</Text>
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
  subtitle: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted, marginTop: 2 },
  chartWrapper: { alignItems: "center", overflow: "hidden", marginVertical: spacing.xs },
  axisText: { fontFamily: fonts.body.regular, fontSize: 10, color: colors.textMuted },
  legendRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceMuted,
    gap: spacing.xs,
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: radii.full },
  legendLabel: { fontFamily: fonts.body.medium, fontSize: 11, color: colors.text },
});
