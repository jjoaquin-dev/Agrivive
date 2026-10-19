import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { ArrowRight } from "lucide-react-native";
import { colors, fonts, radii, spacing, shadows } from "../../../theme";
import type { Product } from "../../inventory/types";

interface DashboardLowStockAlertsProps {
  products: Product[];
  onSeeAll: () => void;
  onStockIn: (productId: string) => void;
}

export const DashboardLowStockAlerts: React.FC<DashboardLowStockAlertsProps> = ({
  products,
  onSeeAll,
  onStockIn,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionHeading}>Low Amount Alerts</Text>
        {products.length > 0 ? (
          <Pressable
            onPress={onSeeAll}
            accessibilityRole="button"
            accessibilityLabel={`See all ${products.length} low amount products`}
            style={styles.seeAllButton}
          >
            <Text style={styles.seeAllText}>See all ({products.length})</Text>
            <ArrowRight size={14} color={colors.primary} />
          </Pressable>
        ) : null}
      </View>

      {products.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>✓ Everything looks good</Text>
          <Text style={styles.emptySub}>No products need more amount right now.</Text>
        </View>
      ) : (
        products.slice(0, 3).map((item) => {
          const qty = parseFloat(item.productQty as string) || 0;
          const unit = item.scalingType === "kilo" ? "kg" : item.scalingType;
          const min =
            item.lowStockThreshold != null
              ? parseFloat(item.lowStockThreshold as string).toFixed(2)
              : "-";

          return (
            <View key={item.id} style={styles.alertCard}>
              <View style={styles.alertInfo}>
                <Text style={styles.productName}>{item.productName}</Text>
                <Text style={styles.stockText}>
                  <Text style={styles.stockHighlight}>{qty.toFixed(2)} {unit}</Text>
                  {" "}remaining (Alert at: {min} {unit})
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
    marginBottom: spacing.base,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  sectionHeading: {
    fontFamily: fonts.heading.bold,
    fontSize: 18,
    color: colors.text,
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
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
    alignItems: "center",
    ...shadows.card,
  },
  emptyTitle: {
    fontFamily: fonts.body.semiBold,
    fontSize: 14,
    color: colors.success,
    marginBottom: 2,
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
    padding: spacing.base,
    marginBottom: spacing.xs,
    ...shadows.card,
  },
  alertInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  productName: {
    fontFamily: fonts.heading.bold,
    fontSize: 15,
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
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radii.button,
  },
  actionButtonPressed: {
    transform: [{ scale: 0.98 }],
    backgroundColor: colors.primaryPressed,
  },
  actionButtonText: {
    color: colors.white,
    fontFamily: fonts.body.semiBold,
    fontSize: 12,
  },
});
