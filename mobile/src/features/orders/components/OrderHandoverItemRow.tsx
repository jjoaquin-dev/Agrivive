import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Check, Minus, Plus, RefreshCw } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import type { SellerOrderItem } from "../types";

export interface OrderHandoverItemRowProps {
  item: SellerOrderItem;
  current: number;
  onUpdateQuantity: (itemId: string, next: number, max: number) => void;
}

export function OrderHandoverItemRow({
  item,
  current,
  onUpdateQuantity,
}: OrderHandoverItemRowProps) {
  const reserved = Number(item.quantity ?? 0);
  const unitPrice = Number(item.unitPrice ?? 0);
  const diff = reserved - current;
  const subtotal = current * unitPrice;
  const canAdd = current < reserved - 0.001;

  return (
    <View style={styles.itemCard}>
      <View style={styles.itemTop}>
        <Text style={styles.itemName}>{item.productName || "Fresh Produce"}</Text>
        <Text style={styles.itemSubtotal}>₱{subtotal.toFixed(2)}</Text>
      </View>
      <Text style={styles.itemPrice}>
        Reserved: {reserved} {item.scalingType || "kg"} (₱{unitPrice.toFixed(2)} / {item.scalingType || "kg"})
      </Text>

      <View style={styles.stepperRow}>
        <Text style={styles.stepperLabel}>Actual Handed Over:</Text>
        <View style={styles.stepperControl}>
          <Pressable
            onPress={() => onUpdateQuantity(item.id, current - 0.5, reserved)}
            style={styles.stepBtn}
            accessibilityLabel="Decrease amount"
          >
            <Minus size={16} color={colors.text} />
          </Pressable>
          <TextInput
            keyboardType="decimal-pad"
            value={String(current)}
            onChangeText={(txt) => {
              const val = parseFloat(txt) || 0;
              onUpdateQuantity(item.id, val, reserved);
            }}
            style={styles.stepperInput}
          />
          {canAdd ? (
            <Pressable
              onPress={() => onUpdateQuantity(item.id, current + 0.5, reserved)}
              style={styles.stepBtn}
              accessibilityLabel="Increase amount"
            >
              <Plus size={16} color={colors.text} />
            </Pressable>
          ) : null}
        </View>
      </View>

      {diff > 0.001 ? (
        <View style={styles.restoredPill}>
          <RefreshCw size={13} color={colors.primary} />
          <Text style={styles.restoredText}>
            {diff.toFixed(2)} {item.scalingType || "kg"} will return to active stock
          </Text>
        </View>
      ) : (
        <View style={styles.rightQtyPill}>
          <Check size={12} color={colors.primary} />
          <Text style={styles.rightQtyText}>Right quantity</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  itemCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radii.card, padding: spacing.md, marginBottom: spacing.sm },
  itemTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  itemName: { fontFamily: fonts.heading.semiBold, fontSize: 15, color: colors.text },
  itemSubtotal: { fontFamily: fonts.heading.bold, fontSize: 15, color: colors.primary },
  itemPrice: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted, marginTop: 2, marginBottom: spacing.sm },
  stepperRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: spacing.xs },
  stepperLabel: { fontFamily: fonts.body.medium, fontSize: 13, color: colors.text },
  stepperControl: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: colors.border, borderRadius: radii.button, overflow: "hidden" },
  stepBtn: { width: 38, height: 38, alignItems: "center", justifyContent: "center", backgroundColor: colors.background },
  stepperInput: { minWidth: 50, textAlign: "center", fontFamily: fonts.body.semiBold, fontSize: 14, color: colors.text, paddingHorizontal: spacing.xs },
  restoredPill: { flexDirection: "row", alignItems: "center", backgroundColor: colors.primaryLight, paddingVertical: 4, paddingHorizontal: 8, borderRadius: radii.full, marginTop: spacing.sm, gap: 6 },
  restoredText: { fontFamily: fonts.body.medium, fontSize: 11, color: colors.primary },
  rightQtyPill: { flexDirection: "row", alignItems: "center", backgroundColor: colors.background, paddingVertical: 3, paddingHorizontal: 8, borderRadius: radii.full, marginTop: spacing.sm, alignSelf: "flex-start", gap: 4 },
  rightQtyText: { fontFamily: fonts.body.medium, fontSize: 11, color: colors.primary },
});
