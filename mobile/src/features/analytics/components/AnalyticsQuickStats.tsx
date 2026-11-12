import React, { useState } from "react";
import { Star } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import type { SellerAnalyticsInsights } from "../types";
import { buyerRows, moneyRows, orderRows, pesoText } from "../breakdown";
import { AnalyticsDetailSheet, type BreakdownRow } from "./AnalyticsDetailSheet";

const YELLOW = colors.star;
const peso = pesoText;

function StarBars({ stars }: { stars: number[] }) {
  const max = Math.max(...stars, 1);
  return (
    <View style={{ marginBottom: spacing.sm }}>
      {[5, 4, 3, 2, 1].map((n) => (
        <View key={n} style={styles.starRow}>
          <View style={styles.starLabel}><Text style={styles.starNum}>{n}</Text><Star size={14} color={YELLOW} fill={YELLOW} /></View>
          <View style={styles.starTrack}><View style={[styles.starFill, { width: `${(stars[n - 1] / max) * 100}%` }]} /></View>
          <Text style={styles.starCount}>{stars[n - 1]}</Text>
        </View>
      ))}
    </View>
  );
}

function replyText(minutes: number | null) {
  if (minutes === null) return "–";
  if (minutes < 60) return `${minutes} min`;
  const hours = minutes / 60;
  return `${hours < 10 ? hours.toFixed(1) : Math.round(hours)} hr`;
}

/** Four small numbers right under the headline sale: the answers a seller checks first. */
export function AnalyticsQuickStats({ insights }: { insights: SellerAnalyticsInsights }) {
  const { orders, buyers, rating } = insights;
  const [open, setOpen] = useState<string | null>(null);
  const stats = [
    { key: "orders", label: "Orders Picked Up", value: String(orders.pickedUp), note: `of ${orders.placed} placed` },
    { key: "money", label: "Average Order", value: insights.averageOrder === null ? "–" : peso(insights.averageOrder), note: "per pickup" },
    { key: "buyers", label: "Buyers", value: String(buyers.total), note: buyers.returning ? `${buyers.returning} came back` : "picked up" },
    { key: "rating", label: "Rating", value: rating ? rating.average.toFixed(1) : "–", note: rating ? `${rating.count} review${rating.count === 1 ? "" : "s"}` : "no reviews yet" },
  ];
  const titles: Record<string, string> = { orders: "Orders", money: "Money Per Order", buyers: "Buyers", rating: "Ratings" };
  const rowsFor = (key: string | null): BreakdownRow[] => {
    if (key === "orders") return orderRows(orders);
    if (key === "money") return moneyRows(insights);
    if (key === "buyers") return buyerRows(buyers);
    if (key === "rating" && rating) return [{ label: "Average", value: `${rating.average.toFixed(1)} of 5`, strong: true }, { label: "Reviews", value: String(rating.count) }];
    return [{ label: "Reviews", value: "None yet" }];
  };
  return (
    <View style={styles.grid}>
      {stats.map((stat) => (
        <Pressable key={stat.key} onPress={() => setOpen(stat.key)} accessibilityRole="button" accessibilityHint="Shows the breakdown" style={({ pressed }) => [styles.tile, pressed && styles.pressed]} accessibilityLabel={`${stat.label}: ${stat.value}, ${stat.note}`}>
          <Text style={styles.label}>{stat.label}</Text>
          {stat.key === "rating" && rating ? (
            <View style={styles.ratingRow}>
              <Text style={[styles.value, styles.yellow]}>{stat.value}</Text>
              <Star size={24} color={YELLOW} fill={YELLOW} />
            </View>
          ) : <Text style={styles.value}>{stat.value}</Text>}
          <Text style={styles.note}>{stat.note}</Text>
        </Pressable>
      ))}
      <Text style={styles.reply}>You confirm orders in about {replyText(insights.averageReplyMinutes)}.</Text>
      <AnalyticsDetailSheet visible={open !== null} title={titles[open ?? "orders"]} rows={rowsFor(open)} subtitle={open === "rating" && rating?.allTime ? "No reviews in these days, so this is every review so far." : undefined} onClose={() => setOpen(null)}>
        {open === "rating" && rating ? <StarBars stars={rating.stars} /> : null}
      </AnalyticsDetailSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginBottom: spacing.md },
  tile: { width: "48.5%", backgroundColor: colors.surface, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border, padding: spacing.md },
  label: { fontFamily: fonts.body.medium, fontSize: 12, color: colors.textMuted },
  value: { fontFamily: fonts.heading.bold, fontSize: 22, lineHeight: 28, color: colors.text, marginTop: 2 },
  note: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  yellow: { color: YELLOW },
  pressed: { opacity: 0.7 },
  starRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, minHeight: 32 },
  starLabel: { width: 40, flexDirection: "row", alignItems: "center", gap: 4 },
  starNum: { fontFamily: fonts.body.medium, fontSize: 13, color: colors.text },
  starTrack: { flex: 1, height: 8, borderRadius: 4, backgroundColor: colors.surfaceMuted, overflow: "hidden" },
  starFill: { height: 8, borderRadius: 4, backgroundColor: YELLOW },
  starCount: { width: 28, textAlign: "right", fontFamily: fonts.body.semiBold, fontSize: 13, color: colors.text },
  reply: { width: "100%", fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted },
});
