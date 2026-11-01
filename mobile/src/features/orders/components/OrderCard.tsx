import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ChevronRight, Clock3 } from "lucide-react-native";
import { colors, fonts, radii, shadows, spacing } from "../../../theme";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { formatMoney, formatPickupBy, formatPlaced, formatQuantity, formatUnit } from "../orderFormat";
import type { SellerOrder } from "../types";

function OrderCardComponent({ order, onPress }: { order: SellerOrder; onPress: () => void }) {
  const firstItem = order.items[0];
  const itemCount = order.items.length;
  const reference = order.id.slice(0, 8).toUpperCase();
  const unit = formatUnit(firstItem?.scalingType ?? null, firstItem?.quantity ?? null);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Open reservation ${reference}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.topRow}>
        <Text style={styles.title} numberOfLines={1}>Reservation #{reference}</Text>
        <OrderStatusBadge status={order.status} />
      </View>
      <Text style={styles.placed}>{formatPlaced(order.createdAt)}</Text>

      <Text style={styles.itemText} numberOfLines={1}>
        {firstItem?.productName || "Product"} · {formatQuantity(firstItem?.quantity ?? null)} {unit}
        {itemCount > 1 ? ` + ${itemCount - 1} more` : ""}
      </Text>

      <View style={styles.bottomRow}>
        <Text style={styles.total}>{formatMoney(order.totalAmount)}</Text>
        {order.status === "pending" && order.expiresAt ? (
          <View style={styles.expiry}>
            <Clock3 size={14} color={colors.warning} />
            <Text style={styles.expiryText} numberOfLines={1}>{formatPickupBy(order.expiresAt)}</Text>
          </View>
        ) : (
          <View style={styles.expiry} />
        )}
        <ChevronRight size={20} color={colors.textMuted} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.card,
    padding: spacing.base,
    marginBottom: spacing.md,
    ...shadows.card,
  },
  pressed: { backgroundColor: colors.surfaceMuted },
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.sm },
  title: { flex: 1, fontFamily: fonts.heading.bold, fontSize: 15, color: colors.text },
  placed: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted, marginTop: spacing.xs },
  itemText: { fontFamily: fonts.body.medium, fontSize: 13, color: colors.text, marginTop: spacing.sm },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  total: { fontFamily: fonts.heading.bold, fontSize: 16, color: colors.primary },
  expiry: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "flex-end", gap: spacing.xs, marginRight: spacing.sm },
  expiryText: { fontFamily: fonts.body.semiBold, fontSize: 12, color: colors.warning, flexShrink: 1 },
});

export const OrderCard = React.memo(OrderCardComponent);
