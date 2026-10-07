import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import type { SellerTrustResponse } from "../types";

export function TrustMonitoringSummary({ monitoring }: { monitoring: SellerTrustResponse["monitoring"] }) {
  if (!monitoring) return null;
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Activity monitoring</Text>
      <Text style={styles.copy}>These signals help the platform review activity. They do not restrict your account.</Text>
      <View style={styles.row}><Text style={styles.label}>Monitoring points</Text><Text style={styles.value}>{monitoring.weightedPoints}</Text></View>
      <View style={styles.row}><Text style={styles.label}>Recorded event points</Text><Text style={styles.value}>{monitoring.verifiedEventPoints}</Text></View>
      <View style={styles.row}><Text style={styles.label}>Low-rating signals</Text><Text style={styles.value}>{monitoring.ratingSignals}</Text></View>
      <View style={styles.row}><Text style={styles.label}>Written feedback</Text><Text style={styles.value}>{monitoring.writtenFeedbackCount}</Text></View>
      <View style={styles.row}><Text style={styles.label}>Unverified reports</Text><Text style={styles.value}>{monitoring.allegationFlags}</Text></View>
      <Text style={styles.note}>Reports add no points. Review text is not scored automatically.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: radii.card, padding: spacing.base, marginBottom: spacing.lg },
  title: { fontFamily: fonts.heading.semiBold, fontSize: 18, color: colors.text },
  copy: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.sm },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", minHeight: 40, gap: spacing.sm },
  label: { flex: 1, fontFamily: fonts.body.regular, fontSize: 14, color: colors.textMuted },
  value: { fontFamily: fonts.body.semiBold, fontSize: 16, color: colors.primary },
  note: { fontFamily: fonts.body.regular, fontSize: 12, lineHeight: 18, color: colors.textMuted, marginTop: spacing.sm },
});
