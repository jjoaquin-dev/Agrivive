import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import type { SellerOrderStatus } from "../types";

const labels: Record<SellerOrderStatus, string> = {
  pending: "Waiting for pickup",
  completed: "Completed",
  cancelled: "Cancelled",
  expired: "Expired",
};

const statusColors: Record<SellerOrderStatus, string> = {
  pending: colors.warning,
  completed: colors.success,
  cancelled: colors.error,
  expired: colors.textMuted,
};

export function OrderStatusBadge({ status }: { status: SellerOrderStatus }) {
  return (
    <View style={[styles.badge, { borderColor: statusColors[status] }]}>
      <Text style={[styles.text, { color: statusColors[status] }]}>{labels[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    borderRadius: radii.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  text: {
    fontFamily: fonts.body.semiBold,
    fontSize: 11,
  },
});
