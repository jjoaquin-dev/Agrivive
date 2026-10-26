import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AlertTriangle, Award, Info, Sparkles, TrendingUp } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import type { SellerVisibilityItem } from "../api/seller-visibility";
import type { Product } from "../../inventory/types";
import { VisibilityFactorsGrid } from "./VisibilityFactorsGrid";

interface VisibilityBreakdownCardProps {
  item: SellerVisibilityItem;
  productName?: string;
  product?: Product;
  onBoost: () => void;
}

export function VisibilityBreakdownCard({ item, productName, product, onBoost }: VisibilityBreakdownCardProps) {
  const isPriority = item.tier?.toLowerCase().includes("priority");
  const isStandard = item.tier?.toLowerCase().includes("standard");
  const isDiscounted = Boolean(
    product?.basePrice != null && Number(product.basePrice) > Number(product.productPrice)
  );

  const tierColor = isPriority ? colors.primary : isStandard ? colors.success : colors.textMuted;
  const tierBg = isPriority ? colors.primaryLight : isStandard ? "rgba(63, 125, 88, 0.12)" : "rgba(100, 116, 139, 0.12)";

  return (
    <View style={[styles.card, isDiscounted && styles.cardDiscounted]}>
      {isDiscounted && (
        <View style={styles.discountBanner}>
          <AlertTriangle size={13} color={colors.warning} />
          <Text style={styles.discountBannerText}>12-Hour Price Drop Active • Discounted Surplus</Text>
        </View>
      )}

      <View style={styles.headerRow}>
        <View style={styles.titleColumn}>
          <Text style={styles.productName} numberOfLines={1}>
            {productName || `Product #${item.productId.slice(0, 8)}`}
          </Text>
          <View style={styles.subRow}>
            <Text style={styles.metaSubtitle}>Marketplace Visibility Guide</Text>
            {isDiscounted && product && (
              <View style={styles.pricePill}>
                <Text style={styles.oldPrice}>₱{Number(product.basePrice).toFixed(0)}</Text>
                <Text style={styles.newPrice}>₱{Number(product.productPrice).toFixed(0)}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={[styles.tierBadge, { backgroundColor: tierBg }]}>
          {isPriority ? <Sparkles size={12} color={tierColor} /> : <Award size={12} color={tierColor} />}
          <Text style={[styles.tierBadgeText, { color: tierColor }]}>
            {item.tier ? `${item.tier.toUpperCase()} TIER` : "UNRANKED"}
          </Text>
        </View>
      </View>

      {item.score !== null ? (
        <>
          <View style={styles.scoreRow}>
            <View>
              <Text style={styles.scoreLabel}>Placement Score</Text>
              <Text style={styles.scoreValue}>{item.score.toFixed(4)}</Text>
            </View>
            <View style={styles.scoreGuide}>
              <TrendingUp size={16} color={colors.primary} />
              <Text style={styles.scoreGuideText}>
                {isPriority ? "Featured near top of buyer browse" : isStandard ? "Balanced marketplace search ranking" : "Standard catalog position"}
              </Text>
            </View>
          </View>
          <VisibilityFactorsGrid item={item} />
        </>
      ) : (
        <View style={styles.unrankedNotice}>
          <Info size={16} color={colors.warning} />
          <Text style={styles.unrankedText}>
            {item.reason || "Ensure stock is positive and listing is active to receive visibility ranking."}
          </Text>
        </View>
      )}

      <Text style={styles.disclaimerText}>
        Visibility is calculated from Freshness (40%), Available Stock (30%), Seller Reliability (20%), and Surplus Recurrence (10%).
      </Text>
      <Pressable onPress={onBoost} accessibilityRole="button" style={[styles.boostButton, isDiscounted && styles.boostButtonDiscounted]}>
        <Sparkles size={17} color={colors.white} />
        <Text style={styles.boostButtonText}>{isDiscounted ? "Boost Discounted Deal" : "Boost Visibility"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border, padding: spacing.base, marginBottom: spacing.md },
  cardDiscounted: { borderColor: colors.warning, borderWidth: 1.5, backgroundColor: "#FFFDF9" },
  discountBanner: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "rgba(217, 119, 6, 0.1)", paddingHorizontal: 10, paddingVertical: 5, borderRadius: radii.sm, marginBottom: spacing.sm },
  discountBannerText: { fontFamily: fonts.body.semiBold, fontSize: 11, color: colors.warning },
  headerRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: spacing.sm, marginBottom: spacing.md },
  titleColumn: { flex: 1 },
  productName: { fontFamily: fonts.heading.bold, fontSize: 16, color: colors.text },
  subRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 2, flexWrap: "wrap" },
  metaSubtitle: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted },
  pricePill: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "rgba(217, 119, 6, 0.12)", paddingHorizontal: 6, paddingVertical: 1, borderRadius: radii.full },
  oldPrice: { fontFamily: fonts.body.regular, fontSize: 11, color: colors.textMuted, textDecorationLine: "line-through" },
  newPrice: { fontFamily: fonts.body.semiBold, fontSize: 11, color: colors.warning },
  tierBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: radii.full },
  tierBadgeText: { fontFamily: fonts.body.semiBold, fontSize: 11, letterSpacing: 0.5 },
  scoreRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: colors.primarySurface, borderRadius: radii.input, padding: spacing.md, marginBottom: spacing.md },
  scoreLabel: { fontFamily: fonts.body.medium, fontSize: 12, color: colors.textMuted },
  scoreValue: { fontFamily: fonts.heading.bold, fontSize: 22, color: colors.primary, marginTop: 2 },
  scoreGuide: { flexDirection: "row", alignItems: "center", gap: 6, flex: 1, marginLeft: spacing.lg },
  scoreGuideText: { fontFamily: fonts.body.regular, fontSize: 12, lineHeight: 16, color: colors.text, flex: 1 },
  unrankedNotice: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "rgba(199, 149, 62, 0.12)", borderRadius: radii.input, padding: spacing.md, marginBottom: spacing.sm },
  unrankedText: { flex: 1, fontFamily: fonts.body.regular, fontSize: 13, lineHeight: 18, color: colors.text },
  disclaimerText: { fontFamily: fonts.body.regular, fontSize: 11, lineHeight: 16, color: colors.textMuted, marginTop: spacing.xs },
  boostButton: { minHeight: 48, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm, backgroundColor: colors.primary, borderRadius: radii.button, marginTop: spacing.md },
  boostButtonDiscounted: { backgroundColor: colors.warning },
  boostButtonText: { fontFamily: fonts.body.semiBold, fontSize: 14, color: colors.white },
});
