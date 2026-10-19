import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Minus, Plus, RefreshCw, X } from "lucide-react-native";
import { ButtonComponent } from "../../../components/ButtonComponent";
import { colors, fonts, radii, spacing, touchTargets } from "../../../theme";
import type { ScanOrderItemAdjustment } from "../api/seller-orders";
import type { SellerOrder } from "../types";

export interface OrderHandoverSheetProps {
  visible: boolean;
  order: SellerOrder | null;
  onClose: () => void;
  onConfirm: (adjustments: ScanOrderItemAdjustment[]) => Promise<void>;
  submitting?: boolean;
}

export function OrderHandoverSheet({
  visible,
  order,
  onClose,
  onConfirm,
  submitting = false,
}: OrderHandoverSheetProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!order) return;
    const initial: Record<string, number> = {};
    for (const item of order.items) {
      initial[item.id] = Number(item.quantity ?? 0);
    }
    setQuantities(initial);
  }, [order]);

  if (!order) return null;

  const updateQuantity = (itemId: string, next: number, max: number) => {
    const clamped = Math.max(0, Math.min(Number(next.toFixed(2)), max));
    setQuantities((prev) => ({ ...prev, [itemId]: clamped }));
  };

  let newTotal = 0;
  let totalRestored = 0;
  let totalDispensed = 0;

  const adjustments: ScanOrderItemAdjustment[] = order.items.map((item) => {
    const reserved = Number(item.quantity ?? 0);
    const unitPrice = Number(item.unitPrice ?? 0);
    const dispensed = quantities[item.id] !== undefined ? quantities[item.id] : reserved;
    const diff = Math.max(0, reserved - dispensed);

    newTotal += dispensed * unitPrice;
    totalRestored += diff;
    totalDispensed += dispensed;

    return { itemId: item.id, dispensedQuantity: dispensed };
  });

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Handover Verification</Text>
              <Text style={styles.headerSubtitle}>Order #{order.id.slice(0, 8)}</Text>
            </View>
            <Pressable onPress={onClose} hitSlop={12} style={styles.closeBtn}>
              <X size={20} color={colors.textMuted} />
            </Pressable>
          </View>

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionNotice}>
              Weigh produce at stall. Adjust dispensed amount if buyer collects less than reserved.
            </Text>

            {order.items.map((item) => {
              const reserved = Number(item.quantity ?? 0);
              const unitPrice = Number(item.unitPrice ?? 0);
              const current = quantities[item.id] !== undefined ? quantities[item.id] : reserved;
              const diff = reserved - current;
              const subtotal = current * unitPrice;

              return (
                <View key={item.id} style={styles.itemCard}>
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
                        onPress={() => updateQuantity(item.id, current - 0.5, reserved)}
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
                          updateQuantity(item.id, val, reserved);
                        }}
                        style={styles.stepperInput}
                      />
                      <Pressable
                        onPress={() => updateQuantity(item.id, current + 0.5, reserved)}
                        style={styles.stepBtn}
                        accessibilityLabel="Increase amount"
                      >
                        <Plus size={16} color={colors.text} />
                      </Pressable>
                    </View>
                  </View>

                  {diff > 0.001 ? (
                    <View style={styles.restoredPill}>
                      <RefreshCw size={13} color={colors.primary} />
                      <Text style={styles.restoredText}>
                        {diff.toFixed(2)} {item.scalingType || "kg"} will return to active stock
                      </Text>
                    </View>
                  ) : null}
                </View>
              );
            })}

            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Original Amount:</Text>
                <Text style={styles.summaryOldValue}>₱{Number(order.totalAmount).toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryMainLabel}>Final Total to Collect:</Text>
                <Text style={styles.summaryNewValue}>₱{newTotal.toFixed(2)}</Text>
              </View>
              {totalRestored > 0.001 ? (
                <Text style={styles.summaryHint}>
                  Uncollected produce will be returned to your inventory immediately upon completion.
                </Text>
              ) : null}
            </View>
          </ScrollView>

          <View style={styles.actions}>
            <ButtonComponent
              title="Confirm Handover & Complete"
              onPress={() => onConfirm(adjustments)}
              loading={submitting}
              disabled={totalDispensed <= 0}
            />
            <ButtonComponent
              title="Cancel & Rescan"
              variant="secondary"
              onPress={onClose}
              disabled={submitting}
              style={{ marginTop: spacing.sm }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  sheet: { backgroundColor: colors.surface, borderTopLeftRadius: radii.sheet, borderTopRightRadius: radii.sheet, maxHeight: "90%", padding: spacing.base },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.md },
  headerTitle: { fontFamily: fonts.heading.bold, fontSize: 18, color: colors.text },
  headerSubtitle: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted, marginTop: 2 },
  closeBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  scroll: { marginBottom: spacing.md },
  sectionNotice: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted, backgroundColor: colors.background, padding: spacing.sm, borderRadius: radii.sm, marginBottom: spacing.md },
  itemCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radii.card, padding: spacing.md, marginBottom: spacing.sm },
  itemTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  itemName: { fontFamily: fonts.heading.semiBold, fontSize: 15, color: colors.text },
  itemSubtotal: { fontFamily: fonts.heading.bold, fontSize: 15, color: colors.primary },
  itemPrice: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted, marginTop: 2, marginBottom: spacing.sm },
  stepperRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: spacing.xs },
  stepperLabel: { fontFamily: fonts.body.medium, fontSize: 13, color: colors.text },
  stepperControl: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: colors.border, borderRadius: radii.button },
  stepBtn: { width: 38, height: 38, alignItems: "center", justifyContent: "center", backgroundColor: colors.background },
  stepperInput: { minWidth: 50, textAlign: "center", fontFamily: fonts.body.semiBold, fontSize: 14, color: colors.text, paddingHorizontal: spacing.xs },
  restoredPill: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(31, 77, 58, 0.08)", paddingVertical: 4, paddingHorizontal: 8, borderRadius: radii.full, marginTop: spacing.sm, gap: 6 },
  restoredText: { fontFamily: fonts.body.medium, fontSize: 11, color: colors.primary },
  summaryCard: { backgroundColor: colors.background, borderRadius: radii.card, padding: spacing.md, marginTop: spacing.sm },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  summaryLabel: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted },
  summaryOldValue: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted, textDecorationLine: "line-through" },
  summaryMainLabel: { fontFamily: fonts.heading.semiBold, fontSize: 15, color: colors.text },
  summaryNewValue: { fontFamily: fonts.heading.bold, fontSize: 18, color: colors.primary },
  summaryHint: { fontFamily: fonts.body.regular, fontSize: 11, color: colors.textMuted, marginTop: 4 },
  actions: { paddingTop: spacing.xs },
});
