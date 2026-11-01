import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { ChevronRight, Sprout } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import { getProductStatus } from "../../inventory/productStatus";
import type { Product } from "../../inventory/types";
import type { SellerOrder } from "../../orders/types";
import type { Conversation } from "../types";
import { orderPill, peso, unitShort } from "../utils/chatFormat";

interface Props {
  conversation: Conversation;
  order?: SellerOrder | null;
  product?: Product | null;
  onPress?: () => void;
}

function Thumb({ uri }: { uri?: string | null }) {
  return (
    <View style={styles.thumbBox}>
      {uri ? <Image source={{ uri }} style={styles.thumb} /> : <Sprout size={20} color={colors.primary} />}
    </View>
  );
}

/** What the chat is about: the reservation, or the listing with its price and stock. */
export function ConversationContextBanner({ conversation, order, product, onPress }: Props) {
  let title: string;
  let detail: string;
  let pill: { text: string; bg: string; color: string } | null = null;

  if (conversation.orderId) {
    const first = order?.items?.[0];
    const more = (order?.items?.length ?? 0) - 1;
    const quantity = first ? `${Number(first.quantity ?? 1)} ${unitShort(first.scalingType, Number(first.quantity ?? 2))}`.trim() : "";
    title = `${first?.productName || conversation.productName || "Reservation"}${quantity ? ` • ${quantity}` : ""}${more > 0 ? ` +${more} more` : ""}`;
    detail = order ? `Total ${peso(order.totalAmount)}` : "Reservation";
    pill = orderPill(order?.status);
  } else {
    title = conversation.productName || "Listing";
    if (product) {
      const qty = Number(product.productQty ?? 0);
      detail = `${peso(product.productPrice)} / ${unitShort(product.scalingType, 1)} · ${qty} ${unitShort(product.scalingType, qty)} in stock`;
      const status = getProductStatus(product);
      pill = { text: status.label, bg: status.background, color: status.color };
    } else {
      detail = "Listing";
    }
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${detail}${pill ? `. ${pill.text}` : ""}`}
      style={({ pressed }) => [styles.banner, pressed && styles.pressed]}
    >
      <Thumb uri={conversation.productImageUrl} />
      <View style={styles.textColumn}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.detail} numberOfLines={1}>{detail}</Text>
      </View>
      {pill ? (
        <View style={[styles.pill, { backgroundColor: pill.bg }]}>
          <Text style={[styles.pillText, { color: pill.color }]} numberOfLines={1}>{pill.text}</Text>
        </View>
      ) : null}
      {onPress ? <ChevronRight size={18} color={colors.textMuted} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  banner: { flexDirection: "row", alignItems: "center", gap: spacing.sm, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border, paddingHorizontal: spacing.base, paddingVertical: spacing.sm, minHeight: 64 },
  pressed: { backgroundColor: colors.surfaceMuted },
  thumbBox: { width: 48, height: 48, borderRadius: radii.sm + 2, backgroundColor: colors.primaryLight, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  thumb: { width: 48, height: 48 },
  textColumn: { flex: 1 },
  title: { fontFamily: fonts.heading.bold, fontSize: 15, color: colors.text },
  detail: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted, marginTop: 1 },
  pill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radii.full, maxWidth: 130 },
  pillText: { fontFamily: fonts.body.semiBold, fontSize: 11 },
});
