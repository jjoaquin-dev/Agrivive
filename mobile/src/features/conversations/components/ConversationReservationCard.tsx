import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { colors, fonts, radii, spacing } from "../../../theme";
import type { SellerOrder, SellerOrderStatus } from "../../orders/types";

interface ConversationReservationCardProps {
  order: SellerOrder | null;
  orderId: string;
}

function getStatusPill(status?: SellerOrderStatus) {
  switch (status) {
    case "completed":
      return { text: "Picked Up", bg: "#DCFCE7", color: colors.success };
    case "cancelled":
      return { text: "Cancelled", bg: "#FEE2E2", color: colors.error };
    case "expired":
      return { text: "Expired", bg: colors.border, color: colors.textMuted };
    case "pending":
    default:
      return { text: "Waiting for Pickup", bg: "#FEF3C7", color: colors.warning };
  }
}

function formatExpiration(expiresAt: string): string {
  const d = new Date(expiresAt);
  const month = d.toLocaleDateString("en-US", { month: "short" });
  const day = d.getDate();
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  return `Pass ends ${month} ${day}, ${time}`;
}

function formatItemUnit(qty: string | null, scalingType: string | null): string {
  const amount = Number(qty || 1);
  const unit = scalingType === "kilo" ? "kg" : scalingType || "";
  return `${amount} ${unit}`.trim();
}

export function ConversationReservationCard({ order, orderId }: ConversationReservationCardProps) {
  const router = useRouter();
  if (!order) return null;

  const pill = getStatusPill(order.status);
  const total = Number(order.totalAmount || 0).toFixed(2);
  const isPending = order.status === "pending";

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reservation</Text>
        <View style={[styles.statusPill, { backgroundColor: pill.bg }]}>
          <Text style={[styles.statusPillText, { color: pill.color }]}>{pill.text}</Text>
        </View>
      </View>

      <View style={styles.body}>
        {order.items?.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <Text style={styles.itemName}>
              {item.productName || "Produce"} — {formatItemUnit(item.quantity, item.scalingType)}
            </Text>
          </View>
        ))}

        <Text style={styles.totalText}>Total ₱{total}</Text>

        {isPending && order.expiresAt ? (
          <Text style={styles.expiresText}>{formatExpiration(order.expiresAt)}</Text>
        ) : null}

        <Pressable
          onPress={() => router.push({ pathname: "/(app)/orders/[id]", params: { id: orderId } })}
          accessibilityRole="button"
          accessibilityLabel="View Reservation"
          style={({ pressed }) => [styles.viewBtn, pressed && styles.viewBtnPressed]}
        >
          <Text style={styles.viewBtnText}>View Reservation</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    maxWidth: "88%",
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignSelf: "flex-start",
    marginVertical: spacing.sm,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    backgroundColor: colors.surfaceMuted,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: { fontFamily: fonts.heading.bold, fontSize: 13, color: colors.text },
  statusPill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: radii.full },
  statusPillText: { fontFamily: fonts.body.semiBold, fontSize: 11 },
  body: { padding: spacing.md },
  itemRow: { marginVertical: 2 },
  itemName: { fontFamily: fonts.body.regular, fontSize: 14, color: colors.text },
  totalText: {
    fontFamily: fonts.heading.bold,
    fontSize: 14,
    color: colors.primaryPressed,
    marginTop: spacing.xs,
  },
  expiresText: {
    fontFamily: fonts.body.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
  viewBtn: {
    height: 44,
    borderRadius: radii.button,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    marginTop: spacing.md,
  },
  viewBtnPressed: { backgroundColor: colors.surfaceMuted },
  viewBtnText: { fontFamily: fonts.body.semiBold, fontSize: 13, color: colors.text },
});
