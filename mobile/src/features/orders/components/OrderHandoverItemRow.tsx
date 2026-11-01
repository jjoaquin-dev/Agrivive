import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Check, Minus, Plus, RefreshCw } from "lucide-react-native";
import { colors, fonts, radii, spacing, touchTargets } from "../../../theme";
import { formatAmount, formatMoney, formatNumber, formatUnit } from "../orderFormat";
import type { SellerOrderItem } from "../types";

export interface OrderHandoverItemRowProps {
  item: SellerOrderItem;
  current: number;
  onUpdateQuantity: (itemId: string, next: number, max: number) => void;
}

export function OrderHandoverItemRow({ item, current, onUpdateQuantity }: OrderHandoverItemRowProps) {
  const reserved = Number(item.quantity ?? 0);
  const unitPrice = Number(item.unitPrice ?? 0);
  const diff = reserved - current;
  const step = item.scalingType === "kilo" ? 0.5 : 1;
  const canAdd = current < reserved - 0.001;
  const canSubtract = current > 0.001;
  const perUnit = item.scalingType === "kilo" ? "kg" : item.scalingType || "kg";

  return (
    <View style={styles.itemCard}>
      <View style={styles.itemTop}>
        <Text style={styles.itemName}>{item.productName || "Fresh Produce"}</Text>
        <Text style={styles.itemSubtotal}>{formatMoney(String(current * unitPrice))}</Text>
      </View>
      <Text style={styles.itemPrice}>
        Reserved {formatAmount(reserved, item.scalingType)} · {formatMoney(String(unitPrice))} per {perUnit}
      </Text>

      <View style={styles.stepperRow}>
        <Text style={styles.stepperLabel}>Amount given</Text>
        <View style={styles.stepperControl}>
          <Pressable
            onPress={() => onUpdateQuantity(item.id, current - step, reserved)}
            disabled={!canSubtract}
            style={[styles.stepBtn, !canSubtract && styles.stepDisabled]}
            accessibilityRole="button"
            accessibilityLabel="Give less"
          >
            <Minus size={16} color={colors.text} />
          </Pressable>
          <View style={styles.valueCell}>
            <TextInput
              keyboardType="decimal-pad"
              value={formatNumber(current)}
              onChangeText={(txt) => onUpdateQuantity(item.id, parseFloat(txt) || 0, reserved)}
              style={styles.stepperInput}
              accessibilityLabel="Amount given"
            />
            <Text style={styles.unit}>{formatUnit(item.scalingType, String(current))}</Text>
          </View>
          <Pressable
            onPress={() => onUpdateQuantity(item.id, current + step, reserved)}
            disabled={!canAdd}
            style={[styles.stepBtn, !canAdd && styles.stepDisabled]}
            accessibilityRole="button"
            accessibilityLabel="Give more"
          >
            <Plus size={16} color={canAdd ? colors.primary : colors.textMuted} />
          </Pressable>
        </View>
      </View>

      {diff > 0.001 ? (
        <View style={styles.pill}>
          <RefreshCw size={13} color={colors.primary} />
          <Text style={styles.pillText}>{formatAmount(diff, item.scalingType)} goes back to your stock</Text>
        </View>
      ) : (
        <View style={styles.pill}>
          <Check size={13} color={colors.primary} />
          <Text style={styles.pillText}>Full amount</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  itemCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radii.card, padding: spacing.base, marginBottom: spacing.sm },
  itemTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  itemName: { fontFamily: fonts.heading.semiBold, fontSize: 15, color: colors.text },
  itemSubtotal: { fontFamily: fonts.heading.bold, fontSize: 15, color: colors.primary },
  itemPrice: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted, marginTop: 2, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  stepperRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: spacing.md },
  stepperLabel: { fontFamily: fonts.body.medium, fontSize: 13, color: colors.text },
  stepperControl: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: colors.border, borderRadius: radii.button, overflow: "hidden" },
  stepBtn: { width: touchTargets.min - 4, height: touchTargets.min - 4, alignItems: "center", justifyContent: "center", backgroundColor: colors.surface },
  stepDisabled: { opacity: 0.45 },
  valueCell: { minWidth: 76, height: touchTargets.min - 4, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, borderLeftWidth: 1, borderRightWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.sm },
  stepperInput: { minWidth: 20, textAlign: "right", fontFamily: fonts.body.semiBold, fontSize: 14, color: colors.text, padding: 0 },
  unit: { fontFamily: fonts.body.semiBold, fontSize: 14, color: colors.text },
  pill: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start", gap: 6, backgroundColor: colors.primaryLight, paddingVertical: 4, paddingHorizontal: spacing.sm, borderRadius: radii.full, marginTop: spacing.md },
  pillText: { fontFamily: fonts.body.semiBold, fontSize: 11, color: colors.primary },
});
