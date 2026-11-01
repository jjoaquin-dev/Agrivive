import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { ChevronRight, Sprout } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import type { Conversation } from "../types";
import type { SellerOrder, SellerOrderStatus } from "../../orders/types";

interface ConversationContextBannerProps {
  conversation: Conversation;
  order?: SellerOrder | null;
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

export function ConversationContextBanner({ conversation, order }: ConversationContextBannerProps) {
  const router = useRouter();
  const isOrder = Boolean(conversation.orderId);

  const handlePress = () => {
    if (conversation.orderId) {
      router.push({ pathname: "/(app)/orders/[id]", params: { id: conversation.orderId } });
    } else if (conversation.productId) {
      router.push({ pathname: "/(app)/inventory/[id]", params: { id: conversation.productId } });
    }
  };

  if (isOrder) {
    const produceName = order?.items?.[0]?.productName || conversation.productName || "Reservation";
    const pill = getStatusPill(order?.status);

    return (
      <Pressable
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={`Reservation: ${produceName}, ${pill.text}`}
        style={({ pressed }) => [styles.banner, pressed && styles.bannerPressed]}
      >
        <View style={styles.contentRow}>
          <Text style={styles.produceName} numberOfLines={1}>
            {produceName}
          </Text>
          <View style={[styles.statusPill, { backgroundColor: pill.bg }]}>
            <Text style={[styles.statusPillText, { color: pill.color }]}>{pill.text}</Text>
          </View>
        </View>
        <ChevronRight size={18} color={colors.textMuted} />
      </Pressable>
    );
  }

  const produceName = conversation.productName || "Listing";

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`Produce listing: ${produceName}`}
      style={({ pressed }) => [styles.banner, pressed && styles.bannerPressed]}
    >
      <View style={styles.thumbBox}>
        {conversation.productImageUrl ? (
          <Image source={{ uri: conversation.productImageUrl }} style={styles.thumb} />
        ) : (
          <Sprout size={20} color={colors.primary} />
        )}
      </View>
      <View style={styles.textColumn}>
        <Text style={styles.produceName} numberOfLines={1}>
          {produceName}
        </Text>
        <Text style={styles.listingLabel}>Listing</Text>
      </View>
      <ChevronRight size={18} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    minHeight: 52,
  },
  bannerPressed: { backgroundColor: colors.surfaceMuted },
  thumbBox: {
    width: 40,
    height: 40,
    borderRadius: radii.sm,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginRight: spacing.md,
  },
  thumb: { width: 40, height: 40 },
  textColumn: { flex: 1, marginRight: spacing.sm },
  produceName: { fontFamily: fonts.heading.bold, fontSize: 14, color: colors.text, flexShrink: 1 },
  listingLabel: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted, marginTop: 1 },
  contentRow: { flex: 1, flexDirection: "row", alignItems: "center", gap: spacing.sm, marginRight: spacing.sm },
  statusPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: radii.full },
  statusPillText: { fontFamily: fonts.body.semiBold, fontSize: 11 },
});
