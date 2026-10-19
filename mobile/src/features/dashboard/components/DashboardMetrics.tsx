import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { Package, AlertTriangle, AlertCircle } from "lucide-react-native";
import { colors, fonts, radii, spacing, shadows } from "../../../theme";
import { DashboardUnitTotals } from "./DashboardUnitTotals";
import type { InventorySummary } from "../../inventory/types";

interface DashboardMetricsProps {
  summary: InventorySummary;
  onPressInventory: () => void;
}

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({
  summary,
  onPressInventory,
}) => {
  const hasLowStock = summary.lowStockCount > 0;
  const hasOutOfStock = summary.outOfStockCount > 0;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeading}>Inventory Overview</Text>

      <View style={styles.metricsGrid}>
        <Pressable
          onPress={onPressInventory}
          accessibilityRole="button"
          accessibilityLabel="Total products in inventory"
          style={({ pressed }) => [styles.metricCard, pressed && styles.cardPressed]}
        >
          <View style={styles.metricIconWrap}>
            <Package size={20} color={colors.primary} />
          </View>
          <Text style={styles.metricNumber}>{summary.totalProducts}</Text>
          <Text style={styles.metricLabel}>Total Produce</Text>
        </Pressable>

        <Pressable
          onPress={onPressInventory}
          accessibilityRole="button"
          accessibilityLabel="Products with a low amount"
          style={({ pressed }) => [
            styles.metricCard,
            hasLowStock && styles.metricCardWarning,
            pressed && styles.cardPressed,
          ]}
        >
          <View style={[styles.metricIconWrap, hasLowStock && styles.metricIconWrapWarning]}>
            <AlertTriangle size={20} color={hasLowStock ? colors.warning : colors.textMuted} />
          </View>
          <Text style={[styles.metricNumber, hasLowStock && styles.metricNumberWarning]}>
            {summary.lowStockCount}
          </Text>
          <Text style={styles.metricLabel}>Low Amount</Text>
        </Pressable>

        <Pressable
          onPress={onPressInventory}
          accessibilityRole="button"
          accessibilityLabel="Out of stock products"
          style={({ pressed }) => [
            styles.metricCard,
            hasOutOfStock && styles.metricCardError,
            pressed && styles.cardPressed,
          ]}
        >
          <View style={[styles.metricIconWrap, hasOutOfStock && styles.metricIconWrapError]}>
            <AlertCircle size={20} color={hasOutOfStock ? colors.error : colors.textMuted} />
          </View>
          <Text style={[styles.metricNumber, hasOutOfStock && styles.metricNumberError]}>
            {summary.outOfStockCount}
          </Text>
          <Text style={styles.metricLabel}>Out of Stock</Text>
        </Pressable>
      </View>

      <DashboardUnitTotals unitTotals={summary.unitTotals} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.base,
  },
  sectionHeading: {
    fontFamily: fonts.heading.bold,
    fontSize: 18,
    color: colors.text,
    marginBottom: spacing.sm,
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
    ...shadows.card,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
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
});
