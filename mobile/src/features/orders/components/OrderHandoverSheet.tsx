import React, { useEffect, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { AlertCircle, X } from "lucide-react-native";
import { ButtonComponent } from "../../../components/ButtonComponent";
import { colors, fonts, radii, spacing, touchTargets } from "../../../theme";
import { formatMoney } from "../orderFormat";
import type { ScanOrderItemAdjustment } from "../api/seller-orders";
import type { SellerOrder } from "../types";
import { OrderHandoverItemRow } from "./OrderHandoverItemRow";

export interface OrderHandoverSheetProps {
  visible: boolean;
  order: SellerOrder | null;
  onClose: () => void;
  onConfirm: (adjustments: ScanOrderItemAdjustment[]) => Promise<void>;
  submitting?: boolean;
  error?: string | null;
}

export function OrderHandoverSheet({
  visible,
  order,
  onClose,
  onConfirm,
  submitting = false,
  error = null,
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
  let totalDispensed = 0;

  const adjustments: ScanOrderItemAdjustment[] = order.items.map((item) => {
    const reserved = Number(item.quantity ?? 0);
    const unitPrice = Number(item.unitPrice ?? 0);
    const dispensed = quantities[item.id] !== undefined ? quantities[item.id] : reserved;

    newTotal += dispensed * unitPrice;
    totalDispensed += dispensed;

    return { itemId: item.id, dispensedQuantity: dispensed };
  });

  const changed = Math.abs(newTotal - Number(order.totalAmount)) > 0.001;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Check the Amount</Text>
              <Text style={styles.headerSubtitle}>Reservation #{order.id.slice(0, 8).toUpperCase()}</Text>
            </View>
            <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Close" style={styles.closeBtn}>
              <X size={22} color={colors.textMuted} />
            </Pressable>
          </View>

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionNotice}>
              Weigh the vegetables. If the buyer takes less, lower the amount. The rest goes back to your stock.
            </Text>

            {order.items.map((item) => (
              <OrderHandoverItemRow
                key={item.id}
                item={item}
                current={quantities[item.id] !== undefined ? quantities[item.id] : Number(item.quantity ?? 0)}
                onUpdateQuantity={updateQuantity}
              />
            ))}

            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Reserved total</Text>
                <Text style={[styles.summaryOldValue, changed && styles.struck]}>{formatMoney(order.totalAmount)}</Text>
              </View>
              <View style={styles.summaryRowMain}>
                <Text style={styles.summaryMainLabel}>Collect from buyer</Text>
                <Text style={styles.summaryNewValue}>{formatMoney(String(newTotal))}</Text>
              </View>
            </View>
          </ScrollView>

          {error ? (
            <View style={styles.errorBox}>
              <AlertCircle size={16} color={colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.actions}>
            <ButtonComponent title="Finish Pickup" onPress={() => onConfirm(adjustments)} loading={submitting} disabled={totalDispensed <= 0} />
            <ButtonComponent title="Scan Again" variant="ghost" onPress={onClose} disabled={submitting} textStyle={styles.scanAgain} />
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
  closeBtn: { width: touchTargets.min, height: touchTargets.min, alignItems: "center", justifyContent: "center", marginRight: -spacing.sm },
  scroll: { marginBottom: spacing.md },
  sectionNotice: { fontFamily: fonts.body.regular, fontSize: 13, lineHeight: 20, color: colors.textMuted, backgroundColor: colors.surfaceMuted, padding: spacing.md, borderRadius: radii.sm, marginBottom: spacing.md },
  summaryCard: { backgroundColor: colors.surfaceMuted, borderRadius: radii.card, padding: spacing.md, marginTop: spacing.xs },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingBottom: spacing.sm },
  summaryRowMain: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.sm },
  summaryLabel: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted },
  summaryOldValue: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted },
  struck: { textDecorationLine: "line-through" },
  summaryMainLabel: { fontFamily: fonts.heading.semiBold, fontSize: 15, color: colors.text },
  summaryNewValue: { fontFamily: fonts.heading.bold, fontSize: 18, color: colors.primary },
  errorBox: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#FEF2F2", borderWidth: 1, borderColor: "#FECACA", padding: spacing.sm, borderRadius: radii.sm, marginBottom: spacing.sm },
  errorText: { flex: 1, fontFamily: fonts.body.medium, fontSize: 12, color: colors.error },
  actions: { paddingTop: spacing.xs, gap: spacing.xs },
  scanAgain: { color: colors.textMuted },
});
