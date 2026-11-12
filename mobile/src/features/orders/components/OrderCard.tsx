import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ChevronRight, Clock3 } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import { surface } from "../../../theme/surface";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { formatMoney, formatPickupBy, formatPlaced, formatQuantity, formatUnit } from "../orderFormat";
import type { SellerOrder } from "../types";

/** What the seller needs first: the produce and the total. The reference and time are small; the pick-up deadline is what to act on. */
function OrderCardComponent({ order, onPress }: { order: SellerOrder; onPress: () => void }) {
  const firstItem = order.items[0];
  const itemCount = order.items.length;
  const reference = order.id.slice(0, 8).toUpperCase();
  const unit = formatUnit(firstItem?.scalingType ?? null, firstItem?.quantity ?? null);
  const pickupBy = order.pickupEnd ?? order.expiresAt;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Open reservation ${reference}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.topRow}>
        <Text style={styles.item} numberOfLines={1}>
          {firstItem?.productName || "Product"} · {formatQuantity(firstItem?.quantity ?? null)} {unit}
          {itemCount > 1 ? ` + ${itemCount - 1} more` : ""}
        </Text>
        <OrderStatusBadge status={order.status} />
      </View>
      <Text style={styles.meta} numberOfLines={1}>#{reference} · {formatPlaced(order.createdAt)}</Text>

      <View style={styles.bottomRow}>
        <Text style={styles.total}>{formatMoney(order.totalAmount)}</Text>
        <View style={styles.expiry}>
          {order.status === "pending" && pickupBy ? (
            <>
              <Clock3 size={14} color={colors.warning} />
              <Text style={styles.expiryText} numberOfLines={1}>{formatPickupBy(pickupBy)}</Text>
            </>
          ) : null}
        </View>
        <ChevronRight size={20} color={colors.textMuted} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: surface.card,
    borderWidth: 1,
    borderColor: surface.border,
    borderRadius: radii.card,
    padding: spacing.base,
    marginBottom: spacing.md,
    ...surface.shadow,
  },
  pressed: { backgroundColor: "#FAF9F6" },
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.sm },
  item: { flex: 1, fontFamily: fonts.heading.bold, fontSize: 16, color: colors.text },
  meta: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted, marginTop: spacing.xs },
  bottomRow: { flexDirection: "row", alignItems: "center", marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: surface.border },
  total: { fontFamily: fonts.heading.bold, fontSize: 17, color: colors.primary },
  expiry: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "flex-end", gap: spacing.xs, marginRight: spacing.sm },
  expiryText: { fontFamily: fonts.body.semiBold, fontSize: 13, color: colors.warning, flexShrink: 1 },
});

export const OrderCard = React.memo(OrderCardComponent);
