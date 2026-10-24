import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, ScrollView, RefreshControl } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../../src/context/AuthContext";
import { useInventory } from "../../../src/features/inventory/hooks/useInventory";
import { fetchStockAdjustments } from "../../../src/features/inventory/api/stock-adjustments";
import type { StockAdjustment } from "../../../src/features/inventory/types";
import { fetchSellerNotifications } from "../../../src/features/notifications/api/seller-notifications";
import { fetchSellerMessages } from "../../../src/features/messages/api/seller-messages";
import { DashboardHeader } from "../../../src/features/dashboard/components/DashboardHeader";
import { DashboardTwinActions } from "../../../src/features/dashboard/components/DashboardTwinActions";
import { DashboardMetrics } from "../../../src/features/dashboard/components/DashboardMetrics";
import { DashboardOperationsHub } from "../../../src/features/dashboard/components/DashboardOperationsHub";
import { DashboardLowStockAlerts } from "../../../src/features/dashboard/components/DashboardLowStockAlerts";
import { DashboardRecentActivity } from "../../../src/features/dashboard/components/DashboardRecentActivity";
import { colors, spacing } from "../../../src/theme";

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { session, setup } = useAuth();
  const { summary, lowStockProducts, refreshing, refresh } = useInventory();
  const [recentActivity, setRecentActivity] = useState<StockAdjustment[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [openMessageCount, setOpenMessageCount] = useState(0);

  const loadRecentActivity = async () => {
    setLoadingActivity(true);
    try {
      const res = await fetchStockAdjustments({ limit: 4 });
      setRecentActivity(res.items);
    } catch (err) {
      console.error("Failed to load recent activity", err);
    } finally {
      setLoadingActivity(false);
    }
  };

  useEffect(() => {
    void loadRecentActivity();
  }, []);

  const loadUnreadCounts = useCallback(async () => {
    try {
      const [notifRes, msgRes] = await Promise.all([
        fetchSellerNotifications({ limit: 1 }),
        fetchSellerMessages({ status: "open", limit: 1 }),
      ]);
      setUnreadCount(notifRes.unreadCount);
      setOpenMessageCount(msgRes.openCount);
    } catch (err) {
      console.error("Failed to load notification/message count", err);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadUnreadCounts();
    }, [loadUnreadCounts]),
  );

  const handleRefresh = async () => {
    await Promise.all([refresh(), loadRecentActivity(), loadUnreadCounts()]);
  };

  const sellerName = setup?.account?.name || session?.user?.name || "Seller";
  const shopName = setup?.profile?.shopName;
  const isVerified = setup?.sellerVerified ?? false;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.container, { paddingTop: insets.top + spacing.xs }]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
    >
      <DashboardHeader
        sellerName={sellerName}
        shopName={shopName}
        isVerified={isVerified}
        unreadCount={unreadCount}
        openMessageCount={openMessageCount}
        onPressNotifications={() => router.push("/(app)/notifications")}
        onPressProfile={() => router.push("/(app)/(tabs)/profile")}
      />

      <DashboardTwinActions
        onAddProduct={() => router.push("/(app)/inventory/create")}
        onScanQR={() => router.push("/(app)/orders/scan")}
      />

      <DashboardMetrics
        summary={summary}
        onPressInventory={() => router.push("/(app)/(tabs)/inventory")}
      />

      <DashboardOperationsHub
        lowStockCount={summary.lowStockCount}
        openMessageCount={openMessageCount}
        onPressInventory={() => router.push("/(app)/(tabs)/inventory")}
        onPressMessages={() => router.push("/(app)/(tabs)/messages")}
        onAnalytics={() => router.push("/(app)/analytics")}
        onBoosts={() => router.push("/(app)/boosts")}
        onActivity={() => router.push("/(app)/activity")}
        onAdvisories={() => router.push("/(app)/advisories")}
      />

      <DashboardLowStockAlerts
        products={lowStockProducts}
        onSeeAll={() => router.push("/(app)/(tabs)/inventory")}
        onStockIn={(productId) =>
          router.push({
            pathname: "/(app)/inventory/[id]/stock",
            params: { id: productId, type: "in" },
          })
        }
      />

      <DashboardRecentActivity
        activity={recentActivity}
        loading={loadingActivity}
        onViewHistory={() => router.push("/(app)/activity")}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.xxl,
  },
});
