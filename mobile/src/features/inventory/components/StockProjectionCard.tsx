import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { AlertCircle } from "lucide-react-native";
import { colors, fonts, radii, spacing, shadows } from "../../../theme";

interface StockProjectionCardProps {
  currentQty: number;
  projectedQty: number;
  unitLabel: string;
  isExcessStockOut: boolean;
}

export const StockProjectionCard: React.FC<StockProjectionCardProps> = ({
  currentQty,
  projectedQty,
  unitLabel,
  isExcessStockOut,
}) => {
  return (
    <View style={styles.previewCard}>
      <View style={styles.previewRow}>
        <View style={styles.previewCol}>
          <Text style={styles.previewLabel}>Current Amount</Text>
          <Text style={styles.previewValue}>
            {currentQty.toFixed(2)} {unitLabel}
          </Text>
        </View>
        <View style={styles.arrowCol}>
          <Text style={styles.arrowIcon}>→</Text>
        </View>
        <View style={styles.previewCol}>
          <Text style={styles.previewLabel}>New Amount</Text>
          <Text
            style={[
              styles.previewValue,
              projectedQty < 0 ? styles.previewValueDanger : styles.previewValueSuccess,
            ]}
          >
            {projectedQty.toFixed(2)} {unitLabel}
          </Text>
        </View>
      </View>

      {isExcessStockOut ? (
        <View style={styles.warningBox}>
          <AlertCircle size={16} color={colors.error} style={styles.warningIcon} />
          <Text style={styles.warningText}>
            ⚠ Available stock is only {currentQty.toFixed(2)} {unitLabel}.
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  previewCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
    marginBottom: spacing.base,
    ...shadows.card,
  },
  previewRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  previewCol: {
    flex: 1,
    alignItems: "center",
  },
  arrowCol: {
    paddingHorizontal: spacing.sm,
  },
  arrowIcon: {
    fontSize: 22,
    color: colors.textMuted,
  },
  previewLabel: {
    fontFamily: fonts.body.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 4,
  },
  previewValue: {
    fontFamily: fonts.heading.bold,
    fontSize: 18,
    color: colors.text,
  },
  previewValueSuccess: {
    color: colors.success,
  },
  previewValueDanger: {
    color: colors.error,
  },
  warningBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(184, 84, 80, 0.1)",
    borderRadius: radii.sm,
    padding: spacing.sm,
    marginTop: spacing.sm,
  },
  warningIcon: {
    marginRight: 6,
  },
  warningText: {
    fontFamily: fonts.body.medium,
    fontSize: 13,
    color: colors.error,
    flex: 1,
  },
});
