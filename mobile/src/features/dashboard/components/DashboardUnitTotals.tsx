import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { TrendingUp } from "lucide-react-native";
import { colors, fonts, radii, spacing, shadows } from "../../../theme";
import type { InventorySummary } from "../../inventory/types";

interface DashboardUnitTotalsProps {
  unitTotals: InventorySummary["unitTotals"];
}

export const DashboardUnitTotals: React.FC<DashboardUnitTotalsProps> = ({ unitTotals }) => {
  return (
    <View style={styles.unitTotalsCard}>
      <View style={styles.unitTotalsHeader}>
        <TrendingUp size={16} color={colors.primary} style={styles.unitHeaderIcon} />
        <Text style={styles.unitTotalsTitle}>Quantity by Selling Unit</Text>
      </View>
      <Text style={styles.unitTotalsHint}>
        Units are grouped separately because kilograms, sacks, and piles cannot be summed.
      </Text>
      <View style={styles.unitRow}>
        <View style={styles.unitItem}>
          <Text style={styles.unitValue}>{unitTotals.kilo.toFixed(1)}</Text>
          <Text style={styles.unitName}>Kilograms (kg)</Text>
        </View>
        <View style={styles.unitDivider} />
        <View style={styles.unitItem}>
          <Text style={styles.unitValue}>{unitTotals.sack.toFixed(1)}</Text>
          <Text style={styles.unitName}>Sacks</Text>
        </View>
        <View style={styles.unitDivider} />
        <View style={styles.unitItem}>
          <Text style={styles.unitValue}>{unitTotals.pile.toFixed(1)}</Text>
          <Text style={styles.unitName}>Piles (Tumpok)</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  unitTotalsCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
    ...shadows.card,
  },
  unitTotalsHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  unitHeaderIcon: {
    marginRight: 6,
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
});
