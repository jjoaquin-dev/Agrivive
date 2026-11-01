import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { ArrowRight, Clock, Ticket } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import type { SellerOrder } from "../../orders/types";
import { formatDayAndClock, orderPill, orderRef, peso, unitShort } from "../utils/chatFormat";

interface Props {
  order: SellerOrder | null;
  orderId: string;
}

/** The reservation this chat is about: items, total, when the pass ends, and a way to open it. */
export function ConversationReservationCard({ order, orderId }: Props) {
  const router = useRouter();
  if (!order) return null;

  const pill = orderPill(order.status);
  const showEnds = order.status === "pending" && Boolean(order.expiresAt);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.icon}><Ticket size={18} color={colors.primary} /></View>
        <Text style={styles.headerTitle} numberOfLines={1}>Reservation Pass #{orderRef(orderId)}</Text>
        <View style={[styles.pill, { backgroundColor: pill.bg }]}>
          <Text style={[styles.pillText, { color: pill.color }]}>{pill.text}</Text>
        </View>
      </View>

      <View style={styles.body}>
        {order.items?.map((item) => {
          const qty = Number(item.quantity ?? 1);
          const unit = unitShort(item.scalingType, qty);
          return (
            <View key={item.id} style={styles.itemRow}>
              <Text style={styles.itemName} numberOfLines={2}>
                {item.productName || "Produce"} • {qty} {unit}
                <Text style={styles.unitPrice}> ({peso(item.unitPrice)}/{unitShort(item.scalingType, 1)})</Text>
              </Text>
              <Text style={styles.itemTotal}>{peso(item.subtotal)}</Text>
            </View>
          );
        })}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{peso(order.totalAmount)}</Text>
        </View>

        {showEnds ? (
          <View style={styles.ends}>
            <Clock size={16} color={colors.warning} />
            <Text style={styles.endsText}>Pickup Pass ends: <Text style={styles.endsStrong}>{formatDayAndClock(order.expiresAt as string)}</Text></Text>
          </View>
        ) : null}

        <Pressable onPress={() => router.push({ pathname: "/(app)/orders/[id]", params: { id: orderId } })} accessibilityRole="button" accessibilityLabel="View Reservation Details" style={({ pressed }) => [styles.viewBtn, pressed && styles.pressed]}>
          <Text style={styles.viewText}>View Reservation Details</Text>
          <ArrowRight size={18} color={colors.primary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radii.card, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, marginVertical: spacing.md, overflow: "hidden" },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.sm, padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  icon: { width: 32, height: 32, borderRadius: radii.sm + 2, backgroundColor: colors.primaryLight, alignItems: "center", justifyContent: "center" },
  headerTitle: { flex: 1, fontFamily: fonts.heading.bold, fontSize: 15, color: colors.text },
  pill: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: radii.full },
  pillText: { fontFamily: fonts.body.semiBold, fontSize: 11 },
  body: { padding: spacing.md, gap: spacing.sm },
  itemRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: spacing.sm },
  itemName: { flex: 1, fontFamily: fonts.body.regular, fontSize: 14, color: colors.text },
  unitPrice: { color: colors.textMuted, fontSize: 12 },
  itemTotal: { fontFamily: fonts.body.medium, fontSize: 14, color: colors.text },
  totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.sm },
  totalLabel: { fontFamily: fonts.body.regular, fontSize: 14, color: colors.textMuted },
  totalValue: { fontFamily: fonts.heading.bold, fontSize: 18, color: colors.primary },
  ends: { flexDirection: "row", alignItems: "center", gap: spacing.sm, backgroundColor: "#FEF9C3", borderWidth: 1, borderColor: "#FDE68A", borderRadius: radii.sm + 2, padding: spacing.sm },
  endsText: { flex: 1, fontFamily: fonts.body.regular, fontSize: 13, color: "#92400E" },
  endsStrong: { fontFamily: fonts.body.semiBold },
  viewBtn: { minHeight: 48, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm, borderRadius: radii.button, borderWidth: 1.5, borderColor: colors.primary, marginTop: spacing.xs },
  pressed: { backgroundColor: colors.primaryLight },
  viewText: { fontFamily: fonts.body.semiBold, fontSize: 15, color: colors.primary },
});
