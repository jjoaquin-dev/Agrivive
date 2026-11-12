import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import type { SellerOrderStatus } from "../types";

const labels: Record<SellerOrderStatus, string> = {
  pending: "Waiting for pickup",
  completed: "Picked up",
  cancelled: "Cancelled",
  expired: "Expired",
  declined: "Declined at pickup",
};

const tones: Record<SellerOrderStatus, { fg: string; bg: string; border: string }> = {
  pending: { fg: colors.warning, bg: colors.orangeSurface, border: colors.orangeBorder },
  completed: { fg: colors.success, bg: "rgba(22, 163, 74, 0.10)", border: "rgba(22, 163, 74, 0.25)" },
  cancelled: { fg: colors.error, bg: colors.errorSurface, border: colors.errorBorder },
  expired: { fg: colors.textMuted, bg: colors.surfaceMuted, border: colors.border },
  declined: { fg: colors.warning, bg: colors.orangeSurface, border: colors.orangeBorder },
};

export function OrderStatusBadge({ status }: { status: SellerOrderStatus }) {
  const tone = tones[status];
  return (
    <View style={[styles.badge, { backgroundColor: tone.bg, borderColor: tone.border }]}>
      <Text style={[styles.text, { color: tone.fg }]}>{labels[status]}</Text>
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
