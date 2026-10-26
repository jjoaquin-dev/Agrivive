import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import type { AnalyticsUnit, SellerAnalyticsMetrics } from "../types";

interface AnalyticsOrderOutcomesProps {
  metrics: SellerAnalyticsMetrics;
  unit?: AnalyticsUnit;
}

export function AnalyticsOrderOutcomes({ metrics, unit }: AnalyticsOrderOutcomesProps) {
  const completed = Number(metrics.completedQuantity) || 0;
  const reserved = Number(metrics.reservedQuantity) || 0;
  const cancelled = Number(metrics.cancelledQuantity) || 0;
  const expired = Number(metrics.expiredQuantity) || 0;
  const totalOutcomes = completed + cancelled + expired;

  const handoverRate = totalOutcomes > 0 ? (completed / totalOutcomes) * 100 : 0;
  const unclaimedRate = totalOutcomes > 0 ? ((cancelled + expired) / totalOutcomes) * 100 : 0;
  const unitSuffix = unit === "kilo" ? "kg" : unit ? `${unit}s` : "units";

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Pickup & Order Outcomes</Text>
        <Text style={styles.subtitle}>Disposition of reserved surplus volume</Text>
      </View>

      <View style={styles.boxGrid}>
        {/* Completed */}
        <View style={[styles.box, { backgroundColor: "#ECFDF5", borderColor: "#A7F3D0" }]}>
          <Text style={[styles.boxValue, { color: "#065F46" }]}>{completed.toFixed(0)}</Text>
          <Text style={[styles.boxLabel, { color: "#047857" }]}>Completed</Text>
          <Text style={[styles.boxSub, { color: "#065F46" }]}>Handed over</Text>
        </View>

        {/* Reserved */}
        <View style={[styles.box, { backgroundColor: "#EFF6FF", borderColor: "#BFDBFE" }]}>
          <Text style={[styles.boxValue, { color: "#1E40AF" }]}>{reserved.toFixed(0)}</Text>
          <Text style={[styles.boxLabel, { color: "#1D4ED8" }]}>Reserved</Text>
          <Text style={[styles.boxSub, { color: "#1E40AF" }]}>Pending pass</Text>
        </View>

        {/* Cancelled */}
        <View style={[styles.box, { backgroundColor: "#FEF2F2", borderColor: "#FECACA" }]}>
          <Text style={[styles.boxValue, { color: "#991B1B" }]}>{cancelled.toFixed(0)}</Text>
          <Text style={[styles.boxLabel, { color: "#B91C1C" }]}>Cancelled</Text>
          <Text style={[styles.boxSub, { color: "#991B1B" }]}>Voided orders</Text>
        </View>

        {/* Expired */}
        <View style={[styles.box, { backgroundColor: "#FFFBEB", borderColor: "#FDE68A" }]}>
          <Text style={[styles.boxValue, { color: "#92400E" }]}>{expired.toFixed(0)}</Text>
          <Text style={[styles.boxLabel, { color: "#B45309" }]}>Expired</Text>
          <Text style={[styles.boxSub, { color: "#92400E" }]}>Grace elapsed</Text>
        </View>
      </View>

      <View style={styles.ratiosContainer}>
        <View style={styles.ratioRow}>
          <View style={styles.ratioLabels}>
            <Text style={styles.ratioName}>Handover Fulfillment Rate</Text>
            <Text style={[styles.ratioValue, { color: "#059669" }]}>{handoverRate.toFixed(1)}%</Text>
          </View>
          <View style={styles.ratioBarBg}>
            <View style={[styles.ratioBarFill, { width: `${Math.min(100, handoverRate)}%`, backgroundColor: "#10B981" }]} />
          </View>
        </View>

        <View style={styles.ratioRow}>
          <View style={styles.ratioLabels}>
            <Text style={styles.ratioName}>Unclaimed / Waste Rate</Text>
            <Text style={[styles.ratioValue, { color: "#DC2626" }]}>{unclaimedRate.toFixed(1)}%</Text>
          </View>
          <View style={styles.ratioBarBg}>
            <View style={[styles.ratioBarFill, { width: `${Math.min(100, unclaimedRate)}%`, backgroundColor: "#EF4444" }]} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
    marginBottom: spacing.base,
  },
  header: { marginBottom: spacing.md },
  title: { fontFamily: fonts.heading.bold, fontSize: 16, color: colors.text },
  subtitle: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted, marginTop: 2 },
  boxGrid: { flexDirection: "row", gap: spacing.xs, marginBottom: spacing.md },
  box: {
    flex: 1,
    borderRadius: radii.input,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  boxValue: { fontFamily: fonts.heading.bold, fontSize: 16 },
  boxLabel: { fontFamily: fonts.body.semiBold, fontSize: 11, marginTop: 1 },
  boxSub: { fontFamily: fonts.body.regular, fontSize: 9, marginTop: 1 },
  ratiosContainer: { gap: spacing.sm, paddingTop: spacing.xs },
  ratioRow: { gap: 4 },
  ratioLabels: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  ratioName: { fontFamily: fonts.body.medium, fontSize: 12, color: colors.text },
  ratioValue: { fontFamily: fonts.body.semiBold, fontSize: 12 },
  ratioBarBg: { height: 6, backgroundColor: colors.surfaceMuted, borderRadius: radii.full, overflow: "hidden" },
  ratioBarFill: { height: "100%", borderRadius: radii.full },
});
