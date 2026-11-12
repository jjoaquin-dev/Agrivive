import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ChevronDown, ChevronUp, Star } from "lucide-react-native";
import { colors, fonts, radii, shadows, spacing } from "../../../theme";
import type { SellerVisibilityItem } from "../api/seller-visibility";
import type { Product } from "../../inventory/types";
import { VisibilityFactorsGrid } from "./VisibilityFactorsGrid";
import { BoostChip } from "./BoostChip";
import { hasActiveBoost } from "../types";
import { formatPeso as peso } from "../../../utils/money";

interface VisibilityBreakdownCardProps {
  item: SellerVisibilityItem;
  productName?: string;
  product?: Product;
  onBoost: () => void;
}


function placement(item: SellerVisibilityItem) {
  if (item.score === null || !item.rank) return { label: "Not shown yet", line: item.reason || "Add stock and keep the listing on so buyers can see it.", tone: "warn" as const };
  return { label: item.totalRanked ? `Rank ${item.rank} of ${item.totalRanked}` : `Rank ${item.rank}`, line: "Buyers see higher ranks first.", tone: item.rank === 1 ? "good" as const : "quiet" as const };
}

const tones = {
  good: { bg: "rgba(22, 163, 74, 0.10)", fg: colors.success },
  warn: { bg: colors.orangeSurface, fg: colors.warning },
  quiet: { bg: colors.surfaceMuted, fg: colors.textMuted },
};

export function VisibilityBreakdownCard({ item, productName, product, onBoost }: VisibilityBreakdownCardProps) {
  const [expanded, setExpanded] = useState(false);
  const spot = placement(item);
  const tone = tones[spot.tone];
  const score = item.score;
  const lowered = product?.basePrice != null && Number(product.basePrice) > Number(product.productPrice);
  const name = productName || `Product #${item.productId.slice(0, 8)}`;
  const failed = product?.boost?.state === "not_posted" || product?.boost?.state === "failed";
  // Only the first post is by hand. Once it is out, everything after it is automatic, so there is nothing to tap.
  const posted = hasActiveBoost(product?.boost);
  const postLabel = failed ? "Try Again" : "Post It";

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleLine}>
          <Text style={styles.productName} numberOfLines={1}>{name}</Text>
          <Text style={styles.code}>{`PRD-${item.productId.slice(0, 4).toUpperCase()}`}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: tone.bg }]}>
          {item.rank === 1 ? <Star size={12} color={tone.fg} fill={tone.fg} /> : null}
          <Text style={[styles.badgeText, { color: tone.fg }]}>{spot.label}</Text>
        </View>
      </View>

      <Text style={[styles.line, score === null && styles.lineQuiet]}>{spot.line}</Text>

      {score !== null ? (
        <View style={styles.scoreRow} accessibilityLabel={`Score ${(score * 100).toFixed(1)} out of 100`}>
          <View style={styles.segments}>
            <View style={[styles.segmentOn, { width: `${Math.round(Math.min(1, Math.max(0, score)) * 100)}%` }]} />
          </View>
          <Text style={styles.scoreText}>Score {(score * 100).toFixed(1)} / 100</Text>
        </View>
      ) : null}

      {lowered && product ? (
        <View style={styles.dropChip}>
          <Text style={styles.dropText}>Price lowered · {peso(Number(product.basePrice))} → {peso(Number(product.productPrice))}</Text>
        </View>
      ) : null}
      <BoostChip boost={product?.boost} />

      <View style={styles.actionRow}>
        <Pressable
          onPress={() => setExpanded((prev) => !prev)}
          style={styles.whyButton}
          accessibilityRole="button"
          accessibilityState={{ expanded }}
          accessibilityLabel={expanded ? "Hide why" : "Show why"}
        >
          <Text style={styles.whyText}>Why?</Text>
          {expanded ? <ChevronUp size={16} color={colors.text} /> : <ChevronDown size={16} color={colors.text} />}
        </Pressable>
        {posted ? null : (
          <Pressable onPress={onBoost} accessibilityRole="button" accessibilityLabel={`${postLabel} ${name}`} style={styles.boostButton}>
            <Text style={styles.boostText} numberOfLines={1}>{postLabel}</Text>
          </Pressable>
        )}
      </View>

      {expanded ? <VisibilityFactorsGrid item={item} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border, padding: spacing.base, marginBottom: spacing.md, ...shadows.card },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.sm },
  titleLine: { flex: 1, flexDirection: "row", alignItems: "baseline", gap: spacing.sm },
  productName: { flexShrink: 1, fontFamily: fonts.heading.bold, fontSize: 16, color: colors.text },
  code: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted },
  badge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: radii.full },
  badgeText: { fontFamily: fonts.body.semiBold, fontSize: 11 },
  line: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, color: colors.text, marginTop: spacing.sm },
  lineQuiet: { color: colors.textMuted },
  scoreRow: { flexDirection: "row", alignItems: "center", gap: spacing.md, marginTop: spacing.sm },
  segments: { flex: 1, height: 6, borderRadius: 4, backgroundColor: colors.border, overflow: "hidden" },
  segmentOn: { height: 6, borderRadius: 4, backgroundColor: colors.primary },
  scoreText: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted },
  dropChip: { alignSelf: "flex-start", backgroundColor: colors.orangeSurface, borderWidth: 1, borderColor: colors.orangeBorder, borderRadius: radii.full, paddingHorizontal: spacing.sm, paddingVertical: 4, marginTop: spacing.sm },
  dropText: { fontFamily: fonts.body.semiBold, fontSize: 11, color: colors.warning },
  actionRow: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.md },
  whyButton: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, minHeight: 48, borderRadius: radii.button, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  whyText: { fontFamily: fonts.body.semiBold, fontSize: 14, color: colors.text },
  boostButton: { flex: 1, alignItems: "center", justifyContent: "center", minHeight: 48, borderRadius: radii.button, backgroundColor: colors.primary },
  boostText: { fontFamily: fonts.body.semiBold, fontSize: 14, color: colors.white },
});
