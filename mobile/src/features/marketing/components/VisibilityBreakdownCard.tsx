import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ChevronDown, ChevronUp, Star } from "lucide-react-native";
import { colors, fonts, radii, shadows, spacing } from "../../../theme";
import type { SellerVisibilityItem } from "../api/seller-visibility";
import type { Product } from "../../inventory/types";
import { VisibilityFactorsGrid } from "./VisibilityFactorsGrid";
import { BoostChip } from "./BoostChip";
import { hasActiveBoost } from "../types";

interface VisibilityBreakdownCardProps {
  item: SellerVisibilityItem;
  productName?: string;
  product?: Product;
  onBoost: () => void;
}

const peso = (value: number) => `₱${Number.isInteger(value) ? value : value.toFixed(2)}`;
const SEGMENTS = 4;

function placement(item: SellerVisibilityItem) {
  const tier = item.tier?.toLowerCase() ?? "";
  if (item.score === null) return { label: "Not shown yet", line: item.reason || "Add stock and keep the listing on so buyers can see it.", tone: "warn" as const };
  if (tier.includes("priority")) return { label: "Priority Boost", line: "Buyers see this near the top.", tone: "good" as const };
  if (tier.includes("standard")) return { label: "Standard Exposure", line: "Buyers see this in the middle.", tone: "good" as const };
  return { label: "Basic/Hold", line: "Buyers see this lower down.", tone: "quiet" as const };
}

const tones = {
  good: { bg: "rgba(22, 163, 74, 0.10)", fg: colors.success },
  warn: { bg: "#FFF7ED", fg: colors.warning },
  quiet: { bg: "#F3F4F6", fg: colors.textMuted },
};

export function VisibilityBreakdownCard({ item, productName, product, onBoost }: VisibilityBreakdownCardProps) {
  const [expanded, setExpanded] = useState(false);
  const spot = placement(item);
  const tone = tones[spot.tone];
  const score = item.score === null ? null : Math.round(item.score * 100);
  const filled = score === null ? 0 : Math.round((score / 100) * SEGMENTS);
  const lowered = product?.basePrice != null && Number(product.basePrice) > Number(product.productPrice);
  const name = productName || `Product #${item.productId.slice(0, 8)}`;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleLine}>
          <Text style={styles.productName} numberOfLines={1}>{name}</Text>
          <Text style={styles.code}>{`PRD-${item.productId.slice(0, 4).toUpperCase()}`}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: tone.bg }]}>
          {spot.label === "Priority Boost" ? <Star size={12} color={tone.fg} fill={tone.fg} /> : null}
          <Text style={[styles.badgeText, { color: tone.fg }]}>{spot.label}</Text>
        </View>
      </View>

      <Text style={[styles.line, score === null && styles.lineQuiet]}>{spot.line}</Text>

      {score !== null ? (
        <View style={styles.scoreRow} accessibilityLabel={`Score ${score} of 100`}>
          <View style={styles.segments}>
            {Array.from({ length: SEGMENTS }, (_, i) => (
              <View key={i} style={[styles.segment, i < filled && styles.segmentOn]} />
            ))}
          </View>
          <Text style={styles.scoreText}>Score {score} of 100</Text>
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
        <Pressable onPress={onBoost} accessibilityRole="button" accessibilityLabel={`Boost ${name}`} style={styles.boostButton}>
          <Text style={styles.boostText} numberOfLines={1}>{hasActiveBoost(product?.boost) ? "View Boost" : "Boost"}</Text>
        </Pressable>
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
  segments: { flex: 1, flexDirection: "row", gap: spacing.xs },
  segment: { flex: 1, height: 6, borderRadius: 3, backgroundColor: colors.border },
  segmentOn: { backgroundColor: colors.primary },
  scoreText: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted },
  dropChip: { alignSelf: "flex-start", backgroundColor: "#FFF7ED", borderWidth: 1, borderColor: "#FED7AA", borderRadius: radii.full, paddingHorizontal: spacing.sm, paddingVertical: 4, marginTop: spacing.sm },
  dropText: { fontFamily: fonts.body.semiBold, fontSize: 11, color: colors.warning },
  actionRow: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.md },
  whyButton: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, minHeight: 48, borderRadius: radii.button, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  whyText: { fontFamily: fonts.body.semiBold, fontSize: 14, color: colors.text },
  boostButton: { flex: 1, alignItems: "center", justifyContent: "center", minHeight: 48, borderRadius: radii.button, backgroundColor: colors.primary },
  boostText: { fontFamily: fonts.body.semiBold, fontSize: 14, color: colors.white },
});
