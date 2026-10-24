import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { fonts } from "../../../theme";
import type { Product } from "../../inventory/types";

interface DashboardAnalyticsChartProps {
  products: Product[];
}

export const DashboardAnalyticsChart: React.FC<DashboardAnalyticsChartProps> = ({
  products,
}) => {
  const chartItems = products.slice(0, 4).map((p) => {
    const qty = parseFloat(String(p.productQty || "0"));
    const orig = parseFloat(String(p.originalQty || p.productQty || "0"));
    const sold = Math.max(0, orig - qty);
    const maxVal = Math.max(orig, 1);
    const soldHeightPct = Math.min(100, Math.round((sold / maxVal) * 100));
    return {
      name: p.productName.split(" ")[0],
      soldPct: Math.max(15, soldHeightPct),
    };
  });

  const displayBars = chartItems.length > 0 ? chartItems : [
    { name: "Cabbage", soldPct: 90 },
    { name: "Tomato", soldPct: 45 },
    { name: "Pechay", soldPct: 75 },
    { name: "Carrot", soldPct: 55 },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.chartTitle}>Posted vs. Sold by Vegetable</Text>
      <View style={styles.chartContainer}>
        <View style={styles.chartYAxis}>
          <Text style={styles.axisLabel}>100</Text>
          <Text style={styles.axisLabel}>75</Text>
          <Text style={styles.axisLabel}>50</Text>
          <Text style={styles.axisLabel}>25</Text>
          <Text style={styles.axisLabel}>0</Text>
        </View>

        <View style={styles.chartBarsArea}>
          {displayBars.map((item, idx) => (
            <View key={idx} style={styles.barCol}>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { height: `${item.soldPct}%` }]} />
              </View>
              <Text style={styles.barName} numberOfLines={1}>{item.name}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#A7F3D0" }]} />
          <Text style={styles.legendText}>Posted</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#16A34A" }]} />
          <Text style={styles.legendText}>Sold</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
  },
  chartTitle: {
    fontFamily: fonts.body.semiBold,
    fontSize: 12,
    color: "#1E293B",
    marginBottom: 8,
  },
  chartContainer: {
    flexDirection: "row",
    height: 110,
    marginBottom: 8,
  },
  chartYAxis: {
    justifyContent: "space-between",
    paddingRight: 8,
    paddingVertical: 2,
  },
  axisLabel: {
    fontFamily: fonts.body.regular,
    fontSize: 9,
    color: "#94A3B8",
  },
  chartBarsArea: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    borderBottomWidth: 1,
    borderColor: "#E2E8F0",
    paddingBottom: 4,
  },
  barCol: {
    alignItems: "center",
    width: 34,
  },
  barTrack: {
    width: 14,
    height: 90,
    backgroundColor: "#E2E8F0",
    borderRadius: 7,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  barFill: {
    width: "100%",
    backgroundColor: "#16A34A",
    borderRadius: 7,
  },
  barName: {
    fontFamily: fonts.body.regular,
    fontSize: 9,
    color: "#64748B",
    marginTop: 4,
  },
  legendRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontFamily: fonts.body.regular,
    fontSize: 11,
    color: "#64748B",
  },
});
