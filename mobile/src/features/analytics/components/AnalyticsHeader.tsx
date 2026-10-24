import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { AlertTriangle, ChevronLeft, TrendingUp } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";

interface AnalyticsHeaderProps {
  days: number;
  hasSummary: boolean;
}

export function AnalyticsHeader({ days, hasSummary }: AnalyticsHeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={styles.backButton}
        >
          <ChevronLeft size={24} color={colors.text} />
        </Pressable>
        <View style={styles.headerTitles}>
          <Text style={styles.screenTitle}>Seller Analytics</Text>
          <Text style={styles.screenSubtitle}>Understand what happened to your surplus</Text>
        </View>
        <Pressable
          onPress={() => router.push("/(app)/advisories")}
          accessibilityRole="button"
          accessibilityLabel="Contextual Advisories"
          style={styles.iconButton}
        >
          <AlertTriangle size={20} color={colors.primary} />
        </Pressable>
      </View>

      <View style={styles.heroBanner}>
        <View style={styles.bannerIconContainer}>
          <TrendingUp size={22} color={colors.white} />
        </View>
        <View style={styles.bannerTextContainer}>
          <View style={styles.bannerTitleRow}>
            <Text style={styles.bannerTitle}>Business Performance</Text>
            <View style={styles.activePill}>
              <Text style={styles.activePillText}>{days}d window</Text>
            </View>
          </View>
          <Text style={styles.bannerSubtitle}>
            {hasSummary
              ? "Descriptive insights from actual buyer pickups & cycles"
              : "Real-time tracking of surplus produce movement"}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.base,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.base,
    gap: spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitles: {
    flex: 1,
  },
  screenTitle: {
    fontFamily: fonts.heading.bold,
    fontSize: 22,
    lineHeight: 28,
    color: colors.text,
  },
  screenSubtitle: {
    fontFamily: fonts.body.regular,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
    marginTop: 2,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    backgroundColor: "rgba(15, 146, 15, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(15, 146, 15, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: radii.card,
    padding: spacing.base,
    gap: spacing.md,
  },
  bannerIconContainer: {
    width: 44,
    height: 44,
    borderRadius: radii.full,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.xs,
  },
  bannerTitle: {
    fontFamily: fonts.heading.bold,
    fontSize: 16,
    color: colors.white,
  },
  activePill: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  activePillText: {
    fontFamily: fonts.body.semiBold,
    fontSize: 11,
    color: colors.white,
  },
  bannerSubtitle: {
    fontFamily: fonts.body.regular,
    fontSize: 12,
    lineHeight: 17,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 3,
  },
});
