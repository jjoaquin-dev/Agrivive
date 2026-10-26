import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { CheckCircle2, Clock3, RotateCcw, XCircle } from "lucide-react-native";
import { boostReasonLabel, boostStatusLabel, type SellerVisibilityBoost } from "../types";
import { colors, fonts, radii, spacing } from "../../../theme";

interface Props {
  item: SellerVisibilityBoost;
  onOpen: () => void;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function BoostHistoryCard({ item, onOpen }: Props) {
  const failed = item.status === "failed";
  const tone = failed
    ? colors.error
    : item.status === "sent"
    ? colors.success
    : item.status === "prompt"
    ? colors.warning
    : colors.primary;
  const Icon = failed
    ? XCircle
    : item.status === "sent"
    ? CheckCircle2
    : item.status === "prompt"
    ? RotateCcw
    : Clock3;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitle}>
          <Text style={styles.product} numberOfLines={1}>{item.productName}</Text>
          <Text style={styles.reason}>{boostReasonLabel(item.reason)} · {formatDate(item.createdAt)}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: `${tone}18` }]}>
          <Icon size={14} color={tone} />
          <Text style={[styles.badgeText, { color: tone }]}>{boostStatusLabel(item.status)}</Text>
        </View>
      </View>
      {item.priceBefore && item.priceAfter ? (
        <Text style={styles.price}>
          Price: ₱{Number(item.priceBefore).toFixed(2)} → ₱{Number(item.priceAfter).toFixed(2)}
        </Text>
      ) : null}
      {item.errorMessage ? <Text style={styles.error}>{item.errorMessage}</Text> : null}
      <Pressable onPress={onOpen} accessibilityRole="button" style={({ pressed }) => [styles.open, pressed && styles.pressed]}>
        <Text style={styles.openText}>{failed ? "Open listing and try again" : "View listing status"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border, padding: spacing.base, marginTop: spacing.sm },
  cardHeader: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm },
  cardTitle: { flex: 1 },
  product: { fontFamily: fonts.heading.semiBold, fontSize: 16, color: colors.text },
  reason: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted, marginTop: 3 },
  badge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: spacing.sm, paddingVertical: 6, borderRadius: radii.full, maxWidth: "52%" },
  badgeText: { fontFamily: fonts.body.semiBold, fontSize: 11, flexShrink: 1 },
  price: { fontFamily: fonts.body.medium, fontSize: 14, color: colors.primary, marginTop: spacing.md },
  error: { fontFamily: fonts.body.medium, fontSize: 13, lineHeight: 19, color: colors.error, marginTop: spacing.sm },
  open: { minHeight: 44, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border, borderRadius: radii.button, marginTop: spacing.md },
  openText: { fontFamily: fonts.body.semiBold, fontSize: 13, color: colors.primary },
  pressed: { backgroundColor: colors.background },
});
