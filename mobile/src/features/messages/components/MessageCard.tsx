import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ChevronRight, MessageCircle } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import type { SellerMessage } from "../types";

function money(value: string) {
  return `₱${Number(value).toFixed(2)}`;
}

export function MessageCard({ message, onPress }: { message: SellerMessage; onPress: () => void }) {
  const isOpen = !message.reply;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${isOpen ? "Open" : "Answered"} buyer message for order ${message.orderId.slice(0, 8)}`}
      style={({ pressed }) => [styles.card, isOpen && styles.openCard, pressed && styles.pressed]}
    >
      <View style={[styles.iconCircle, isOpen && styles.openIcon]}>
        <MessageCircle size={19} color={isOpen ? colors.primary : colors.textMuted} />
      </View>
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{isOpen ? "Buyer message" : "Answered message"}</Text>
          <Text style={styles.order}>Order {message.orderId.slice(0, 8)}</Text>
        </View>
        <Text style={styles.question} numberOfLines={2}>{message.question}</Text>
        <Text style={styles.meta}>{money(message.totalAmount)} · {new Date(message.createdAt).toLocaleString()}</Text>
      </View>
      <ChevronRight size={20} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { minHeight: 92, flexDirection: "row", alignItems: "center", backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radii.card, padding: spacing.base, marginBottom: spacing.sm },
  openCard: { borderColor: colors.primary, backgroundColor: "rgba(31, 77, 58, 0.04)" },
  pressed: { opacity: 0.75 },
  iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.background, alignItems: "center", justifyContent: "center", marginRight: spacing.md },
  openIcon: { backgroundColor: "rgba(31, 77, 58, 0.12)" },
  body: { flex: 1, marginRight: spacing.sm },
  titleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { fontFamily: fonts.body.semiBold, fontSize: 16, color: colors.text },
  order: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted },
  question: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, color: colors.text, marginTop: spacing.xs },
  meta: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted, marginTop: spacing.xs },
});
