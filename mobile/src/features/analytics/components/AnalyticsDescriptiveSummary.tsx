import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { FileText } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import { cardStyles } from "../analyticsCard";

export function AnalyticsDescriptiveSummary({ summary }: { summary: string | null }) {
  return (
    <View style={cardStyles.card}>
      <View style={styles.header}>
        <View style={styles.icon}><FileText size={16} color={colors.primary} /></View>
        <View>
          <Text style={styles.title}>Summary</Text>
          <Text style={cardStyles.subtitle}>Made from your numbers</Text>
        </View>
      </View>
      <Text style={summary ? styles.body : styles.empty}>{summary ?? "No summary for these days yet."}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", gap: spacing.sm + 2, paddingBottom: spacing.sm + 2, borderBottomWidth: 1, borderBottomColor: "#F3F1EA" },
  icon: { width: 32, height: 32, borderRadius: radii.input, backgroundColor: colors.primarySurface, alignItems: "center", justifyContent: "center" },
  title: { fontFamily: fonts.heading.semiBold, fontSize: 16, color: colors.text },
  body: { fontFamily: fonts.body.regular, fontSize: 13, lineHeight: 20, color: colors.text, marginTop: spacing.sm + 2 },
  empty: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted, marginTop: spacing.sm + 2 },
});
