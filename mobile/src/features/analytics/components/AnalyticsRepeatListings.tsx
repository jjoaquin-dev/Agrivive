import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { RefreshCw } from "lucide-react-native";
import { colors, fonts, spacing } from "../../../theme";
import { cardStyles } from "../analyticsCard";

/** Shown only when the same produce was posted again in the chosen days. */
export function AnalyticsRepeatListings({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <View style={cardStyles.card}>
      <View style={styles.row}>
        <View style={styles.icon}><RefreshCw size={16} color={colors.textMuted} /></View>
        <Text style={styles.value}>{count} {count === 1 ? "time" : "times"}</Text>
      </View>
      <Text style={styles.text}>You posted the same produce again in these days. Smaller batches may sell out faster.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  icon: { width: 28, height: 28, borderRadius: 14, backgroundColor: "#F3F4F6", alignItems: "center", justifyContent: "center" },
  value: { fontFamily: fonts.heading.bold, fontSize: 18, color: colors.text },
  text: { fontFamily: fonts.body.regular, fontSize: 13, lineHeight: 18, color: colors.textMuted, marginTop: 6 },
});
