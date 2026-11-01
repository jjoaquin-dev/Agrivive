import React, { useState } from "react";
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { AlertCircle, ChevronRight, Info } from "lucide-react-native";
import { useInventory } from "../../src/features/inventory/hooks/useInventory";
import { useSellerAnalytics } from "../../src/features/analytics/hooks/useSellerAnalytics";
import { AnalyticsHeader } from "../../src/features/analytics/components/AnalyticsHeader";
import { AnalyticsFilterRow } from "../../src/features/analytics/components/AnalyticsFilterRow";
import { AnalyticsMetricsGrid } from "../../src/features/analytics/components/AnalyticsMetricsGrid";
import { AnalyticsMovementChart } from "../../src/features/analytics/components/AnalyticsMovementChart";
import { AnalyticsUnitDistribution } from "../../src/features/analytics/components/AnalyticsUnitDistribution";
import { AnalyticsOrderOutcomes } from "../../src/features/analytics/components/AnalyticsOrderOutcomes";
import { AnalyticsRepeatListings } from "../../src/features/analytics/components/AnalyticsRepeatListings";
import { AnalyticsProductPerformance } from "../../src/features/analytics/components/AnalyticsProductPerformance";
import { AnalyticsDescriptiveSummary } from "../../src/features/analytics/components/AnalyticsDescriptiveSummary";
import { AnalyticsSkeleton } from "../../src/features/analytics/components/AnalyticsSkeleton";
import { cardStyles } from "../../src/features/analytics/analyticsCard";
import type { AnalyticsUnit } from "../../src/features/analytics/types";
import { colors, fonts, radii, spacing } from "../../src/theme";

export default function SellerAnalyticsScreen() {
  const router = useRouter();
  const { products, summary, refresh: refreshInventory } = useInventory();
  const [days, setDays] = useState(30);
  const [productId, setProductId] = useState<string | undefined>();
  const [unit, setUnit] = useState<AnalyticsUnit | undefined>();

  const { analytics, loading, refreshing, error, refresh } = useSellerAnalytics(days, productId, unit);
  const showSkeleton = loading && !refreshing;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        stickyHeaderIndices={[1]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { refresh(); refreshInventory(); }} colors={[colors.primary]} tintColor={colors.primary} />
        }
      >
        <AnalyticsHeader period={analytics?.period} />
        <AnalyticsFilterRow
          days={days}
          onSelectDays={setDays}
          unit={unit}
          onSelectUnit={setUnit}
          productId={productId}
          onSelectProduct={setProductId}
          products={products}
        />

        <View style={styles.body}>
          {!unit && !error ? (
            <View style={styles.notice}>
              <Info size={16} color={colors.warning} />
              <Text style={styles.noticeText}>Kilos, sacks and piles are added together here. Pick one unit to see exact amounts.</Text>
            </View>
          ) : null}

          {error ? (
            <View style={[cardStyles.card, styles.errorCard]}>
              <AlertCircle size={20} color={colors.error} />
              <Text style={styles.errorTitle}>Could not load your sales report</Text>
              <Text style={styles.errorText}>{error}</Text>
              <Pressable onPress={refresh} accessibilityRole="button" accessibilityLabel="Try again" style={styles.retry}>
                <Text style={styles.retryText}>Try Again</Text>
              </Pressable>
            </View>
          ) : showSkeleton && !analytics ? (
            <AnalyticsSkeleton />
          ) : analytics ? (
            <>
              <AnalyticsMetricsGrid
                metrics={analytics.metrics}
                unit={unit}
                previousPeriod={{ from: analytics.period.previousFrom, to: analytics.period.previousTo }}
                sellThroughNotComputable={analytics.notComputable.sellThroughRate}
                changeNotComputable={analytics.notComputable.completedQuantityChange}
              />
              <AnalyticsMovementChart metrics={analytics.metrics} unit={unit} />
              <AnalyticsOrderOutcomes metrics={analytics.metrics} unit={unit} />
              <AnalyticsRepeatListings count={analytics.metrics.recurringListings} />
              <AnalyticsUnitDistribution summary={summary} />
              <AnalyticsProductPerformance products={products} />

              <Pressable
                onPress={() => router.push("/(app)/(tabs)/marketing?section=visibility")}
                accessibilityRole="button"
                accessibilityLabel="Open the Visibility Guide in Marketing"
                style={styles.guideLink}
              >
                <View style={styles.guideCopy}>
                  <Text style={styles.guideTitle}>Visibility Guide</Text>
                  <Text style={styles.guideSub}>How high your listings show to buyers</Text>
                </View>
                <ChevronRight size={20} color={colors.textMuted} />
              </Pressable>

              <AnalyticsDescriptiveSummary summary={analytics.summary} />
            </>
          ) : (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No sales yet</Text>
              <Text style={styles.emptyText}>Try another period or produce.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.surface },
  content: { paddingBottom: spacing.xxxl },
  body: { backgroundColor: colors.surfaceMuted, padding: spacing.base, paddingTop: spacing.md, minHeight: 600 },
  notice: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm, backgroundColor: "#FFF7ED", borderWidth: 1, borderColor: "#FFEDD5", borderRadius: radii.input, padding: spacing.md, marginBottom: spacing.md },
  noticeText: { flex: 1, fontFamily: fonts.body.regular, fontSize: 12, lineHeight: 18, color: "#92400E" },
  errorCard: { alignItems: "center", gap: spacing.xs },
  errorTitle: { fontFamily: fonts.heading.bold, fontSize: 16, color: colors.text },
  errorText: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted, textAlign: "center" },
  retry: { marginTop: spacing.sm, minHeight: 48, paddingHorizontal: spacing.xl, borderRadius: radii.button, backgroundColor: colors.primary, justifyContent: "center" },
  retryText: { fontFamily: fonts.body.semiBold, fontSize: 15, color: colors.white },
  guideLink: { flexDirection: "row", alignItems: "center", minHeight: 56, marginBottom: spacing.md, paddingHorizontal: spacing.base, backgroundColor: colors.surface, borderRadius: radii.card - 4, borderWidth: 1, borderColor: colors.border },
  guideCopy: { flex: 1 },
  guideTitle: { fontFamily: fonts.body.semiBold, fontSize: 15, color: colors.text },
  guideSub: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted, marginTop: 2 },
  empty: { alignItems: "center", paddingVertical: spacing.xxxl },
  emptyTitle: { fontFamily: fonts.heading.bold, fontSize: 16, color: colors.text, marginBottom: spacing.xs },
  emptyText: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted },
});
