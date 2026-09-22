import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Package,
  AlertTriangle,
  AlertCircle,
  Plus,
  ArrowRight,
  TrendingUp,
  History,
  Store,
} from "lucide-react-native";
import { useAuth } from "../../../src/context/AuthContext";
import { useInventory } from "../../../src/features/inventory/hooks/useInventory";
import { fetchStockAdjustments } from "../../../src/features/inventory/api/stock-adjustments";
import type { StockAdjustment } from "../../../src/features/inventory/types";
import { colors, fonts, radii, spacing, touchTargets } from "../../../src/theme";

export default function HomeScreen() {
  const router = useRouter();
  const { session, setup } = useAuth();
  const { summary, lowStockProducts, loading, refreshing, refresh } = useInventory();
  const [recentActivity, setRecentActivity] = useState<StockAdjustment[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(false);

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
    loadRecentActivity();
  }, []);

  const handleRefresh = async () => {
    await Promise.all([refresh(), loadRecentActivity()]);
  };

  const sellerName = setup?.account?.name || session?.user?.name || "Seller";
  const shopName = setup?.profile?.shopName;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
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
      {/* 1. Header Greeting */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Maayong adlaw,</Text>
        <Text style={styles.sellerName}>{sellerName}</Text>
        {shopName ? (
          <View style={styles.shopBadge}>
            <Store size={14} color={colors.primary} style={{ marginRight: 4 }} />
            <Text style={styles.shopText}>{shopName}</Text>
          </View>
        ) : null}
      </View>

      {/* 2. Overview Metrics Cards */}
      <Text style={styles.sectionHeading}>Inventory Overview</Text>
      <View style={styles.metricsGrid}>
        <Pressable
          onPress={() => router.push("/(app)/(tabs)/inventory")}
          accessibilityRole="button"
          accessibilityLabel="Total products in inventory"
          style={styles.metricCard}
        >
          <View style={styles.metricIconWrap}>
            <Package size={20} color={colors.primary} />
          </View>
          <Text style={styles.metricNumber}>{summary.totalProducts}</Text>
          <Text style={styles.metricLabel}>Total Products</Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/(app)/(tabs)/inventory")}
          accessibilityRole="button"
          accessibilityLabel="Products with a low amount"
          style={[styles.metricCard, summary.lowStockCount > 0 && styles.metricCardWarning]}
        >
          <View
            style={[
              styles.metricIconWrap,
              summary.lowStockCount > 0 && styles.metricIconWrapWarning,
            ]}
          >
            <AlertTriangle
              size={20}
              color={summary.lowStockCount > 0 ? colors.warning : colors.textMuted}
            />
          </View>
          <Text
            style={[
              styles.metricNumber,
              summary.lowStockCount > 0 && styles.metricNumberWarning,
            ]}
          >
            {summary.lowStockCount}
          </Text>
          <Text style={styles.metricLabel}>Low Amount</Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/(app)/(tabs)/inventory")}
          accessibilityRole="button"
          accessibilityLabel="Out of stock products"
          style={[styles.metricCard, summary.outOfStockCount > 0 && styles.metricCardError]}
        >
          <View
            style={[
              styles.metricIconWrap,
              summary.outOfStockCount > 0 && styles.metricIconWrapError,
            ]}
          >
            <AlertCircle
              size={20}
              color={summary.outOfStockCount > 0 ? colors.error : colors.textMuted}
            />
          </View>
          <Text
            style={[
              styles.metricNumber,
              summary.outOfStockCount > 0 && styles.metricNumberError,
            ]}
          >
            {summary.outOfStockCount}
          </Text>
          <Text style={styles.metricLabel}>Out of Stock</Text>
        </Pressable>
      </View>

      {/* 3. Grouped Unit Totals */}
      <View style={styles.unitTotalsCard}>
        <View style={styles.unitTotalsHeader}>
          <TrendingUp size={16} color={colors.primary} style={{ marginRight: 6 }} />
          <Text style={styles.unitTotalsTitle}>Quantity Totals by Selling Unit</Text>
        </View>
        <Text style={styles.unitTotalsHint}>
          Units are grouped separately because kilograms, sacks, and piles cannot be summed.
        </Text>
        <View style={styles.unitRow}>
          <View style={styles.unitItem}>
            <Text style={styles.unitValue}>{summary.unitTotals.kilo.toFixed(1)}</Text>
            <Text style={styles.unitName}>Kilograms (kg)</Text>
          </View>
          <View style={styles.unitDivider} />
          <View style={styles.unitItem}>
            <Text style={styles.unitValue}>{summary.unitTotals.sack.toFixed(1)}</Text>
            <Text style={styles.unitName}>Sacks</Text>
          </View>
          <View style={styles.unitDivider} />
          <View style={styles.unitItem}>
            <Text style={styles.unitValue}>{summary.unitTotals.pile.toFixed(1)}</Text>
            <Text style={styles.unitName}>Piles (Tumpok)</Text>
          </View>
        </View>
      </View>

      {/* 4. Quick Actions */}
      <Text style={styles.sectionHeading}>Quick Actions</Text>
      <View style={styles.actionsRow}>
        <Pressable
          onPress={() => router.push("/(app)/inventory/create")}
          accessibilityRole="button"
          accessibilityLabel="Add new produce product"
          style={styles.actionButtonPrimary}
        >
          <Plus size={18} color={colors.white} style={{ marginRight: 6 }} />
          <Text style={styles.actionButtonTextPrimary}>Add Product</Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/(app)/(tabs)/inventory")}
          accessibilityRole="button"
          accessibilityLabel="Manage current inventory"
          style={styles.actionButtonSecondary}
        >
          <Package size={18} color={colors.primary} style={{ marginRight: 6 }} />
          <Text style={styles.actionButtonTextSecondary}>Manage Inventory</Text>
        </Pressable>
      </View>

      {/* 5. Low Stock Alerts Section */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionHeading}>Low Amount Alerts</Text>
        {lowStockProducts.length > 0 ? (
          <Pressable
            onPress={() => router.push("/(app)/(tabs)/inventory")}
            accessibilityRole="button"
            accessibilityLabel="See all low amount products"
            style={styles.seeAllButton}
          >
            <Text style={styles.seeAllText}>See all ({lowStockProducts.length})</Text>
            <ArrowRight size={14} color={colors.primary} />
          </Pressable>
        ) : null}
      </View>

      {lowStockProducts.length === 0 ? (
        <View style={styles.emptyAlertCard}>
          <Text style={styles.emptyAlertTitle}>✓ Everything looks good</Text>
          <Text style={styles.emptyAlertSub}>
            No products need more amount right now.
          </Text>
        </View>
      ) : (
        lowStockProducts.slice(0, 3).map((item) => {
          const qty = parseFloat(item.productQty as string) || 0;
          const unit = item.scalingType === "kilo" ? "kg" : item.scalingType;
          const min =
            item.lowStockThreshold != null
              ? parseFloat(item.lowStockThreshold as string).toFixed(2)
              : "-";

          return (
            <View key={item.id} style={styles.alertCard}>
              <View style={styles.alertInfo}>
                <Text style={styles.alertProductName}>{item.productName}</Text>
                <Text style={styles.alertStockText}>
                  <Text style={styles.alertStockHighlight}>
                    {qty.toFixed(2)} {unit}
                  </Text>{" "}
                  remaining (Alert at: {min} {unit})
                </Text>
              </View>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/(app)/inventory/[id]/stock",
                    params: { id: item.id, type: "in" },
                  })
                }
                accessibilityRole="button"
                accessibilityLabel={`Add more ${item.productName}`}
                style={styles.alertStockInButton}
              >
                <Text style={styles.alertStockInText}>Add More</Text>
              </Pressable>
            </View>
          );
        })
      )}

      {/* 6. Recent Stock Activity Section */}
      <View style={[styles.sectionHeaderRow, { marginTop: spacing.xl }]}>
        <Text style={styles.sectionHeading}>Recent Amount Changes</Text>
        <Pressable
          onPress={() => router.push("/(app)/(tabs)/activity")}
          accessibilityRole="button"
          accessibilityLabel="View all amount changes"
          style={styles.seeAllButton}
        >
          <Text style={styles.seeAllText}>Full History</Text>
          <History size={14} color={colors.primary} />
        </Pressable>
      </View>

      {loadingActivity ? (
        <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: spacing.base }} />
      ) : recentActivity.length === 0 ? (
        <View style={styles.emptyAlertCard}>
          <Text style={styles.emptyAlertSub}>
            No amount changes recorded yet. Add products or change an amount to see history.
          </Text>
        </View>
      ) : (
        <View style={styles.activityCard}>
          {recentActivity.map((act, index) => {
            const isPositive = parseFloat(act.delta) >= 0;
            const unit = act.scalingType === "kilo" ? "kg" : act.scalingType;
            const dateStr = new Date(act.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <View
                key={act.id}
                style={[
                  styles.activityRow,
                  index < recentActivity.length - 1 && styles.activityRowDivider,
                ]}
              >
                <View style={styles.activityLeft}>
                  <Text style={styles.activityProduct}>{act.productName}</Text>
                  <Text style={styles.activityReason}>{act.reason}</Text>
                </View>
                <View style={styles.activityRight}>
                  <Text
                    style={[
                      styles.activityDelta,
                      isPositive ? styles.activityPositive : styles.activityNegative,
                    ]}
                  >
                    {isPositive ? `+${parseFloat(act.delta).toFixed(2)}` : parseFloat(act.delta).toFixed(2)} {unit}
                  </Text>
                  <Text style={styles.activityTime}>{dateStr}</Text>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
    paddingBottom: spacing.xxxl,
  },
  header: {
    marginBottom: spacing.base,
  },
  greeting: {
    fontFamily: fonts.body.regular,
    fontSize: 14,
    color: colors.textMuted,
  },
  sellerName: {
    fontFamily: fonts.heading.bold,
    fontSize: 24,
    color: colors.text,
    marginTop: 2,
  },
  shopBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(31, 77, 58, 0.08)",
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radii.full,
    marginTop: spacing.xs,
  },
  shopText: {
    fontFamily: fonts.body.medium,
    fontSize: 12,
    color: colors.primary,
  },
  sectionHeading: {
    fontFamily: fonts.heading.bold,
    fontSize: 18,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.base,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.xs,
  },
  seeAllText: {
    fontFamily: fonts.body.semiBold,
    fontSize: 13,
    color: colors.primary,
    marginRight: 4,
  },
  metricsGrid: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.base,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    alignItems: "center",
  },
  metricCardWarning: {
    borderColor: colors.warning,
    backgroundColor: "rgba(199, 149, 62, 0.05)",
  },
  metricCardError: {
    borderColor: colors.error,
    backgroundColor: "rgba(184, 84, 80, 0.05)",
  },
  metricIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(31, 77, 58, 0.08)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  metricIconWrapWarning: {
    backgroundColor: "rgba(199, 149, 62, 0.15)",
  },
  metricIconWrapError: {
    backgroundColor: "rgba(184, 84, 80, 0.12)",
  },
  metricNumber: {
    fontFamily: fonts.heading.bold,
    fontSize: 24,
    color: colors.text,
  },
  metricNumberWarning: {
    color: colors.warning,
  },
  metricNumberError: {
    color: colors.error,
  },
  metricLabel: {
    fontFamily: fonts.body.medium,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
    textAlign: "center",
  },
  unitTotalsCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
    marginBottom: spacing.base,
  },
  unitTotalsHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  unitTotalsTitle: {
    fontFamily: fonts.body.semiBold,
    fontSize: 14,
    color: colors.text,
  },
  unitTotalsHint: {
    fontFamily: fonts.body.regular,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
    marginBottom: spacing.sm,
  },
  unitRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  unitItem: {
    flex: 1,
    alignItems: "center",
  },
  unitValue: {
    fontFamily: fonts.heading.bold,
    fontSize: 18,
    color: colors.primary,
  },
  unitName: {
    fontFamily: fonts.body.regular,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  unitDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.border,
  },
  actionsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.base,
  },
  actionButtonPrimary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    height: touchTargets.min,
    borderRadius: radii.button,
  },
  actionButtonTextPrimary: {
    color: colors.white,
    fontFamily: fonts.body.semiBold,
    fontSize: 14,
  },
  actionButtonSecondary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    height: touchTargets.min,
    borderRadius: radii.button,
  },
  actionButtonTextSecondary: {
    color: colors.primary,
    fontFamily: fonts.body.semiBold,
    fontSize: 14,
  },
  emptyAlertCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  emptyAlertTitle: {
    fontFamily: fonts.body.semiBold,
    fontSize: 14,
    color: colors.success,
    marginBottom: 2,
  },
  emptyAlertSub: {
    fontFamily: fonts.body.regular,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: "center",
  },
  alertCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
    marginBottom: spacing.xs,
  },
  alertInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  alertProductName: {
    fontFamily: fonts.heading.bold,
    fontSize: 15,
    color: colors.text,
  },
  alertStockText: {
    fontFamily: fonts.body.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  alertStockHighlight: {
    color: colors.warning,
    fontFamily: fonts.body.semiBold,
  },
  alertStockInButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radii.button,
  },
  alertStockInText: {
    color: colors.white,
    fontFamily: fonts.body.semiBold,
    fontSize: 12,
  },
  activityCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.base,
  },
  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
  },
  activityRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  activityLeft: {
    flex: 1,
  },
  activityProduct: {
    fontFamily: fonts.heading.bold,
    fontSize: 14,
    color: colors.text,
  },
  activityReason: {
    fontFamily: fonts.body.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  activityRight: {
    alignItems: "flex-end",
  },
  activityDelta: {
    fontFamily: fonts.heading.bold,
    fontSize: 14,
  },
  activityPositive: {
    color: colors.success,
  },
  activityNegative: {
    color: colors.error,
  },
  activityTime: {
    fontFamily: fonts.body.regular,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
});
