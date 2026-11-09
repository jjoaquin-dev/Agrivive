import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { colors, fonts, spacing } from "../../../theme";
import { cardStyles } from "../analyticsCard";
import { orderRows } from "../breakdown";
import type { SellerAnalyticsInsights } from "../types";
import { AnalyticsTapCard } from "./AnalyticsTapCard";

/** A ring split by how each order ended. Counts orders, not amounts. */
export function AnalyticsOrderResults({ orders }: { orders: SellerAnalyticsInsights["orders"] }) {
  const waiting = Math.max(0, orders.placed - orders.pickedUp - orders.cancelled - orders.expired - orders.declined);
  const parts = [
    { label: "Picked up", value: orders.pickedUp, color: colors.primary },
    { label: "Cancelled", value: orders.cancelled, color: "#EF4444" },
    { label: "Expired", value: orders.expired, color: "#F59E0B" },
    { label: "Declined", value: orders.declined, color: "#9CA3AF" },
    { label: "Not finished", value: waiting, color: "#93C5FD" },
  ];
  return (
    <AnalyticsTapCard title="Order Results" subtitle="How the orders placed in these days ended." rows={orderRows(orders)}>
      <View style={cardStyles.card}>
        <Text style={cardStyles.title}>Order Results</Text>
        <Text style={cardStyles.subtitle}>{orders.placed === 0 ? "No orders were placed in these days." : `${orders.placed} orders placed. Tap for the numbers.`}</Text>
        {orders.placed > 0 ? (
          <View style={styles.donut}>
            <PieChart
              data={parts.filter((p) => p.value > 0).map((p) => ({ value: p.value, color: p.color }))}
              donut
              radius={80}
              innerRadius={52}
              innerCircleColor={colors.surface}
              isAnimated
              centerLabelComponent={() => (
                <View style={styles.center}><Text style={styles.centerValue}>{orders.placed}</Text><Text style={styles.centerNote}>orders</Text></View>
              )}
            />
          </View>
        ) : null}
        <View style={styles.legend}>
          {parts.filter((p) => p.value > 0).map((p) => (
            <View key={p.label} style={styles.item}><View style={[styles.dot, { backgroundColor: p.color }]} /><Text style={styles.text}>{p.label} {p.value}</Text></View>
          ))}
        </View>
      </View>
    </AnalyticsTapCard>
  );
}

const styles = StyleSheet.create({
  donut: { alignItems: "center", marginTop: spacing.md },
  center: { alignItems: "center" },
  centerValue: { fontFamily: fonts.heading.bold, fontSize: 24, color: colors.text },
  centerNote: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted },
  legend: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md, marginTop: spacing.md },
  item: { flexDirection: "row", alignItems: "center", gap: 6 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  text: { fontFamily: fonts.body.medium, fontSize: 13, color: colors.text },
});
