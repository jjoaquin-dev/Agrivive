import React, { useState } from "react";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { useInventory } from "../../src/features/inventory/hooks/useInventory";
import { useSellerAnalytics } from "../../src/features/analytics/hooks/useSellerAnalytics";
import { AnalyticsHeader } from "../../src/features/analytics/components/AnalyticsHeader";
import { AnalyticsFilterRow } from "../../src/features/analytics/components/AnalyticsFilterRow";
import { AnalyticsMetricsGrid } from "../../src/features/analytics/components/AnalyticsMetricsGrid";
import { AnalyticsMovementChart } from "../../src/features/analytics/components/AnalyticsMovementChart";
import { AnalyticsUnitDistribution } from "../../src/features/analytics/components/AnalyticsUnitDistribution";
import { AnalyticsOrderOutcomes } from "../../src/features/analytics/components/AnalyticsOrderOutcomes";
import { AnalyticsProductPerformance } from "../../src/features/analytics/components/AnalyticsProductPerformance";
import { AnalyticsDescriptiveSummary } from "../../src/features/analytics/components/AnalyticsDescriptiveSummary";
import type { AnalyticsUnit } from "../../src/features/analytics/types";
import { colors, fonts, spacing } from "../../src/theme";

export default function SellerAnalyticsScreen() {
  const router = useRouter();
  const { products, summary, refresh: refreshInventory } = useInventory();
  const [days, setDays] = useState(30);
  const [productId, setProductId] = useState<string | undefined>();
  const [unit, setUnit] = useState<AnalyticsUnit | undefined>();

  const { analytics, loading, refreshing, error, refresh } = useSellerAnalytics(days, productId, unit);

  const handleFullRefresh = () => {
    refresh();
    refreshInventory();
  };

  if (loading && !refreshing && !analytics) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading analytics...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleFullRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        <AnalyticsHeader days={days} hasSummary={Boolean(analytics?.summary)} />

        <AnalyticsFilterRow
          days={days}
          onSelectDays={setDays}
          unit={unit}
          onSelectUnit={setUnit}
          productId={productId}
          onSelectProduct={setProductId}
          products={products}
        />

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {analytics ? (
          <>
            <AnalyticsMetricsGrid
              metrics={analytics.metrics}
              unit={unit}
              sellThroughNotComputable={analytics.notComputable.sellThroughRate}
              changeNotComputable={analytics.notComputable.completedQuantityChange}
            />

            <AnalyticsMovementChart metrics={analytics.metrics} unit={unit} />

            <AnalyticsUnitDistribution summary={summary} />

            <AnalyticsOrderOutcomes metrics={analytics.metrics} unit={unit} />

            <AnalyticsProductPerformance products={products} />

            <Pressable
              onPress={() => router.push("/(app)/marketing?section=visibility")}
              accessibilityRole="button"
              accessibilityLabel="Open the Visibility Guide in Marketing"
              style={styles.guideLink}
            >
              <View style={styles.guideCopy}>
                <Text style={styles.sectionTitle}>Visibility Guide</Text>
                <Text style={styles.sectionSubtitle}>How high your listings show to buyers</Text>
              </View>
              <ChevronRight size={20} color={colors.textMuted} />
            </Pressable>

            <AnalyticsDescriptiveSummary summary={analytics.summary} />
          </>
        ) : (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No analytics available</Text>
            <Text style={styles.emptyText}>Try choosing another period or filter.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.base, paddingBottom: spacing.xxxl },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  loadingText: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted, marginTop: spacing.sm },
  errorBox: {
    backgroundColor: "rgba(220, 38, 38, 0.08)",
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.base,
  },
  errorText: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.error },
  guideLink: { flexDirection: "row", alignItems: "center", minHeight: 56, marginBottom: spacing.base, paddingHorizontal: spacing.base, backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  guideCopy: { flex: 1 },
  sectionTitle: { fontFamily: fonts.heading.bold, fontSize: 16, color: colors.text },
  sectionSubtitle: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted, marginTop: 2 },
  empty: { alignItems: "center", paddingVertical: spacing.xxxl },
  emptyTitle: { fontFamily: fonts.heading.bold, fontSize: 16, color: colors.text, marginBottom: spacing.xs },
  emptyText: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted },
});
