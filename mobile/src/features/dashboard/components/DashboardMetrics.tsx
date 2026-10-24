import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { ClipboardList, TriangleAlert, Package, Leaf, ChevronRight } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import type { InventorySummary } from "../../inventory/types";

interface DashboardMetricsProps {
  summary: InventorySummary;
  onPressInventory: () => void;
}

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({
  summary,
  onPressInventory,
}) => {
  const kiloTotal = Math.round(summary.unitTotals?.kilo || 0);
  const sackTotal = Math.round(summary.unitTotals?.sack || 0);
  const surplusLabel = `${kiloTotal} kg · ${sackTotal} sacks`;

  return (
    <View style={styles.grid}>
      {/* 1. Active Listings */}
      <Pressable
        onPress={onPressInventory}
        accessibilityRole="button"
        accessibilityLabel="Active produce listings"
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      >
        <View style={styles.cardTop}>
          <ClipboardList size={18} color="#16A34A" />
          <ChevronRight size={14} color="#9CA3AF" />
        </View>
        <Text style={[styles.cardValue, { color: "#16A34A" }]}>
          {summary.activeCount}
        </Text>
        <Text style={styles.cardTitle}>Active Listings</Text>
        <Text style={styles.cardSubtitle}>Visible to buyers</Text>
      </Pressable>

      {/* 2. Low Amount */}
      <Pressable
        onPress={onPressInventory}
        accessibilityRole="button"
        accessibilityLabel="Produce with low stock"
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      >
        <View style={styles.cardTop}>
          <TriangleAlert size={18} color="#D97706" />
          <ChevronRight size={14} color="#9CA3AF" />
        </View>
        <Text style={[styles.cardValue, { color: "#D97706" }]}>
          {summary.lowStockCount}
        </Text>
        <Text style={styles.cardTitle}>Low Amount</Text>
        <Text style={styles.cardSubtitle}>Needs attention</Text>
      </Pressable>

      {/* 3. Out of Stock */}
      <Pressable
        onPress={onPressInventory}
        accessibilityRole="button"
        accessibilityLabel="Out of stock produce"
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      >
        <View style={styles.cardTop}>
          <Package size={18} color="#DC2626" />
          <ChevronRight size={14} color="#9CA3AF" />
        </View>
        <Text style={[styles.cardValue, { color: "#DC2626" }]}>
          {summary.outOfStockCount}
        </Text>
        <Text style={styles.cardTitle}>Out of Stock</Text>
        <Text style={styles.cardSubtitle}>Depleted produce</Text>
      </Pressable>

      {/* 4. Available Surplus */}
      <Pressable
        onPress={onPressInventory}
        accessibilityRole="button"
        accessibilityLabel="Available surplus total volume"
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      >
        <View style={styles.cardTop}>
          <Leaf size={18} color="#4F46E5" />
          <ChevronRight size={14} color="#9CA3AF" />
        </View>
        <Text style={[styles.cardValue, { color: "#4F46E5", fontSize: 16 }]} numberOfLines={1}>
          {surplusLabel}
        </Text>
        <Text style={styles.cardTitle}>Available Surplus</Text>
        <Text style={styles.cardSubtitle}>Across active listings</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.base,
  },
  card: {
    width: "48.5%",
    backgroundColor: "#FFFFFF",
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 12,
    minHeight: 110,
    justifyContent: "space-between",
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardValue: {
    fontFamily: fonts.heading.bold,
    fontSize: 22,
    marginTop: 8,
    marginBottom: 2,
    letterSpacing: -0.3,
  },
  cardTitle: {
    fontFamily: fonts.heading.bold,
    fontSize: 13,
    color: colors.text,
  },
  cardSubtitle: {
    fontFamily: fonts.body.regular,
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 1,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
});
