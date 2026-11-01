import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { BookOpen, ChevronLeft } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import { safeBack } from "../../../utils/safeBack";
import { formatRange } from "../format";

interface AnalyticsHeaderProps {
  period?: { from: string; to: string };
}

export function AnalyticsHeader({ period }: AnalyticsHeaderProps) {
  const router = useRouter();
  return (
    <View style={styles.bar}>
      <Pressable onPress={() => safeBack(router)} accessibilityRole="button" accessibilityLabel="Go back" style={styles.back}>
        <ChevronLeft size={24} color={colors.text} />
      </Pressable>
      <View style={styles.titles}>
        <Text style={styles.title}>Sales Report</Text>
        {period ? <Text style={styles.subtitle}>{formatRange(period.from, period.to)}</Text> : null}
      </View>
      <Pressable onPress={() => router.push("/(app)/advisories")} accessibilityRole="button" accessibilityLabel="Tips" style={styles.tips}>
        <BookOpen size={18} color={colors.primary} />
        <Text style={styles.tipsText}>Tips</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: "row", alignItems: "center", gap: spacing.sm, paddingHorizontal: spacing.base, paddingTop: spacing.xs, paddingBottom: spacing.sm, backgroundColor: colors.surface },
  back: { width: 44, height: 44, marginLeft: -spacing.sm, alignItems: "center", justifyContent: "center", borderRadius: radii.full },
  titles: { flex: 1 },
  title: { fontFamily: fonts.heading.bold, fontSize: 22, lineHeight: 28, color: colors.text },
  subtitle: { fontFamily: fonts.body.regular, fontSize: 13, lineHeight: 18, color: colors.textMuted },
  tips: { flexDirection: "row", alignItems: "center", gap: 6, height: 44, paddingHorizontal: 10, borderRadius: radii.input + 2, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  tipsText: { fontFamily: fonts.body.semiBold, fontSize: 12, color: colors.text },
});
