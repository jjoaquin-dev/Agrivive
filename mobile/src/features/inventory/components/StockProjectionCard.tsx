import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { AlertCircle, CheckCircle2 } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";

interface StockProjectionCardProps {
  actionType: "in" | "out";
  currentQty: number;
  changeQty: number;
  projectedQty: number;
  unitLabel: string;
  isExcessStockOut: boolean;
}

export const StockProjectionCard: React.FC<StockProjectionCardProps> = ({
  actionType, currentQty, changeQty, projectedQty, unitLabel, isExcessStockOut,
}) => {
  const isAdd = actionType === "in";
  const tone = isExcessStockOut ? colors.error : isAdd ? colors.primary : colors.text;
  return (
    <View style={[styles.card, isAdd && !isExcessStockOut ? styles.cardAdd : styles.cardOut]}>
      <View style={styles.row}>
        <Text style={styles.label}>Current available: <Text style={styles.strong}>{currentQty.toFixed(2)} {unitLabel}</Text></Text>
        {changeQty > 0 ? (
          <Text style={[styles.change, { color: isAdd ? "#15803D" : colors.error }]}>
            {isAdd ? "+ Adding" : "− Taking away"} {changeQty.toFixed(2)} {unitLabel}
          </Text>
        ) : null}
      </View>
      <View style={styles.divider} />
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>New total available</Text>
        <Text style={[styles.total, { color: tone }]}>{projectedQty.toFixed(2)} {unitLabel}</Text>
      </View>
      {isExcessStockOut ? (
        <View style={styles.noteRow}>
          <AlertCircle size={14} color={colors.error} />
          <Text style={[styles.note, { color: colors.error }]}>You only have {currentQty.toFixed(2)} {unitLabel} to take away.</Text>
        </View>
      ) : isAdd ? (
        <View style={styles.noteRow}>
          <CheckCircle2 size={14} color={colors.success} />
          <Text style={[styles.note, { color: "#15803D" }]}>Buyers see the new amount right away.</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: { borderRadius: radii.card - 4, borderWidth: 1, padding: spacing.md + 2, marginBottom: spacing.base },
  cardAdd: { backgroundColor: "#F0FDF4", borderColor: "#BBF7D0" },
  cardOut: { backgroundColor: colors.surfaceMuted, borderColor: colors.border },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: spacing.xs },
  label: { fontFamily: fonts.body.regular, fontSize: 13, color: "#4B5563" },
  strong: { fontFamily: fonts.body.medium, color: colors.text },
  change: { fontFamily: fonts.body.medium, fontSize: 13 },
  divider: { height: 1, backgroundColor: "rgba(0,0,0,0.08)", marginVertical: spacing.sm + 2 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  totalLabel: { fontFamily: fonts.body.semiBold, fontSize: 13, color: colors.text },
  total: { fontFamily: fonts.heading.bold, fontSize: 22 },
  noteRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: spacing.sm },
  note: { flex: 1, fontFamily: fonts.body.regular, fontSize: 12 },
});
