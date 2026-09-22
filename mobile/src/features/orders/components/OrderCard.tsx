import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ChevronRight, Clock3 } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import { OrderStatusBadge } from "./OrderStatusBadge";
import type { SellerOrder } from "../types";

function money(value: string) {
  return `₱${Number(value).toFixed(2)}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function OrderCard({ order, onPress }: { order: SellerOrder; onPress: () => void }) {
  const firstItem = order.items[0];
  const itemCount = order.items.length;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Open order from ${formatDate(order.createdAt)}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.topRow}>
        <View style={styles.orderTitleWrap}>
          <Text style={styles.orderTitle}>Order {order.id.slice(0, 8)}</Text>
          <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
        </View>
        <OrderStatusBadge status={order.status} />
      </View>

      <Text style={styles.itemText} numberOfLines={1}>
        {firstItem?.productName || "Product"} · {firstItem?.quantity || "0"} {firstItem?.scalingType || "unit"}
        {itemCount > 1 ? ` + ${itemCount - 1} more` : ""}
      </Text>

      <View style={styles.bottomRow}>
        <Text style={styles.total}>{money(order.totalAmount)}</Text>
        {order.status === "pending" && order.expiresAt ? (
          <View style={styles.expiry}>
            <Clock3 size={14} color={colors.warning} />
            <Text style={styles.expiryText}>Expires {formatDate(order.expiresAt)}</Text>
          </View>
        ) : null}
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
    marginBottom: spacing.sm,
  },
  pressed: {
    backgroundColor: colors.background,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  orderTitleWrap: {
    flex: 1,
    marginRight: spacing.sm,
  },
  orderTitle: {
    fontFamily: fonts.heading.bold,
    fontSize: 15,
    color: colors.text,
  },
  orderDate: {
    fontFamily: fonts.body.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  itemText: {
    fontFamily: fonts.body.medium,
    fontSize: 13,
    color: colors.text,
    marginTop: spacing.md,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.md,
  },
  total: {
    fontFamily: fonts.heading.bold,
    fontSize: 16,
    color: colors.primary,
    marginRight: spacing.md,
  },
  expiry: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  expiryText: {
    fontFamily: fonts.body.regular,
    fontSize: 11,
    color: colors.warning,
    marginLeft: 4,
  },
});
