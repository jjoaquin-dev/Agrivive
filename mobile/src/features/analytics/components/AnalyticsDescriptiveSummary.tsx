import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Sparkles } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";

interface AnalyticsDescriptiveSummaryProps {
  summary: string | null;
}

export function AnalyticsDescriptiveSummary({ summary }: AnalyticsDescriptiveSummaryProps) {
  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryHeader}>
        <View style={styles.sparkleCircle}>
          <Sparkles size={16} color={colors.primary} />
        </View>
        <Text style={styles.summaryTitle}>Descriptive Summary</Text>
      </View>
      {summary ? (
        <Text style={styles.summaryBody}>{summary}</Text>
      ) : (
        <Text style={styles.summaryEmpty}>No descriptive summary available for this period.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
    marginBottom: spacing.base,
  },
  summaryHeader: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.sm },
  sparkleCircle: {
    width: 28,
    height: 28,
    borderRadius: radii.full,
    backgroundColor: "rgba(15, 146, 15, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  summaryTitle: { fontFamily: fonts.heading.bold, fontSize: 15, color: colors.text },
  summaryBody: { fontFamily: fonts.body.regular, fontSize: 13, lineHeight: 20, color: colors.text },
  summaryEmpty: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted },
});
