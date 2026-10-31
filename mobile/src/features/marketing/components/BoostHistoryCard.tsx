import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { CheckCircle2, Clock3, RotateCcw, XCircle } from "lucide-react-native";
import {
  boostReasonLabel, boostState, boostStateLabel, formatBoostTime, productCode, type SellerVisibilityBoost,
} from "../types";
import { BoostTimeline } from "./BoostTimeline";
import { colors, fonts, radii, spacing } from "../../../theme";

interface Props {
  item: SellerVisibilityBoost;
  onOpen: () => void;
}

export function BoostHistoryCard({ item, onOpen }: Props) {
  const state = boostState(item);
  const bad = state === "failed" || state === "not_posted";
  const tone = bad ? colors.error : state === "needs_choice" ? colors.warning
    : state === "posting" || state === "dismissed" ? colors.primary : colors.success;
  const Icon = bad ? XCircle : state === "needs_choice" ? RotateCcw : state === "posting" ? Clock3 : CheckCircle2;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        {item.imageUrl ? <Image source={{ uri: item.imageUrl }} style={styles.photo} /> : <View style={styles.photo} />}
        <View style={styles.cardTitle}>
          <Text style={styles.product} numberOfLines={1}>{item.productName}</Text>
          <Text style={styles.reason}>{productCode(item.productId)} · {boostReasonLabel(item.reason)}</Text>
          <Text style={styles.reason}>{formatBoostTime(item.createdAt)}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: `${tone}18` }]}>
          <Icon size={14} color={tone} />
          <Text style={[styles.badgeText, { color: tone }]}>{boostStateLabel(state)}</Text>
        </View>
      </View>
      {item.currentPrice != null ? (
        <Text style={styles.price}>
          Now ₱{item.currentPrice.toFixed(2)}{item.lowestPrice != null ? ` · Lowest ₱${item.lowestPrice.toFixed(2)}` : ""}
        </Text>
      ) : null}
      {item.progress ? <BoostTimeline progress={item.progress} limit={3} /> : null}
      {item.errorMessage ? <Text style={styles.error}>{item.errorMessage}</Text> : null}
      <Pressable onPress={onOpen} accessibilityRole="button" style={({ pressed }) => [styles.open, pressed && styles.pressed]}>
        <Text style={styles.openText}>{bad ? "Open Boost and try again" : "Open Boost"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border, padding: spacing.base, marginTop: spacing.sm },
  cardHeader: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm },
  photo: { width: 48, height: 48, borderRadius: radii.button, backgroundColor: colors.background },
  cardTitle: { flex: 1 },
  product: { fontFamily: fonts.heading.semiBold, fontSize: 16, color: colors.text },
  reason: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted, marginTop: 2 },
  badge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: spacing.sm, paddingVertical: 6, borderRadius: radii.full, maxWidth: "42%" },
  badgeText: { fontFamily: fonts.body.semiBold, fontSize: 11, flexShrink: 1 },
  price: { fontFamily: fonts.body.medium, fontSize: 14, color: colors.primary, marginTop: spacing.md },
  error: { fontFamily: fonts.body.medium, fontSize: 13, lineHeight: 19, color: colors.error, marginTop: spacing.sm },
  open: { minHeight: 44, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border, borderRadius: radii.button, marginTop: spacing.md },
  openText: { fontFamily: fonts.body.semiBold, fontSize: 13, color: colors.primary },
  pressed: { backgroundColor: colors.background },
});
