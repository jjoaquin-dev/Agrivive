import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { CheckCircle2, ChevronRight, Clock3, RotateCcw, XCircle } from "lucide-react-native";
import {
  boostReasonLabel, boostState, boostStateLabel, formatBoostTime, productCode, waitText, type SellerVisibilityBoost,
} from "../types";
import { BoostTimeline } from "./BoostTimeline";
import { PlatformBadge } from "./PlatformBadge";
import { colors, fonts, radii, spacing, shadows } from "../../../theme";

interface Props {
  item: SellerVisibilityBoost;
  onOpen: () => void;
}

/** Campaign card modeled after familiar social ad cards (Jakob's Law). */
export function BoostHistoryCard({ item, onOpen }: Props) {
  const state = boostState(item);
  const bad = state === "failed" || state === "not_posted";
  const isLive = state === "running" || state === "posted";
  const tone = bad ? colors.error : state === "needs_choice" ? colors.warning
    : state === "posting" || state === "dismissed" ? colors.primary : colors.success;
  const Icon = bad ? XCircle : state === "needs_choice" ? RotateCcw : state === "posting" ? Clock3 : CheckCircle2;

  return (
    <View style={[styles.card, bad && styles.cardBad]}>
      <View style={styles.cardHeader}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.photo} />
        ) : (
          <View style={[styles.photo, styles.photoPlaceholder]} />
        )}
        <View style={styles.cardTitle}>
          <Text style={styles.product} numberOfLines={1}>{item.productName}</Text>
          <View style={styles.platformRow}>
            <PlatformBadge platform="facebook" size={14} />
            <PlatformBadge platform="instagram" size={14} />
            <Text style={styles.platformText}>Agrivive Pages</Text>
          </View>
          <Text style={styles.metaText}>{productCode(item.productId)} · {formatBoostTime(item.createdAt)}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: `${tone}15` }]}>
          <Icon size={12} color={tone} />
          <Text style={[styles.badgeText, { color: tone }]}>{boostStateLabel(state)}</Text>
        </View>
      </View>

      <View style={styles.priceRow}>
        <View>
          <Text style={styles.priceLabel}>Price now</Text>
          <Text style={styles.priceValue}>₱{item.currentPrice?.toFixed(2) ?? "—"}</Text>
        </View>
        {item.lowestPrice != null ? (
          <View style={styles.priceDivider}>
            <Text style={styles.priceLabel}>Lowest price</Text>
            <Text style={styles.floorValue}>₱{item.lowestPrice.toFixed(2)}</Text>
          </View>
        ) : null}
      </View>

      {item.progress ? <BoostTimeline progress={item.progress} limit={2} /> : null}
      {item.progress?.waitUntil ? <Text style={styles.metaText}>You can boost this lower price again in {waitText(item.progress.waitUntil)}.</Text> : null}
      {item.errorMessage ? <View style={styles.errorRow}><XCircle size={14} color={colors.error} /><Text style={styles.error}>{item.errorMessage}</Text></View> : null}

      <Pressable onPress={onOpen} accessibilityRole="button" style={({ pressed }) => [styles.actionBtn, bad && styles.actionBad, pressed && styles.pressed]}>
        <Text style={[styles.actionText, bad && styles.actionTextBad]}>{bad ? "Try Again" : "Manage Boost"}</Text>
        {bad ? null : <ChevronRight size={16} color={colors.primary} />}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  cardBad: { borderColor: "#FECACA" },
  errorRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, backgroundColor: "#FEF2F2", borderWidth: 1, borderColor: "#FECACA", borderRadius: radii.input, padding: spacing.sm, marginTop: spacing.sm },
  actionBad: { backgroundColor: "#FEF2F2", borderColor: "#FECACA" },
  actionTextBad: { color: colors.error },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
    marginTop: spacing.sm,
    ...shadows.card,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  photo: {
    width: 52,
    height: 52,
    borderRadius: radii.sm + 4,
    backgroundColor: colors.surfaceMuted,
  },
  photoPlaceholder: {
    backgroundColor: colors.primaryLight,
  },
  cardTitle: {
    flex: 1,
  },
  product: {
    fontFamily: fonts.heading.bold,
    fontSize: 16,
    color: colors.text,
  },
  platformRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  platformText: {
    fontFamily: fonts.body.regular,
    fontSize: 11,
    color: colors.textMuted,
    marginLeft: 2,
  },
  metaText: {
    fontFamily: fonts.body.regular,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radii.full,
  },
  badgeText: {
    fontFamily: fonts.body.semiBold,
    fontSize: 11,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xl,
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  priceLabel: {
    fontFamily: fonts.body.regular,
    fontSize: 11,
    color: colors.textMuted,
  },
  priceValue: {
    fontFamily: fonts.heading.bold,
    fontSize: 16,
    color: colors.primary,
    marginTop: 1,
  },
  priceDivider: {
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
    paddingLeft: spacing.md,
  },
  floorValue: {
    fontFamily: fonts.body.semiBold,
    fontSize: 14,
    color: colors.text,
    marginTop: 1,
  },
  error: {
    fontFamily: fonts.body.medium,
    fontSize: 13,
    color: colors.error,
    flex: 1,
  },
  actionBtn: {
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.button,
    marginTop: spacing.md,
    backgroundColor: colors.surfaceMuted,
  },
  actionText: {
    fontFamily: fonts.body.semiBold,
    fontSize: 13,
    color: colors.primary,
  },
  pressed: {
    opacity: 0.8,
  },
});
