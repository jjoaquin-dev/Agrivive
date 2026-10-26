import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Calendar } from "lucide-react-native";
import { fonts, radii, spacing } from "../../../theme";
import { fetchSellerOrder } from "../../orders/api/seller-orders";
import type { SellerOrder } from "../../orders/types";

export function ConversationReservationCard({ orderId, fallbackProductName }: { orderId: string; fallbackProductName?: string }) {
  const router = useRouter();
  const [order, setOrder] = useState<SellerOrder | null>(null);

  useEffect(() => {
    void fetchSellerOrder(orderId).then(setOrder).catch(() => {});
  }, [orderId]);

  if (!order) return null;

  const firstItem = order.items?.[0];
  const productName = firstItem?.productName || fallbackProductName || "Surplus Produce";
  const unitLabel = firstItem?.scalingType === "kilo" ? "kg" : (firstItem?.scalingType || "");
  const quantity = firstItem ? `${Number(firstItem.quantity || 1)} ${unitLabel}`.trim() : "Reserved items";
  const total = order.totalAmount ? `₱${order.totalAmount}` : "";

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Calendar size={15} color="#FFFFFF" />
        <Text style={styles.headerText}>Reservation Created</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.productName}>{productName}</Text>
        <View style={styles.detailsRow}>
          <Text style={styles.label}>Quantity</Text>
          <Text style={styles.value}>{quantity}</Text>
        </View>
        {total ? (
          <View style={styles.detailsRow}>
            <Text style={styles.label}>Total</Text>
            <Text style={[styles.value, styles.totalValue]}>{total}</Text>
          </View>
        ) : null}
        <Pressable
          onPress={() => router.push({ pathname: "/(app)/orders/[id]", params: { id: orderId } })}
          style={styles.button}
        >
          <Text style={styles.buttonText}>View Reservation</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    maxWidth: "84%",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#16A34A",
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    alignSelf: "flex-start",
    marginVertical: spacing.xs,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#16A34A",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  headerText: { fontFamily: fonts.heading.bold, fontSize: 13, color: "#FFFFFF" },
  body: { padding: spacing.md },
  productName: { fontFamily: fonts.heading.bold, fontSize: 15, color: "#111827", marginBottom: spacing.xs },
  detailsRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 2 },
  label: { fontFamily: fonts.body.regular, fontSize: 13, color: "#6B7280" },
  value: { fontFamily: fonts.body.semiBold, fontSize: 13, color: "#111827" },
  totalValue: { color: "#16A34A" },
  button: {
    marginTop: spacing.md,
    backgroundColor: "#16A34A",
    borderRadius: radii.sm,
    paddingVertical: 8,
    alignItems: "center",
  },
  buttonText: { fontFamily: fonts.body.semiBold, fontSize: 13, color: "#FFFFFF" },
});
