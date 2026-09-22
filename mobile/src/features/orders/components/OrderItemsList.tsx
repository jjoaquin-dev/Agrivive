import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, spacing } from "../../../theme";
import type { SellerOrderItem } from "../types";

function money(value: string) {
  return `₱${Number(value).toFixed(2)}`;
}

export function OrderItemsList({ items }: { items: SellerOrderItem[] }) {
  return (
    <View>
      {items.map((item, index) => (
        <View key={item.id} style={[styles.row, index < items.length - 1 && styles.divider]}>
          <View style={styles.info}>
            <Text style={styles.name}>{item.productName || "Product"}</Text>
            <Text style={styles.quantity}>
              {item.quantity || "0"} {item.scalingType || "unit"} × {money(item.unitPrice)}
            </Text>
          </View>
          <Text style={styles.subtotal}>{money(item.subtotal)}</Text>
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
