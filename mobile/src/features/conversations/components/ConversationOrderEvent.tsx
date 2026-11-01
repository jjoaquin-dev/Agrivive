import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { CheckCircle2, XCircle } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import type { SellerOrder } from "../../orders/types";
import { formatDayAndClock, orderRef } from "../utils/chatFormat";

/** One line at the end of the thread when the reservation is finished. Null while it is still waiting. */
export function ConversationOrderEvent({ order }: { order: SellerOrder | null }) {
  if (!order || order.status === "pending") return null;
  const done = order.status === "completed";
  const verb = done ? "completed & picked up" : order.status === "cancelled" ? "was cancelled" : "expired";
  const Icon = done ? CheckCircle2 : XCircle;

  return (
    <View style={styles.row}>
      <Icon size={20} color={done ? colors.success : colors.textMuted} />
      <Text style={styles.text}>Order #{orderRef(order.id)} {verb} • {formatDayAndClock(order.updatedAt)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: spacing.sm, alignSelf: "center", backgroundColor: colors.surfaceMuted, borderWidth: 1, borderColor: colors.border, borderRadius: radii.card, paddingHorizontal: spacing.base, paddingVertical: spacing.sm, marginVertical: spacing.md },
  text: { flexShrink: 1, fontFamily: fonts.body.regular, fontSize: 13, lineHeight: 18, color: colors.textMuted, textAlign: "center" },
});
