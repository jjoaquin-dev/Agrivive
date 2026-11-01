import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, ScrollView, RefreshControl, View, Text, Pressable } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CloudOff } from "lucide-react-native";
import { useAuth } from "../../../src/context/AuthContext";
import { useInventory } from "../../../src/features/inventory/hooks/useInventory";
import { fetchStockAdjustments } from "../../../src/features/inventory/api/stock-adjustments";
import type { StockAdjustment } from "../../../src/features/inventory/types";
import { fetchSellerNotifications } from "../../../src/features/notifications/api/seller-notifications";
import { fetchConversationUnreadCount } from "../../../src/features/conversations/api";
import { DashboardHeader } from "../../../src/features/dashboard/components/DashboardHeader";
import { DashboardTwinActions } from "../../../src/features/dashboard/components/DashboardTwinActions";
import { DashboardMetrics } from "../../../src/features/dashboard/components/DashboardMetrics";
import { DashboardOperationsHub } from "../../../src/features/dashboard/components/DashboardOperationsHub";
import { DashboardLowStockAlerts } from "../../../src/features/dashboard/components/DashboardLowStockAlerts";
import { DashboardRecentActivity } from "../../../src/features/dashboard/components/DashboardRecentActivity";
import { colors, fonts, radii, shadows, spacing, typography } from "../../../src/theme";

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { session, setup } = useAuth();
  const { summary, lowStockProducts, loading: inventoryLoading, refreshing, refresh, error: inventoryError } = useInventory();
  const [recentActivity, setRecentActivity] = useState<StockAdjustment[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(true);
  const [activityError, setActivityError] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [openMessageCount, setOpenMessageCount] = useState(0);

  const loadRecentActivity = async () => {
    setLoadingActivity(true);
    setActivityError(false);
    try {
      const res = await fetchStockAdjustments({ limit: 4 });
      setRecentActivity(res.items);
    } catch (err) {
      console.error("Failed to load recent activity", err);
      setActivityError(true);
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
        fetchConversationUnreadCount(),
      ]);
      setUnreadCount(notifRes.unreadCount);
      setOpenMessageCount(msgRes.unreadMessages ?? 0);
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

      {inventoryError ? (
        <View style={styles.errorCard}>
          <View style={styles.errorIconWrap}>
            <CloudOff size={20} color={colors.warning} />
          </View>
          <View style={styles.errorBody}>
            <Text style={styles.errorTitle}>Couldn't load your stock.</Text>
            <Text style={styles.errorSub}>Tap to retry loading your latest inventory.</Text>
          </View>
          <Pressable
            onPress={handleRefresh}
            accessibilityRole="button"
            accessibilityLabel="Retry loading stock"
            style={({ pressed }) => [styles.retryButton, pressed && styles.retryButtonPressed]}
          >
            <Text style={styles.retryText}>Try Again</Text>
          </Pressable>
        </View>
      ) : null}

      <DashboardMetrics
        summary={summary}
        loading={inventoryLoading}
        error={!!inventoryError && !inventoryLoading}
        onPressInventory={() => router.push("/(app)/(tabs)/inventory")}
      />

      <DashboardLowStockAlerts
        products={lowStockProducts}
        loading={inventoryLoading}
        error={!!inventoryError && !inventoryLoading}
        onSeeAll={() => router.push("/(app)/(tabs)/inventory")}
        onStockIn={(productId) =>
          router.push({
            pathname: "/(app)/inventory/[id]/stock",
            params: { id: productId, type: "in" },
          })
        }
      />

      <DashboardOperationsHub
        onAnalytics={() => router.push("/(app)/analytics")}
        onMarketing={() => router.push("/(app)/marketing")}
        onActivity={() => router.push("/(app)/activity")}
        onAdvisories={() => router.push("/(app)/advisories")}
      />

      <DashboardRecentActivity
        activity={recentActivity}
        loading={loadingActivity}
        error={activityError}
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
  errorCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: "#FED7AA",
    padding: spacing.md,
    marginBottom: spacing.base,
    ...shadows.card,
  },
  errorIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFF7ED",
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  errorBody: {
    flex: 1,
  },
  errorTitle: {
    fontFamily: fonts.body.semiBold,
    fontSize: 14,
    color: colors.text,
  },
  errorSub: {
    fontFamily: fonts.body.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  retryButton: {
    paddingHorizontal: spacing.md,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: radii.button,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginLeft: spacing.xs,
  },
  retryButtonPressed: {
    backgroundColor: colors.surfaceMuted,
  },
  retryText: {
    fontFamily: fonts.body.semiBold,
    fontSize: 13,
    color: colors.text,
  },
});
