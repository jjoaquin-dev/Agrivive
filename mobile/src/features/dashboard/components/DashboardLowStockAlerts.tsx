import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { ArrowRight, CheckCircle2 } from "lucide-react-native";
import { colors, fonts, radii, spacing, shadows, typography } from "../../../theme";
import type { Product } from "../../inventory/types";
import { LowStockError, LowStockSkeleton } from "./DashboardLowStockStates";

interface DashboardLowStockAlertsProps {
  products: Product[];
  onSeeAll: () => void;
  onStockIn: (productId: string) => void;
  loading?: boolean;
  error?: boolean;
}

const formatUnitString = (qty: number, scalingType: string): string => {
  if (scalingType === "kilo") return "kg";
  if (scalingType === "sack") return qty === 1 ? "sack" : "sacks";
  if (scalingType === "pile") return qty === 1 ? "pile" : "piles";
  return scalingType;
};

const formatNumber = (num: number): string => {
  return Number.isInteger(num) ? String(num) : String(num);
};

export const DashboardLowStockAlerts: React.FC<DashboardLowStockAlertsProps> = ({
  products,
  onSeeAll,
  onStockIn,
  loading = false,
  error = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionHeading}>Running Low</Text>
        {!loading && !error && products.length > 0 ? (
          <Pressable
            onPress={onSeeAll}
            accessibilityRole="button"
            accessibilityLabel={`See all ${products.length} running low products`}
            style={styles.seeAllButton}
          >
            <Text style={styles.seeAllText}>See all ({products.length})</Text>
            <ArrowRight size={14} color={colors.primary} />
          </Pressable>
        ) : null}
      </View>

      {loading ? (
        <LowStockSkeleton />
      ) : error ? (
        <LowStockError />
      ) : products.length === 0 ? (
        <View style={styles.emptyCard}>
          <CheckCircle2 size={24} color={colors.success} />
          <Text style={styles.emptyTitle}>All stocked up</Text>
          <Text style={styles.emptySub}>Nothing is running low right now.</Text>
        </View>
      ) : (
        products.slice(0, 3).map((item) => {
          const qty = parseFloat(item.productQty as string) || 0;
          const unit = formatUnitString(qty, item.scalingType);
          const threshold =
            item.lowStockThreshold != null
              ? parseFloat(item.lowStockThreshold as string)
              : null;
          const thresholdUnit = threshold != null ? formatUnitString(threshold, item.scalingType) : unit;
          const thresholdStr = threshold != null ? `${formatNumber(threshold)} ${thresholdUnit}` : "-";

          return (
            <View key={item.id} style={styles.alertCard}>
              <View style={styles.alertInfo}>
                <Text style={styles.productName}>{item.productName}</Text>
                <Text style={styles.stockText}>
                  <Text style={styles.stockHighlight}>{formatNumber(qty)} {unit} left</Text>
                  {" · alert at "}{thresholdStr}
                </Text>
              </View>
              <Pressable
                onPress={() => onStockIn(item.id)}
                accessibilityRole="button"
                accessibilityLabel={`Add more ${item.productName}`}
                style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}
              >
                <Text style={styles.actionButtonText}>Add More</Text>
              </Pressable>
            </View>
          );
        })
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  sectionHeading: {
    ...typography.sectionHeading,
    fontFamily: fonts.heading.bold,
    color: colors.text,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.xs,
  },
  seeAllText: {
    ...typography.label,
    fontFamily: fonts.body.semiBold,
    color: colors.primary,
    marginRight: 4,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
    alignItems: "center",
    gap: spacing.xs,
    ...shadows.card,
  },
  emptyTitle: {
    fontFamily: fonts.body.semiBold,
    fontSize: 14,
    color: colors.text,
    marginTop: 2,
  },
  emptySub: {
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
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.card,
  },
  alertInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  productName: {
    ...typography.bodyLarge,
    fontFamily: fonts.heading.semiBold,
    color: colors.text,
  },
  stockText: {
    fontFamily: fonts.body.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  stockHighlight: {
    color: colors.warning,
    fontFamily: fonts.body.semiBold,
  },
  actionButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.base,
    height: 44,
    justifyContent: "center",
    borderRadius: radii.button,
  },
  actionButtonPressed: {
    transform: [{ scale: 0.98 }],
    backgroundColor: colors.primaryPressed,
  },
  actionButtonText: {
    color: colors.white,
    fontFamily: fonts.body.semiBold,
    fontSize: 13,
  },
});
