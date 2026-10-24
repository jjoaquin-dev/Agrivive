import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, ScrollView, RefreshControl } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../../src/context/AuthContext";
import { useInventory } from "../../../src/features/inventory/hooks/useInventory";
import { fetchSellerNotifications } from "../../../src/features/notifications/api/seller-notifications";
import { fetchSellerMessages } from "../../../src/features/messages/api/seller-messages";
import { fetchSellerOrders } from "../../../src/features/orders/api/seller-orders";
import { fetchSellerAnalytics } from "../../../src/features/analytics/api/seller-analytics";
import { fetchSellerAdvisories } from "../../../src/features/advisories/api/seller-advisories";
import { fetchSellerBoostPrompts } from "../../../src/features/boost/api/visibility-boosts";
import type { SellerAnalyticsMetrics } from "../../../src/features/analytics/types";
import type { SellerAdvisoriesResponse } from "../../../src/features/advisories/types";
import { DashboardHeader } from "../../../src/features/dashboard/components/DashboardHeader";
import { DashboardTwinActions } from "../../../src/features/dashboard/components/DashboardTwinActions";
import { DashboardMetrics } from "../../../src/features/dashboard/components/DashboardMetrics";
import { DashboardAttentionGrid } from "../../../src/features/dashboard/components/DashboardAttentionGrid";
import { DashboardListingsSummary } from "../../../src/features/dashboard/components/DashboardListingsSummary";
import { DashboardReservationsSummary } from "../../../src/features/dashboard/components/DashboardReservationsSummary";
import { DashboardAnalyticsSection } from "../../../src/features/dashboard/components/DashboardAnalyticsSection";
import { DashboardAdvisoriesRow } from "../../../src/features/dashboard/components/DashboardAdvisoriesRow";
import { colors, spacing } from "../../../src/theme";

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { session, setup } = useAuth();
  const { summary, products, refreshing, refresh } = useInventory();

  const [unreadNotifs, setUnreadNotifs] = useState(0);
  const [openMessages, setOpenMessages] = useState(0);
  const [boostPromptsCount, setBoostPromptsCount] = useState(0);
  const [orderCounts, setOrderCounts] = useState({ active: 0, expiring: 0, completed: 0, cancelled: 0 });
  const [reservedKilos, setReservedKilos] = useState(0);
  const [analyticsPeriod, setAnalyticsPeriod] = useState<"today" | "7d" | "30d">("7d");
  const [analyticsMetrics, setAnalyticsMetrics] = useState<SellerAnalyticsMetrics | null>(null);
  const [analyticsSummary, setAnalyticsSummary] = useState<string | null>(null);
  const [advisories, setAdvisories] = useState<SellerAdvisoriesResponse | null>(null);

  const loadDashboardData = useCallback(async () => {
    const now = new Date();
    const daysAgo = analyticsPeriod === "today" ? 1 : analyticsPeriod === "7d" ? 7 : 30;
    const fromDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000).toISOString();

    await Promise.allSettled([
      fetchSellerNotifications({ limit: 1 }).then((res) => setUnreadNotifs(res.unreadCount)).catch(() => {}),
      fetchSellerMessages({ status: "open", limit: 1 }).then((res) => setOpenMessages(res.openCount)).catch(() => {}),
      fetchSellerBoostPrompts().then((res) => setBoostPromptsCount(res.items?.length || 0)).catch(() => {}),
      fetchSellerOrders({ limit: 100 }).then((res) => {
        const orders = res.orders || [];
        const active = orders.filter((o) => o.status === "pending");
        const completed = orders.filter((o) => o.status === "completed");
        const cancelled = orders.filter((o) => o.status === "cancelled" || o.status === "expired");
        const expiring = active.filter((o) => o.expiresAt && new Date(o.expiresAt).getTime() - Date.now() < 6 * 3600 * 1000);
        let resKg = 0;
        active.forEach((o) => o.items?.forEach((i) => { if (i.scalingType === "kilo") resKg += parseFloat(i.quantity || "0"); }));
        setOrderCounts({ active: active.length, expiring: expiring.length, completed: completed.length, cancelled: cancelled.length });
        setReservedKilos(Math.round(resKg));
      }).catch(() => {}),
      fetchSellerAnalytics({ from: fromDate, to: now.toISOString() }).then((res) => {
        setAnalyticsMetrics(res.metrics);
        setAnalyticsSummary(res.summary);
      }).catch(() => {}),
      fetchSellerAdvisories().then(setAdvisories).catch(() => {}),
    ]);
  }, [analyticsPeriod]);

  useEffect(() => { void loadDashboardData(); }, [loadDashboardData]);
  useFocusEffect(useCallback(() => { void loadDashboardData(); }, [loadDashboardData]));

  const handleRefresh = async () => {
    await Promise.allSettled([refresh(), loadDashboardData()]);
  };

  const sellerName = setup?.account?.name || session?.user?.name || "Maria Santos";
  const shopName = setup?.profile?.shopName;
  const detailAddress = setup?.profile?.detailAddress;
  const isVerified = setup?.sellerVerified ?? true;

  const reservedLabel = reservedKilos > 0 ? `${reservedKilos} kg reserved` : `${orderCounts.active} held`;
  const kiloTotal = Math.round(summary.unitTotals.kilo || 0);
  const sackTotal = Math.round(summary.unitTotals.sack || 0);
  const availableSurplusLabel = `${kiloTotal} kg · ${sackTotal} sacks`;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.container, { paddingTop: insets.top + spacing.xs }]}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[colors.primary]} tintColor={colors.primary} />}
    >
      <DashboardHeader
        sellerName={sellerName}
        shopName={shopName}
        detailAddress={detailAddress}
        isVerified={isVerified}
        unreadCount={unreadNotifs}
        onPressNotifications={() => router.push("/(app)/notifications")}
        onPressProfile={() => router.push("/(app)/(tabs)/profile")}
      />

      <DashboardTwinActions
        onAddProduct={() => router.push("/(app)/inventory/create")}
        onScanQR={() => router.push("/(app)/orders/scan")}
      />

      <DashboardMetrics
        activeListingsCount={summary.activeCount}
        reservedLabel={reservedLabel}
        completedPickupsCount={orderCounts.completed}
        availableSurplusLabel={availableSurplusLabel}
        onPressListings={() => router.push("/(app)/(tabs)/inventory")}
        onPressReservations={() => router.push("/(app)/(tabs)/orders")}
      />

      <DashboardAttentionGrid
        expiringCount={orderCounts.expiring}
        lowStockCount={summary.lowStockCount}
        openMessageCount={openMessages}
        contentReadyCount={boostPromptsCount}
        onPressExpiring={() => router.push("/(app)/(tabs)/orders")}
        onPressLowStock={() => router.push("/(app)/(tabs)/inventory")}
        onPressMessages={() => router.push("/(app)/(tabs)/messages")}
        onPressWeather={() => router.push("/(app)/advisories")}
        onPressContent={() => router.push("/(app)/boosts")}
        onPressUpdate={() => router.push("/(app)/activity")}
      />

      <DashboardListingsSummary
        activeCount={summary.activeCount}
        draftCount={products.filter((p) => !p.isMarketable || !p.isActive).length}
        reservedCount={orderCounts.active}
        soldOutCount={summary.outOfStockCount}
        onViewAll={() => router.push("/(app)/(tabs)/inventory")}
      />

      <DashboardReservationsSummary
        activeCount={orderCounts.active}
        expiringCount={orderCounts.expiring}
        completedCount={orderCounts.completed}
        cancelledCount={orderCounts.cancelled}
        onViewAll={() => router.push("/(app)/(tabs)/orders")}
      />

      <DashboardAnalyticsSection
        metrics={analyticsMetrics}
        summaryText={analyticsSummary}
        selectedPeriod={analyticsPeriod}
        onChangePeriod={setAnalyticsPeriod}
        onFullView={() => router.push("/(app)/analytics")}
        products={products}
      />

      <DashboardAdvisoriesRow
        temperatureC={advisories?.weather?.current?.temperatureC ?? 34}
        precipitationProbability={advisories?.weather?.current?.precipitationProbability ?? 82}
        weatherTip={advisories?.reminders?.[0]?.message || "Inspect produce listings for ambient heat impact."}
        holidayName={advisories?.holidays?.upcoming?.[0]?.name || "National Heroes Day"}
        holidayDate={advisories?.holidays?.upcoming?.[0]?.date || "Aug 31"}
        onReviewWeather={() => router.push("/(app)/advisories")}
        onViewHoliday={() => router.push("/(app)/advisories")}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8F6F1",
  },
  container: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.xl,
  },
});
