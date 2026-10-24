import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { AlertTriangle, ChevronRight, History, Sparkles } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";

interface AnalyticsDescriptiveSummaryProps {
  summary: string | null;
}

export function AnalyticsDescriptiveSummary({ summary }: AnalyticsDescriptiveSummaryProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Descriptive Summary Card */}
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

      {/* Quick Action Navigation Tiles */}
      <View style={styles.actionsGrid}>
        <TouchableOpacity
          onPress={() => router.push("/(app)/advisories")}
          activeOpacity={0.75}
          style={styles.actionTile}
        >
          <View style={[styles.tileIconCircle, { backgroundColor: "#FEFCE8" }]}>
            <AlertTriangle size={18} color="#D97706" />
          </View>
          <View style={styles.tileTextContainer}>
            <Text style={styles.tileTitle}>Market Advisories</Text>
            <Text style={styles.tileSubtitle}>Weather & holiday alerts</Text>
          </View>
          <ChevronRight size={16} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(app)/boosts")}
          activeOpacity={0.75}
          style={styles.actionTile}
        >
          <View style={[styles.tileIconCircle, { backgroundColor: "#FFF7ED" }]}>
            <Sparkles size={18} color="#EA580C" />
          </View>
          <View style={styles.tileTextContainer}>
            <Text style={styles.tileTitle}>Visibility Boosts</Text>
            <Text style={styles.tileSubtitle}>Promote surplus produce</Text>
          </View>
          <ChevronRight size={16} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(app)/activity")}
          activeOpacity={0.75}
          style={styles.actionTile}
        >
          <View style={[styles.tileIconCircle, { backgroundColor: "#F0FDF4" }]}>
            <History size={18} color="#16A34A" />
          </View>
          <View style={styles.tileTextContainer}>
            <Text style={styles.tileTitle}>Stock Change History</Text>
            <Text style={styles.tileSubtitle}>Audit ledger adjustments</Text>
          </View>
          <ChevronRight size={16} color={colors.textMuted} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.base, gap: spacing.base },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
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
  actionsGrid: { gap: spacing.sm },
  actionTile: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radii.button,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  tileIconCircle: { width: 36, height: 36, borderRadius: radii.full, alignItems: "center", justifyContent: "center" },
  tileTextContainer: { flex: 1 },
  tileTitle: { fontFamily: fonts.heading.bold, fontSize: 13, color: colors.text },
  tileSubtitle: { fontFamily: fonts.body.regular, fontSize: 11, color: colors.textMuted, marginTop: 1 },
});
