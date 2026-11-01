import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Megaphone, TrendingDown, XCircle } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import type { ProductBoostChip } from "../types";

function nextDropText(value: string) {
  const date = new Date(value);
  const time = date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  return date.toDateString() === new Date().toDateString()
    ? time
    : `${date.toLocaleDateString([], { month: "short", day: "numeric" })}, ${time}`;
}

/** Small status chips for a listing: Boosted with the next drop time, a waiting price drop, or a post that failed. */
export function BoostChip({ boost }: { boost?: ProductBoostChip | null }) {
  if (!boost) return null;
  const bad = boost.state === "not_posted" || boost.state === "failed";
  const label = bad ? "Boost did not post"
    : boost.state === "posting" ? "Posting now"
    : boost.state === "running" && boost.nextDropAt ? `Boosted · next drop ${nextDropText(boost.nextDropAt)}`
    : boost.state === "finished" ? "Boosted · lowest price reached"
    : "Boosted";
  const Icon = bad ? XCircle : Megaphone;
  const tone = bad ? colors.error : colors.primary;

  return (
    <View style={styles.row}>
      <View style={[styles.chip, { backgroundColor: `${tone}18` }]}>
        <Icon size={12} color={tone} />
        <Text style={[styles.text, { color: tone }]} numberOfLines={1}>{label}</Text>
      </View>
      {boost.priceDropPrompt ? (
        <View style={[styles.chip, { backgroundColor: "#FFEDD5" }]}>
          <TrendingDown size={12} color="#EA580C" />
          <Text style={[styles.text, { color: "#EA580C" }]} numberOfLines={1}>Price dropped · Boost again</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs, marginTop: spacing.xs },
  chip: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: radii.full, maxWidth: "100%" },
  text: { fontFamily: fonts.body.semiBold, fontSize: 11, flexShrink: 1 },
});
