import React, { useMemo, useState } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BarChart, LineChart } from "react-native-gifted-charts";
import { colors, fonts, radii, spacing } from "../../../theme";
import type { AnalyticsUnit, SellerAnalyticsMetrics } from "../types";

interface AnalyticsMovementChartProps {
  metrics: SellerAnalyticsMetrics;
  unit?: AnalyticsUnit;
}

export function AnalyticsMovementChart({ metrics, unit }: AnalyticsMovementChartProps) {
  const [chartMode, setChartMode] = useState<"bar" | "line">("bar");
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

  const lineData = useMemo(() => [
    { value: posted, label: "Posted" },
    { value: reserved, label: "Reserved" },
    { value: completed, label: "Sold" },
    { value: available, label: "Available" },
  ], [posted, reserved, completed, available]);

  const maxValue = Math.max(posted, completed, reserved, available, unclaimed, 10);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleColumn}>
          <Text style={styles.title}>Surplus Volume Flow</Text>
          <Text style={styles.subtitle}>Actual volume movement in {unitSuffix}</Text>
        </View>
        <View style={styles.toggleRow}>
          <TouchableOpacity
            onPress={() => setChartMode("bar")}
            style={[styles.toggleBtn, chartMode === "bar" && styles.toggleBtnActive]}
          >
            <Text style={[styles.toggleText, chartMode === "bar" && styles.toggleTextActive]}>Bar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setChartMode("line")}
            style={[styles.toggleBtn, chartMode === "line" && styles.toggleBtnActive]}
          >
            <Text style={[styles.toggleText, chartMode === "line" && styles.toggleTextActive]}>Trend</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.chartWrapper}>
        {chartMode === "bar" ? (
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
        ) : (
          <LineChart
            data={lineData}
            color="#16A34A"
            thickness={3}
            curved
            areaChart
            startFillColor="rgba(22, 163, 74, 0.28)"
            endFillColor="rgba(22, 163, 74, 0.02)"
            dataPointsColor="#16A34A"
            dataPointsRadius={5}
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
        )}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  titleColumn: { flex: 1, marginRight: spacing.sm },
  title: { fontFamily: fonts.heading.bold, fontSize: 16, color: colors.text },
  subtitle: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted, marginTop: 2 },
  toggleRow: {
    flexDirection: "row",
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.button,
    padding: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  toggleBtn: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: radii.input },
  toggleBtnActive: { backgroundColor: colors.white },
  toggleText: { fontFamily: fonts.body.medium, fontSize: 12, color: colors.textMuted },
  toggleTextActive: { fontFamily: fonts.body.semiBold, color: colors.primary },
  chartWrapper: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xs,
    overflow: "hidden",
  },
  axisText: { fontFamily: fonts.body.regular, fontSize: 10, color: colors.textMuted },
  legendRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: spacing.md,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { fontFamily: fonts.body.medium, fontSize: 11, color: colors.textMuted },
});
