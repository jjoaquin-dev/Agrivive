import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import { cardStyles } from "../analyticsCard";
import { formatRange, unitWord } from "../format";
import type { AnalyticsUnit, SellerAnalyticsMetrics } from "../types";

interface AnalyticsMetricsGridProps {
  metrics: SellerAnalyticsMetrics;
  unit?: AnalyticsUnit;
  previousPeriod: { from: string; to: string };
  sellThroughNotComputable: boolean;
  changeNotComputable: boolean;
}

const peso = (value: string | number) =>
  `₱${Number(value || 0).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** The two headline cards: what sold, and how much of what was posted sold. */
export function AnalyticsMetricsGrid({ metrics, unit, previousPeriod, sellThroughNotComputable, changeNotComputable }: AnalyticsMetricsGridProps) {
  const word = unitWord(unit);
  const change = changeNotComputable ? null : metrics.completedQuantityChange;
  const up = change !== null && change > 0;
  const down = change !== null && change < 0;
  const rate = sellThroughNotComputable ? null : metrics.sellThroughRate;

  return (
    <>
      <View style={cardStyles.card}>
        <Text style={cardStyles.title}>Sold</Text>
        <Text style={styles.big}>{metrics.completedQuantity} {word}</Text>
        <Text style={styles.earned}>{peso(metrics.completedSalesTotal)} earned from pickups</Text>
        {change !== null ? (
          <View style={[styles.trend, { backgroundColor: up ? "#DCFCE7" : down ? "#FEF2F2" : "#F3F1EA" }]}>
            <Text style={[styles.trendText, { color: up ? colors.success : down ? colors.error : colors.textMuted }]}>
              {up ? "▲" : down ? "▼" : "–"} {Math.abs(change).toFixed(1)}%{" "}
              <Text style={styles.trendNote}>vs {formatRange(previousPeriod.from, previousPeriod.to)}</Text>
            </Text>
          </View>
        ) : null}
      </View>

      <View style={cardStyles.card}>
        <Text style={cardStyles.title}>How Much Sold</Text>
        <View style={styles.rateRow}>
          <Text style={styles.rate}>{rate === null ? "N/A" : `${rate.toFixed(0)}%`}</Text>
          <Text style={styles.rateNote}>{metrics.completedQuantity} of {metrics.postedQuantity} {word} posted</Text>
        </View>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${Math.min(100, Math.max(0, rate ?? 0))}%` }]} />
        </View>
        <Text style={styles.caption}>{rate === null ? "Nothing was posted in these days." : "Share of posted produce that was picked up"}</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  big: { fontFamily: fonts.heading.bold, fontSize: 28, lineHeight: 34, color: colors.text, marginTop: 4 },
  earned: { fontFamily: fonts.body.medium, fontSize: 15, lineHeight: 22, color: colors.text, marginTop: 4 },
  trend: { alignSelf: "flex-start", borderRadius: 8, paddingHorizontal: spacing.sm, paddingVertical: 4, marginTop: spacing.sm },
  trendText: { fontFamily: fonts.body.semiBold, fontSize: 12 },
  trendNote: { fontFamily: fonts.body.medium, color: "#386600" },
  rateRow: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.sm },
  rate: { fontFamily: fonts.heading.bold, fontSize: 22, color: colors.primary },
  rateNote: { fontFamily: fonts.body.medium, fontSize: 14, color: colors.text },
  track: { height: 8, borderRadius: 4, backgroundColor: colors.border, overflow: "hidden", marginTop: spacing.sm },
  fill: { height: "100%", borderRadius: 4, backgroundColor: colors.primary },
  caption: { fontFamily: fonts.body.medium, fontSize: 12, color: colors.textMuted, marginTop: 6 },
});
