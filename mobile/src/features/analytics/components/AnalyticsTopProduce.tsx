import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fonts, spacing } from "../../../theme";
import { cardStyles } from "../analyticsCard";
import { pesoText, percentText } from "../breakdown";
import type { SellerAnalyticsInsights } from "../types";
import { AnalyticsDetailSheet } from "./AnalyticsDetailSheet";

const unitLabel = (unit: string, qty: number) => `${unit}${qty === 1 ? "" : "s"}`;

/** Which produce earned the most in these days, with a bar next to each so sizes compare at a glance. */
export function AnalyticsTopProduce({ items }: { items: SellerAnalyticsInsights["topProduce"] }) {
  const max = Math.max(...items.map((i) => i.sales), 1);
  const total = items.reduce((a, i) => a + i.sales, 0);
  const [open, setOpen] = useState<number | null>(null);
  const item = open !== null ? items[open] : null;
  return (
    <View style={cardStyles.card}>
      <Text style={cardStyles.title}>Best Sellers</Text>
      <Text style={cardStyles.subtitle}>Produce that earned the most from pickups in these days.</Text>
      {items.length === 0 ? <Text style={styles.empty}>No pickups in these days yet.</Text> : items.map((item, index) => (
        <Pressable key={`${item.name}-${index}`} onPress={() => setOpen(index)} accessibilityRole="button" accessibilityHint="Shows the breakdown" style={styles.row}>
          <View style={styles.head}>
            <Text style={styles.name} numberOfLines={1}>{index + 1}. {item.name}</Text>
            <Text style={styles.money}>{pesoText(item.sales)}</Text>
          </View>
          <View style={styles.track}><View style={[styles.fill, { width: `${Math.max(4, (item.sales / max) * 100)}%` }]} /></View>
          <Text style={styles.qty}>{item.quantity} {unitLabel(item.unit, item.quantity)} picked up</Text>
        </Pressable>
      ))}
      <AnalyticsDetailSheet visible={item !== null} title={item?.name ?? ""} subtitle="Pickups in these days" onClose={() => setOpen(null)}
        rows={item ? [
          { label: "Earned", value: pesoText(item.sales), strong: true },
          { label: "Share of your top sellers", value: percentText(item.sales, total) },
          { label: "Picked up", value: `${item.quantity} ${unitLabel(item.unit, item.quantity)}` },
          { label: `Average per ${item.unit}`, value: item.quantity ? pesoText(item.sales / item.quantity) : "–" },
        ] : []} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { marginTop: spacing.md },
  head: { flexDirection: "row", justifyContent: "space-between", gap: spacing.sm },
  name: { flex: 1, fontFamily: fonts.body.semiBold, fontSize: 15, color: colors.text },
  money: { fontFamily: fonts.heading.bold, fontSize: 15, color: colors.text },
  track: { height: 8, borderRadius: 4, backgroundColor: "#F3F1EA", marginTop: 6, overflow: "hidden" },
  fill: { height: 8, borderRadius: 4, backgroundColor: colors.primary },
  qty: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted, marginTop: 4 },
  empty: { fontFamily: fonts.body.regular, fontSize: 14, color: colors.textMuted, marginTop: spacing.md },
});
