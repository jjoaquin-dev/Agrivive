import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Award, Info, Sparkles, TrendingUp } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import type { SellerVisibilityItem } from "../api/seller-visibility";

interface VisibilityBreakdownCardProps {
  item: SellerVisibilityItem;
  productName?: string;
}

function factorLabel(value: number | undefined) {
  return typeof value === "number" && Number.isFinite(value)
    ? `${(value * 100).toFixed(0)}%`
    : "Not available";
}

export function VisibilityBreakdownCard({ item, productName }: VisibilityBreakdownCardProps) {
  const tierColor =
    item.tier === "priority"
      ? colors.primary
      : item.tier === "standard"
      ? colors.success
      : colors.textMuted;

  const tierBg =
    item.tier === "priority"
      ? "rgba(31, 77, 58, 0.12)"
      : item.tier === "standard"
      ? "rgba(63, 125, 88, 0.12)"
      : "rgba(100, 116, 139, 0.12)";

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleColumn}>
          <Text style={styles.productName} numberOfLines={1}>
            {productName || `Product #${item.productId.slice(0, 8)}`}
          </Text>
          <Text style={styles.metaSubtitle}>Marketplace Visibility Guide</Text>
        </View>

        <View style={[styles.tierBadge, { backgroundColor: tierBg }]}>
          {item.tier === "priority" ? (
            <Sparkles size={12} color={tierColor} />
          ) : (
            <Award size={12} color={tierColor} />
          )}
          <Text style={[styles.tierBadgeText, { color: tierColor }]}>
            {item.tier ? `${item.tier.toUpperCase()} TIER` : "UNRANKED"}
          </Text>
        </View>
      </View>

      {item.score !== null && item.inputs ? (
        <>
          <View style={styles.scoreRow}>
            <View>
              <Text style={styles.scoreLabel}>Placement Score</Text>
              <Text style={styles.scoreValue}>{item.score.toFixed(4)}</Text>
            </View>
            <View style={styles.scoreGuide}>
              <TrendingUp size={16} color={colors.primary} />
              <Text style={styles.scoreGuideText}>
                {item.tier === "priority"
                  ? "Featured near top of buyer browse"
                  : item.tier === "standard"
                  ? "Balanced marketplace search ranking"
                  : "Standard catalog position"}
              </Text>
            </View>
          </View>

          <View style={styles.factorsGrid}>
            <View style={styles.factorItem}>
              <Text style={styles.factorLabel}>Posting Age Factor</Text>
              <Text style={styles.factorValue}>
                {factorLabel(item.inputs.postingAge)}
              </Text>
            </View>

            <View style={styles.factorItem}>
              <Text style={styles.factorLabel}>Available Stock Factor</Text>
              <Text style={styles.factorValue}>
                {factorLabel(item.inputs.remainingQuantity)}
              </Text>
            </View>

            <View style={styles.factorItem}>
              <Text style={styles.factorLabel}>Prior cycles (30d)</Text>
              <Text style={styles.factorValue}>
                {Number.isFinite(item.inputs.priorCycles)
                  ? `${item.inputs.priorCycles}`
                  : "Not available"}
              </Text>
            </View>
          </View>
        </>
      ) : (
        <View style={styles.unrankedNotice}>
          <Info size={16} color={colors.warning} />
          <Text style={styles.unrankedText}>
            {item.reason || "Ensure stock is positive to receive visibility ranking."}
          </Text>
        </View>
      )}

      <Text style={styles.disclaimerText}>
        Visibility is calculated systematically from posting age, available stock, and prior listing cycles. Placement rules are automated and read-only.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
    marginBottom: spacing.md,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  titleColumn: {
    flex: 1,
  },
  productName: {
    fontFamily: fonts.heading.bold,
    fontSize: 16,
    color: colors.text,
  },
  metaSubtitle: {
    fontFamily: fonts.body.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  tierBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.full,
  },
  tierBadgeText: {
    fontFamily: fonts.body.semiBold,
    fontSize: 11,
    letterSpacing: 0.5,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(31, 77, 58, 0.04)",
    borderRadius: radii.input,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  scoreLabel: {
    fontFamily: fonts.body.medium,
    fontSize: 12,
    color: colors.textMuted,
  },
  scoreValue: {
    fontFamily: fonts.heading.bold,
    fontSize: 22,
    color: colors.primary,
    marginTop: 2,
  },
  scoreGuide: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
    marginLeft: spacing.lg,
  },
  scoreGuideText: {
    fontFamily: fonts.body.regular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.text,
    flex: 1,
  },
  factorsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  factorItem: {
    width: "48%",
    backgroundColor: colors.background,
    borderRadius: radii.input,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  factorLabel: {
    fontFamily: fonts.body.medium,
    fontSize: 11,
    color: colors.textMuted,
  },
  factorValue: {
    fontFamily: fonts.body.semiBold,
    fontSize: 14,
    color: colors.text,
    marginTop: 2,
  },
  unrankedNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(199, 149, 62, 0.12)",
    borderRadius: radii.input,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  unrankedText: {
    flex: 1,
    fontFamily: fonts.body.regular,
    fontSize: 13,
    lineHeight: 18,
    color: colors.text,
  },
  disclaimerText: {
    fontFamily: fonts.body.regular,
    fontSize: 11,
    lineHeight: 16,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});
