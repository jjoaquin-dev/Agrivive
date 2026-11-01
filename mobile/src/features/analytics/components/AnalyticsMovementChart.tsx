import React, { useMemo } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { colors, fonts, spacing } from "../../../theme";
import { cardStyles } from "../analyticsCard";
import { unitWord } from "../format";
import type { AnalyticsUnit, SellerAnalyticsMetrics } from "../types";

interface AnalyticsMovementChartProps {
  metrics: SellerAnalyticsMetrics;
  unit?: AnalyticsUnit;
}

const num = (value: string) => Math.max(0, Number(value) || 0);

/** Our bar chart: where the posted produce went. Colors match the Sales Report frames. */
export function AnalyticsMovementChart({ metrics, unit }: AnalyticsMovementChartProps) {
  const chartWidth = Math.max(Dimensions.get("window").width - 96, 240);
  const word = unitWord(unit);
  const posted = num(metrics.postedQuantity);
  const completed = num(metrics.completedQuantity);
  const reserved = num(metrics.reservedQuantity);
  const cancelled = num(metrics.cancelledQuantity);
  const expired = num(metrics.expiredQuantity);
  const available = num(metrics.availableQuantity);
  const remaining = num(metrics.remainingQuantity);

  const bars = useMemo(() => [
    { value: posted, label: "Posted", frontColor: "#D1D5DB" },
    { value: completed, label: "Picked Up", frontColor: colors.primary },
    { value: reserved, label: "Waiting", frontColor: colors.sage },
    { value: cancelled, label: "Cancelled", frontColor: colors.error },
    { value: expired, label: "Expired", frontColor: colors.warning },
  ], [posted, completed, reserved, cancelled, expired]);

  const maxValue = Math.max(posted, completed, reserved, cancelled, expired, 10);

  return (
    <View style={cardStyles.card}>
      <Text style={cardStyles.title}>Where Your Produce Went</Text>
      <Text style={cardStyles.subtitle}>Amount in {word}</Text>

      <View style={styles.chartWrapper}>
        <BarChart
          data={bars}
          barWidth={30}
          spacing={18}
          initialSpacing={8}
          roundedTop
          roundedBottom={false}
          hideRules={false}
          rulesColor="#F3F1EA"
          yAxisColor="transparent"
          xAxisColor={colors.border}
          yAxisTextStyle={styles.axisText}
          xAxisLabelTextStyle={styles.axisText}
          topLabelTextStyle={styles.topLabel}
          showValuesAsTopLabel
          maxValue={maxValue * 1.2}
          noOfSections={4}
          width={chartWidth}
          height={170}
          isAnimated
        />
      </View>

      <View style={styles.left}>
        <View style={styles.leftCopy}>
          <Text style={styles.leftTitle}>Left to Sell</Text>
          <Text style={styles.leftSub}>{available.toFixed(2)} in stock + {reserved.toFixed(2)} waiting for pickup</Text>
        </View>
        <Text style={styles.leftValue}>{remaining.toFixed(2)} {word}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chartWrapper: { alignItems: "center", overflow: "hidden", marginTop: spacing.md },
  axisText: { fontFamily: fonts.body.regular, fontSize: 10, color: colors.textMuted },
  topLabel: { fontFamily: fonts.body.semiBold, fontSize: 10, color: colors.text },
  left: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: spacing.sm, marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
  leftCopy: { flex: 1 },
  leftTitle: { fontFamily: fonts.body.medium, fontSize: 13, color: "#374151" },
  leftSub: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted, marginTop: 2 },
  leftValue: { fontFamily: fonts.heading.bold, fontSize: 16, color: colors.text },
});
