import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, spacing } from "../../../theme";
import type { SellerOrderItem } from "../types";

import { formatMoney, formatQuantity, formatUnit } from "../orderFormat";

export function OrderItemsList({ items }: { items: SellerOrderItem[] }) {
  return (
    <View>
      {items.map((item, index) => (
        <View key={item.id} style={[styles.row, index < items.length - 1 && styles.divider]}>
          <View style={styles.info}>
            <Text style={styles.name}>{item.productName || "Product"}</Text>
            <Text style={styles.quantity}>
              {formatQuantity(item.quantity)} {formatUnit(item.scalingType, item.quantity)} × {formatMoney(item.unitPrice)}
            </Text>
          </View>
          <Text style={styles.subtotal}>{formatMoney(item.subtotal)}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  info: {
    flex: 1,
    marginRight: spacing.md,
  },
  name: {
    fontFamily: fonts.body.semiBold,
    fontSize: 14,
    color: colors.text,
  },
  quantity: {
    fontFamily: fonts.body.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  subtotal: {
    fontFamily: fonts.body.semiBold,
    fontSize: 14,
    color: colors.text,
  },
});
