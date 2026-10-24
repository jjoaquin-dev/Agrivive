import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Sprout } from "lucide-react-native";
import { fonts, radii, spacing } from "../../../theme";
import type { Conversation } from "../types";

export function ConversationContextBanner({ conversation }: { conversation: Conversation }) {
  const router = useRouter();
  const title = conversation.productName || "Surplus Produce";
  const refCode = conversation.orderId
    ? `ORD-${conversation.orderId.slice(0, 8).toUpperCase()}`
    : conversation.productId
    ? `PRD-${conversation.productId.slice(0, 8).toUpperCase()}`
    : "Direct Chat";

  const handleAction = () => {
    if (conversation.orderId) {
      router.push({ pathname: "/(app)/orders/[id]", params: { id: conversation.orderId } });
    } else if (conversation.productId) {
      router.push({ pathname: "/(app)/inventory/[id]", params: { id: conversation.productId } });
    }
  };

  return (
    <View style={styles.banner}>
      <View style={styles.thumbBox}>
        {conversation.productImageUrl ? (
          <Image source={{ uri: conversation.productImageUrl }} style={styles.thumb} />
        ) : (
          <Sprout size={18} color="#16A34A" />
        )}
      </View>
      <View style={styles.textColumn}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.refCode}>{refCode}</Text>
      </View>
      <Pressable onPress={handleAction} style={styles.actionBtn}>
        <Text style={styles.actionBtnText}>{conversation.orderId ? "View Order" : "View Listing"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    borderBottomWidth: 1,
    borderBottomColor: "#DCFCE7",
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  thumbBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginRight: spacing.sm,
  },
  thumb: { width: 36, height: 36 },
  textColumn: { flex: 1, marginRight: spacing.sm },
  title: { fontFamily: fonts.heading.bold, fontSize: 13, color: "#166534" },
  refCode: { fontFamily: fonts.body.regular, fontSize: 11, color: "#15803D" },
  actionBtn: { backgroundColor: "#16A34A", borderRadius: radii.sm, paddingHorizontal: 12, paddingVertical: 6 },
  actionBtnText: { fontFamily: fonts.body.semiBold, fontSize: 12, color: "#FFFFFF" },
});
