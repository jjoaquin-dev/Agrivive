import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { AlertTriangle, BarChart3, ChartNoAxesCombined, RefreshCcw, Sparkles } from "lucide-react-native";
import { ButtonComponent } from "../../src/components/ButtonComponent";
import { useInventory } from "../../src/features/inventory/hooks/useInventory";
import { useSellerAnalytics } from "../../src/features/analytics/hooks/useSellerAnalytics";
import {
  fetchSellerWeightedVisibility,
  type SellerVisibilityItem,
} from "../../src/features/analytics/api/seller-visibility";
import { VisibilityBreakdownCard } from "../../src/features/analytics/components/VisibilityBreakdownCard";
import type { AnalyticsUnit } from "../../src/features/analytics/types";
import { colors, fonts, radii, spacing, touchTargets } from "../../src/theme";

const periods = [
  { days: 7, label: "7 days" },
  { days: 30, label: "30 days" },
  { days: 90, label: "90 days" },
];
const units: { value: AnalyticsUnit | undefined; label: string }[] = [
  { value: undefined, label: "All units" },
  { value: "kilo", label: "Kilograms" },
  { value: "sack", label: "Sacks" },
  { value: "pile", label: "Piles" },
];

function metricLabel(value: string, unit?: AnalyticsUnit) {
  const suffix = unit === "kilo" ? "kg" : unit ?? "units";
  return `${value} ${suffix}`;
}

function percentLabel(value: number | null, notComputable: boolean) {
  return notComputable || value === null ? "Not computable" : `${value.toFixed(2)}%`;
}

export default function SellerAnalyticsScreen() {
  const router = useRouter();
  const { products } = useInventory();
  const [days, setDays] = useState(30);
  const [productId, setProductId] = useState<string | undefined>();
  const [unit, setUnit] = useState<AnalyticsUnit | undefined>();
  const { analytics, loading, refreshing, error, refresh } = useSellerAnalytics(days, productId, unit);
  const selectedProduct = useMemo(() => products.find((product) => product.id === productId), [products, productId]);
  const [visibilityList, setVisibilityList] = useState<SellerVisibilityItem[]>([]);

  useEffect(() => {
    fetchSellerWeightedVisibility()
      .then((res) => setVisibilityList(res.weightedSurplus || []))
      .catch(() => {});
  }, [refreshing]);

  const filteredVisibility = useMemo(() => {
    if (productId) return visibilityList.filter((v) => v.productId === productId);
    return visibilityList;
  }, [visibilityList, productId]);

  if (loading && !refreshing) {
    return <SafeAreaView style={styles.safeArea} edges={["bottom"]}><View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /><Text style={styles.muted}>Loading analytics...</Text></View></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} colors={[colors.primary]} tintColor={colors.primary} />}
      >
        <View style={styles.headerRow}>
          <View style={styles.headerText}><Text style={styles.title}>Analytics</Text><Text style={styles.muted}>Understand what happened to your surplus.</Text></View>
          <BarChart3 size={28} color={colors.primary} />
        </View>
        <Pressable onPress={() => router.push("/(app)/advisories")} accessibilityRole="button" accessibilityLabel="View contextual advisories" style={styles.advisoryLink}>
          <AlertTriangle size={18} color={colors.primary} /><Text style={styles.advisoryLinkText}>View contextual advisories</Text>
        </Pressable>

        <Text style={styles.sectionTitle}>Period</Text>
        <View style={styles.chipRow}>{periods.map((period) => <Pressable key={period.days} onPress={() => setDays(period.days)} accessibilityRole="button" accessibilityState={{ selected: days === period.days }} style={[styles.chip, days === period.days && styles.chipSelected]}><Text style={[styles.chipText, days === period.days && styles.chipTextSelected]}>{period.label}</Text></Pressable>)}</View>

        <Text style={styles.sectionTitle}>Product</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalChips}>
          <Pressable onPress={() => setProductId(undefined)} accessibilityRole="button" accessibilityState={{ selected: !productId }} style={[styles.chip, !productId && styles.chipSelected]}><Text style={[styles.chipText, !productId && styles.chipTextSelected]}>All products</Text></Pressable>
          {products.map((product) => <Pressable key={product.id} onPress={() => setProductId(product.id)} accessibilityRole="button" accessibilityState={{ selected: productId === product.id }} style={[styles.chip, productId === product.id && styles.chipSelected]}><Text style={[styles.chipText, productId === product.id && styles.chipTextSelected]}>{product.productName}</Text></Pressable>)}
        </ScrollView>

        <Text style={styles.sectionTitle}>Selling unit</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalChips}>{units.map((item) => <Pressable key={item.label} onPress={() => setUnit(item.value)} accessibilityRole="button" accessibilityState={{ selected: unit === item.value }} style={[styles.chip, unit === item.value && styles.chipSelected]}><Text style={[styles.chipText, unit === item.value && styles.chipTextSelected]}>{item.label}</Text></Pressable>)}</ScrollView>

        {error ? <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text><ButtonComponent title="Try Again" onPress={refresh} variant="secondary" style={styles.retry} /></View> : null}

        {analytics ? <>
          <Text style={styles.periodText}>{analytics.period.from} to {analytics.period.to}{selectedProduct ? ` · ${selectedProduct.productName}` : ""}</Text>
          <View style={styles.grid}>
            <Metric title="Posted" value={metricLabel(analytics.metrics.postedQuantity, unit)} />
            <Metric title="Available" value={metricLabel(analytics.metrics.availableQuantity, unit)} />
            <Metric title="Reserved" value={metricLabel(analytics.metrics.reservedQuantity, unit)} />
            <Metric title="Remaining" value={metricLabel(analytics.metrics.remainingQuantity, unit)} />
            <Metric title="Completed" value={metricLabel(analytics.metrics.completedQuantity, unit)} />
            <Metric title="Cancelled" value={metricLabel(analytics.metrics.cancelledQuantity, unit)} />
            <Metric title="Expired" value={metricLabel(analytics.metrics.expiredQuantity, unit)} />
            <Metric title="Recurring listings" value={String(analytics.metrics.recurringListings)} />
          </View>

          <View style={styles.card}><View style={styles.cardHeader}><ChartNoAxesCombined size={20} color={colors.primary} /><Text style={styles.cardTitle}>Performance</Text></View><Text style={styles.cardValue}>Sell-through: {percentLabel(analytics.metrics.sellThroughRate, analytics.notComputable.sellThroughRate)}</Text><Text style={styles.cardMeta}>Completed sales: ₱{analytics.metrics.completedSalesTotal}</Text><Text style={styles.cardMeta}>Completed quantity change: {percentLabel(analytics.metrics.completedQuantityChange, analytics.notComputable.completedQuantityChange)}</Text></View>

          <View style={styles.card}><View style={styles.cardHeader}><Sparkles size={20} color={colors.primary} /><Text style={styles.cardTitle}>Descriptive summary</Text></View>{analytics.summary ? <Text style={styles.summary}>{analytics.summary}</Text> : <Text style={styles.muted}>The exact analytics are available, but the Groq summary is currently unavailable.</Text>}{analytics.summaryStatus === "unavailable" ? <Pressable onPress={refresh} accessibilityRole="button" style={styles.inlineRetry}><RefreshCcw size={16} color={colors.primary} /><Text style={styles.inlineRetryText}>Try again</Text></Pressable> : null}</View>

          <Text style={styles.sectionTitle}>Marketplace Visibility Guide</Text>
          {filteredVisibility.length === 0 ? (
            <View style={styles.empty}><Text style={styles.muted}>No visibility ranking data recorded yet.</Text></View>
          ) : (
            filteredVisibility.map((v) => (
              <VisibilityBreakdownCard
                key={v.productId}
                item={v}
                productName={products.find((p) => p.id === v.productId)?.productName}
              />
            ))
          )}
        </> : <View style={styles.empty}><Text style={styles.emptyTitle}>No analytics for this selection</Text><Text style={styles.muted}>Choose another period, product, or unit.</Text></View>}
      </ScrollView>
    </SafeAreaView>
  );
}

function Metric({ title, value }: { title: string; value: string }) {
  return <View style={styles.metric}><Text style={styles.metricValue}>{value}</Text><Text style={styles.metricLabel}>{title}</Text></View>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.base, paddingBottom: spacing.xxxl },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: spacing.base },
  headerText: { flex: 1, marginRight: spacing.md },
  title: { fontFamily: fonts.heading.bold, fontSize: 28, lineHeight: 34, color: colors.text },
  muted: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, color: colors.textMuted },
  sectionTitle: { fontFamily: fonts.heading.semiBold, fontSize: 16, color: colors.text, marginTop: spacing.md, marginBottom: spacing.sm },
  chipRow: { flexDirection: "row", gap: spacing.sm },
  horizontalChips: { gap: spacing.sm, paddingBottom: spacing.xs },
  chip: { minHeight: 40, paddingHorizontal: spacing.md, borderRadius: radii.full, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" },
  chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontFamily: fonts.body.medium, fontSize: 13, color: colors.text },
  chipTextSelected: { color: colors.white, fontFamily: fonts.body.semiBold },
  errorBox: { backgroundColor: "rgba(184, 84, 80, 0.1)", borderWidth: 1, borderColor: colors.error, borderRadius: radii.card, padding: spacing.md, marginTop: spacing.base },
  errorText: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, color: colors.error },
  retry: { marginTop: spacing.sm },
  periodText: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted, marginTop: spacing.lg, marginBottom: spacing.sm },
  advisoryLink: { minHeight: 48, flexDirection: "row", alignItems: "center", gap: spacing.sm, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radii.button, paddingHorizontal: spacing.md, marginBottom: spacing.sm },
  advisoryLinkText: { fontFamily: fonts.body.semiBold, fontSize: 14, color: colors.primary },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  metric: { width: "48%", minHeight: 84, backgroundColor: colors.surface, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border, padding: spacing.md, justifyContent: "center" },
  metricValue: { fontFamily: fonts.heading.bold, fontSize: 18, color: colors.primary },
  metricLabel: { fontFamily: fonts.body.medium, fontSize: 12, color: colors.textMuted, marginTop: spacing.xs },
  card: { backgroundColor: colors.surface, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border, padding: spacing.base, marginTop: spacing.base },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.sm },
  cardTitle: { fontFamily: fonts.heading.semiBold, fontSize: 16, color: colors.text },
  cardValue: { fontFamily: fonts.body.semiBold, fontSize: 15, color: colors.text, lineHeight: 22 },
  cardMeta: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, color: colors.textMuted, marginTop: spacing.xs },
  summary: { fontFamily: fonts.body.regular, fontSize: 16, lineHeight: 24, color: colors.text },
  inlineRetry: { minHeight: touchTargets.min, flexDirection: "row", alignItems: "center", gap: spacing.xs, alignSelf: "flex-start" },
  inlineRetryText: { fontFamily: fonts.body.semiBold, fontSize: 14, color: colors.primary },
  empty: { alignItems: "center", paddingVertical: spacing.xxxl },
  emptyTitle: { fontFamily: fonts.heading.semiBold, fontSize: 18, color: colors.text, marginBottom: spacing.xs },
});
