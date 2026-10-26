import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useInventory } from "../../src/features/inventory/hooks/useInventory";
import { useSellerAnalytics } from "../../src/features/analytics/hooks/useSellerAnalytics";
import {
  fetchSellerWeightedVisibility,
  type SellerVisibilityItem,
} from "../../src/features/analytics/api/seller-visibility";
import { AnalyticsHeader } from "../../src/features/analytics/components/AnalyticsHeader";
import { AnalyticsFilterRow } from "../../src/features/analytics/components/AnalyticsFilterRow";
import { AnalyticsMetricsGrid } from "../../src/features/analytics/components/AnalyticsMetricsGrid";
import { AnalyticsMovementChart } from "../../src/features/analytics/components/AnalyticsMovementChart";
import { AnalyticsUnitDistribution } from "../../src/features/analytics/components/AnalyticsUnitDistribution";
import { AnalyticsOrderOutcomes } from "../../src/features/analytics/components/AnalyticsOrderOutcomes";
import { AnalyticsProductPerformance } from "../../src/features/analytics/components/AnalyticsProductPerformance";
import { AnalyticsPeriodComparison } from "../../src/features/analytics/components/AnalyticsPeriodComparison";
import { VisibilityBreakdownCard } from "../../src/features/analytics/components/VisibilityBreakdownCard";
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
  const [visibilityList, setVisibilityList] = useState<SellerVisibilityItem[]>([]);

  useEffect(() => {
    fetchSellerWeightedVisibility()
      .then((res) => setVisibilityList(res.weightedSurplus || []))
      .catch(() => {});
  }, [refreshing]);

  const handleFullRefresh = () => {
    refresh();
    refreshInventory();
  };

  const filteredVisibility = useMemo(() => {
    let list = visibilityList;
    if (productId) list = list.filter((v) => v.productId === productId);
    return [...list].sort((a, b) => {
      const scoreA = a.score ?? -1;
      const scoreB = b.score ?? -1;
      if (scoreB !== scoreA) return scoreB - scoreA;
      return (a.rank ?? 999) - (b.rank ?? 999);
    });
  }, [visibilityList, productId]);

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

            <AnalyticsPeriodComparison analytics={analytics} unit={unit} />

            <View style={styles.visibilitySection}>
              <View style={styles.visibilityHeader}>
                <Text style={styles.sectionTitle}>Marketplace Visibility Guide</Text>
                <Text style={styles.sectionSubtitle}>Placement scores evaluated by AHP-TOPSIS</Text>
              </View>

              {filteredVisibility.length === 0 ? (
                <View style={styles.emptyVisibility}>
                  <Text style={styles.emptyText}>No visibility ranking data recorded yet.</Text>
                </View>
              ) : (
                filteredVisibility.slice(0, 3).map((item) => {
                  const prod = products.find((p) => p.id === item.productId);
                  return (
                    <VisibilityBreakdownCard
                      key={item.productId}
                      item={item}
                      product={prod}
                      productName={prod?.productName}
                      onBoost={() => router.push({ pathname: "/(app)/boost/[productId]", params: { productId: item.productId } })}
                    />
                  );
                })
              )}
            </View>

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
  visibilitySection: { marginBottom: spacing.base },
  visibilityHeader: { marginBottom: spacing.sm },
  sectionTitle: { fontFamily: fonts.heading.bold, fontSize: 16, color: colors.text },
  sectionSubtitle: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted, marginTop: 2 },
  emptyVisibility: { paddingVertical: spacing.md, alignItems: "center" },
  empty: { alignItems: "center", paddingVertical: spacing.xxxl },
  emptyTitle: { fontFamily: fonts.heading.bold, fontSize: 16, color: colors.text, marginBottom: spacing.xs },
  emptyText: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted },
});
