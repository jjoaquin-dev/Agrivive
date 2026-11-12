import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Dimensions } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { colors, fonts, spacing } from "../../../theme";
import { cardStyles } from "../analyticsCard";
import { pesoText } from "../breakdown";
import { parseKey } from "../dateRange";
import type { SellerAnalyticsInsights } from "../types";
import { AnalyticsDetailSheet } from "./AnalyticsDetailSheet";

const MAX_BARS = 31;
const short = (n: number) => (n >= 1000 ? `₱${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : `₱${Math.round(n)}`);
const dayText = (key: string) => parseKey(key).toLocaleDateString([], { month: "short", day: "numeric" });

/** Money earned each day. Long periods are grouped so the bars stay readable. */
export function AnalyticsDailySales({ days }: { days: SellerAnalyticsInsights["dailySales"] }) {
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);
  const bars = useMemo(() => {
    const size = Math.ceil(days.length / MAX_BARS) || 1;
    const out: { from: string; to: string; sales: number; pickups: number }[] = [];
    for (let i = 0; i < days.length; i += size) {
      const chunk = days.slice(i, i + size);
      out.push({ from: chunk[0].date, to: chunk[chunk.length - 1].date, sales: chunk.reduce((a, d) => a + d.sales, 0), pickups: chunk.reduce((a, d) => a + d.pickups, 0) });
    }
    return out;
  }, [days]);
  const max = Math.max(...bars.map((b) => b.sales), 0);
  const total = bars.reduce((a, b) => a + b.sales, 0);
  const best = max > 0 ? bars.find((b) => b.sales === max) : undefined;
  const label = (b: { from: string; to: string }) => (b.from === b.to ? dayText(b.from) : `${dayText(b.from)} – ${dayText(b.to)}`);
  const chartWidth = Math.max(Dimensions.get("window").width - 120, 220);
  const gap = bars.length > 20 ? 3 : 8;
  const barWidth = Math.max(4, Math.min(30, Math.floor((chartWidth - 8 - bars.length * gap) / bars.length)));
  const data = bars.map((bar, i) => ({
    value: bar.sales,
    frontColor: bar.sales === 0 ? colors.border : picked === i || (picked === null && bar === best) ? colors.primary : colors.sage,
    label: i === 0 || i === bars.length - 1 || i === Math.floor(bars.length / 2) ? dayText(bar.from) : "",
    labelWidth: 48,
    onPress: () => setPicked(picked === i ? null : i),
  }));
  const shown = picked !== null ? bars[picked] : null;
  const ranked = [...bars].filter((b) => b.sales > 0).sort((a, b) => b.sales - a.sales).slice(0, 8);

  return (
    <View style={cardStyles.card}>
      <Pressable onPress={() => setOpen(true)} accessibilityRole="button" accessibilityLabel="Money by day. Shows the breakdown">
        <Text style={cardStyles.title}>Money By Day</Text>
        <Text style={cardStyles.subtitle}>{shown ? `${label(shown)}: ${pesoText(shown.sales)} from ${shown.pickups} pickup${shown.pickups === 1 ? "" : "s"}` : "Money earned from pickups each day. Tap a bar to see its day."}</Text>
      </Pressable>
      <View style={styles.chartWrapper}>
        <BarChart
          key={data.map((d) => d.value).join(",")}
          data={data}
          barWidth={barWidth}
          spacing={gap}
          initialSpacing={4}
          roundedTop
          hideRules={false}
          rulesColor={colors.surfaceMuted}
          yAxisColor="transparent"
          xAxisColor={colors.border}
          yAxisTextStyle={styles.axisText}
          xAxisLabelTextStyle={styles.axisText}
          formatYLabel={(v: string) => short(Number(v))}
          maxValue={Math.max(max, 10) * 1.2}
          noOfSections={4}
          yAxisLabelWidth={44}
          width={chartWidth}
          height={150}
          />
      </View>
      <AnalyticsDetailSheet visible={open} title="Money By Day" subtitle="Your best days in these dates." onClose={() => setOpen(false)}
        rows={[{ label: "Total earned", value: pesoText(total), strong: true }, ...ranked.map((b) => ({ label: label(b), value: `${pesoText(b.sales)} · ${b.pickups} pickup${b.pickups === 1 ? "" : "s"}` })),
          ...(ranked.length === 0 ? [{ label: "No pickups in these days yet", value: "" }] : [])]} />
    </View>
  );
}

const styles = StyleSheet.create({
  chartWrapper: { alignItems: "center", overflow: "hidden", marginTop: spacing.md },
  axisText: { fontFamily: fonts.body.regular, fontSize: 10, color: colors.textMuted },
});
