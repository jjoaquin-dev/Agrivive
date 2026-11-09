import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { colors, fonts, spacing } from "../../../theme";
import { cardStyles } from "../analyticsCard";
import { percentText } from "../breakdown";
import { AnalyticsTapCard } from "./AnalyticsTapCard";

const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const full = ["Sundays", "Mondays", "Tuesdays", "Wednesdays", "Thursdays", "Fridays", "Saturdays"];

/** Pickups for each day of the week. The busiest day is dark green, so it stands out first. */
export function AnalyticsBusyDays({ counts }: { counts: number[] }) {
  const max = Math.max(...counts, 0);
  const best = max > 0 ? counts.indexOf(max) : -1;
  const total = counts.reduce((a, c) => a + c, 0);
  const rows = counts.map((count, day) => ({ label: full[day], value: `${count} pickup${count === 1 ? "" : "s"} · ${percentText(count, total)}`, strong: day === best }));
  const chartWidth = Math.max(Dimensions.get("window").width - 110, 220);
  const data = counts.map((count, day) => ({ value: count, label: names[day], frontColor: day === best ? colors.primary : "#B7D3C3" }));

  return (
    <AnalyticsTapCard title="Busy Days" subtitle="Pickups for each day of the week." rows={rows}>
      <View style={cardStyles.card}>
        <Text style={cardStyles.title}>Busy Days</Text>
        <Text style={cardStyles.subtitle}>{best >= 0 ? `Most pickups happen on ${full[best]}.` : "No pickups in these days yet."}</Text>
        <View style={styles.chartWrapper}>
          <BarChart
            key={data.map((d: { value: number }) => d.value).join(",")}
            data={data}
            barWidth={26}
            spacing={Math.max(6, Math.floor((chartWidth - 7 * 26 - 8) / 7))}
            initialSpacing={6}
            roundedTop
            hideRules={false}
            rulesColor="#F3F1EA"
            yAxisColor="transparent"
            xAxisColor={colors.border}
            yAxisTextStyle={styles.axisText}
            xAxisLabelTextStyle={styles.axisText}
            topLabelTextStyle={styles.topLabel}
            showValuesAsTopLabel
            maxValue={Math.max(max, 4) * 1.3}
            noOfSections={4}
            width={chartWidth}
            height={130}
              />
        </View>
      </View>
    </AnalyticsTapCard>
  );
}

const styles = StyleSheet.create({
  chartWrapper: { alignItems: "center", overflow: "hidden", marginTop: spacing.md },
  axisText: { fontFamily: fonts.body.regular, fontSize: 10, color: colors.textMuted },
  topLabel: { fontFamily: fonts.body.semiBold, fontSize: 10, color: colors.text },
});
