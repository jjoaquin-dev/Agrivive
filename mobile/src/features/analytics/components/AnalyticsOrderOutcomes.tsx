import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, spacing } from "../../../theme";
import { cardStyles } from "../analyticsCard";
import type { AnalyticsUnit, SellerAnalyticsMetrics } from "../types";

interface AnalyticsOrderOutcomesProps {
  metrics: SellerAnalyticsMetrics;
  unit?: AnalyticsUnit;
}

function Row({ label, percent, color, note }: { label: string; percent: number; color: string; note?: string }) {
  return (
    <View style={styles.row}>
      <View style={styles.labels}>
        <Text style={styles.name}>{label}</Text>
        <Text style={[styles.value, { color }]}>{percent.toFixed(1)}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.min(100, percent)}%`, backgroundColor: color }]} />
      </View>
      {note ? <Text style={styles.note}>{note}</Text> : null}
    </View>
  );
}

/** Our bar rows: of the orders that ended, how many were picked up and how many were not. */
export function AnalyticsOrderOutcomes({ metrics }: AnalyticsOrderOutcomesProps) {
  const completed = Number(metrics.completedQuantity) || 0;
  const cancelled = Number(metrics.cancelledQuantity) || 0;
  const expired = Number(metrics.expiredQuantity) || 0;
  const total = completed + cancelled + expired;
  const pickedUp = total > 0 ? (completed / total) * 100 : 0;
  const notPickedUp = total > 0 ? ((cancelled + expired) / total) * 100 : 0;

  return (
    <View style={cardStyles.card}>
      <Text style={cardStyles.title}>Pickup Results</Text>
      {total > 0 ? (
        <View style={styles.list}>
          <Row label="Picked Up" percent={pickedUp} color={colors.primary} />
          <Row label="Not Picked Up" percent={notPickedUp} color={colors.error} note={`${cancelled.toFixed(2)} cancelled · ${expired.toFixed(2)} expired`} />
        </View>
      ) : (
        <Text style={styles.note}>No finished pickups in these days yet.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.md, marginTop: spacing.md },
  row: { gap: 6 },
  labels: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  name: { fontFamily: fonts.body.semiBold, fontSize: 14, color: colors.text },
  value: { fontFamily: fonts.body.semiBold, fontSize: 14 },
  track: { height: 10, borderRadius: 4, backgroundColor: "#F3F4F6", overflow: "hidden" },
  fill: { height: "100%", borderRadius: 4 },
  note: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted, marginTop: 2 },
});
