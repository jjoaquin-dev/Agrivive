import React, { useState } from "react";
import { StyleSheet, View, Text, Image, Pressable } from "react-native";
import { useRouter } from "expo-router";
import {
  Package,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  AlertTriangle,
  Edit3,
  Zap,
} from "lucide-react-native";
import { colors, fonts, radii, shadows, spacing, typography } from "../../../theme";
import { ButtonComponent } from "../../../components/ButtonComponent";
import type { Product } from "../types";
import { BoostChip } from "../../marketing/components/BoostChip";
import { hasActiveBoost } from "../../marketing/types";

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onEdit?: () => void;
}

const ProductCardComponent: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onEdit,
}) => {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  const qty = parseFloat(product.productQty as string) || 0;
  const originalQty =
    product.originalQty != null ? parseFloat(product.originalQty as string) : qty;
  const price = parseFloat(product.productPrice as string) || 0;
  const basePrice =
    product.basePrice != null ? parseFloat(product.basePrice as string) : null;
  const reductionAmount =
    parseFloat(String(product.priceReductionAmount ?? "0")) || 0;
  const threshold =
    product.lowStockThreshold != null
      ? parseFloat(product.lowStockThreshold as string)
      : null;

  const isOutOfStock = qty <= 0;
  const isLowStock = !isOutOfStock && threshold != null && qty <= threshold;
  const isArchived = !product.isActive;

  const unitLabel = product.scalingType === "kilo" ? "kg" : product.scalingType;
  const imageUrl = product.displayImageUrl || product.imagUrl;
  const productCode = `PRD-${product.id.slice(0, 4).toUpperCase()}`;

  // Stock calculation for progress bar
  const totalQty = Math.max(originalQty, qty);
  const soldQty = Math.max(0, totalQty - qty);
  const availablePercent =
    totalQty > 0 ? Math.min(100, Math.max(0, (qty / totalQty) * 100)) : 0;

  return (
    <View style={[styles.card, isArchived && styles.cardArchived]}>
      {/* Top Header Row */}
      <Pressable onPress={onPress} style={styles.topRow}>
        <View style={styles.imageContainer}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.thumbnail} />
          ) : (
            <View style={styles.placeholderThumbnail}>
              <Package size={26} color="#059669" />
            </View>
          )}
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.nameRow}>
            <Text style={styles.nameText} numberOfLines={1}>{product.productName}</Text>
            {isArchived ? (
              <View style={[styles.badge, styles.badgeArchived]}>
                <Text style={[styles.badgeText, styles.badgeTextArchived]}>Archived</Text>
              </View>
            ) : isOutOfStock ? (
              <View style={[styles.badge, styles.badgeOutOfStock]}>
                <AlertCircle size={11} color="#DC2626" style={styles.badgeIcon} />
                <Text style={[styles.badgeText, styles.badgeTextOutOfStock]}>Sold Out</Text>
              </View>
            ) : isLowStock ? (
              <View style={[styles.badge, styles.badgeLowStock]}>
                <AlertTriangle size={11} color="#D97706" style={styles.badgeIcon} />
                <Text style={[styles.badgeText, styles.badgeTextLowStock]}>Low Stock</Text>
              </View>
            ) : (
              <View style={[styles.badge, styles.badgeActive]}>
                <Text style={[styles.badgeText, styles.badgeTextActive]}>Active</Text>
              </View>
            )}
          </View>
          <Text style={styles.codeText}>{productCode}</Text>

          <View style={styles.priceBadgeRow}>
            <View style={styles.priceRow}>
              <Text style={styles.priceSymbol}>₱</Text>
              <Text style={styles.priceValue}>{price.toFixed(0)}</Text>
              <Text style={styles.priceUnit}>/{unitLabel}</Text>
              {basePrice != null && basePrice > price ? (
                <Text style={styles.originalPrice}>₱{basePrice.toFixed(0)}</Text>
              ) : null}
            </View>
            {reductionAmount > 0 ? (
              <View style={[styles.badge, styles.badgeBoost]}>
                <Text style={[styles.badgeText, styles.badgeTextBoost]}>
                  {basePrice != null && basePrice > price
                    ? `${Math.round((1 - price / basePrice) * 100)}% Off`
                    : `Drops ₱${reductionAmount.toFixed(2)} every 6 hrs after Boost`}
                </Text>
              </View>
            ) : null}
          </View>

          <BoostChip boost={product.boost} />
        </View>
      </Pressable>

      <View style={styles.divider} />

      {/* Stock Progress Bar */}
      <View style={styles.stockSection}>
        <View style={styles.progressBarTrack}>
          <View
            style={[styles.progressBarFill, { width: `${availablePercent}%` }]}
          />
        </View>

        <View style={styles.stockMetricsRow}>
          <View style={styles.stockMetricCol}>
            <Text style={styles.stockMetricValueGreen}>
              {qty.toFixed(1)} {unitLabel}
            </Text>
            <Text style={styles.stockMetricLabel}>Available</Text>
          </View>

          <View style={[styles.stockMetricCol, styles.stockMetricColRight]}>
            <Text style={styles.stockMetricValueDark}>
              {soldQty.toFixed(1)} {unitLabel}
            </Text>
            <Text style={styles.stockMetricLabel}>Sold / Deducted</Text>
          </View>
        </View>
      </View>

      {/* Expandable Details Section */}
      {expanded ? (
        <View style={styles.expandedContent}>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Category</Text>
            <Text style={styles.detailValue}>{product.productType}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Selling Unit</Text>
            <Text style={styles.detailValue}>{unitLabel.toUpperCase()}</Text>
          </View>
          {threshold != null ? (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Low Stock Alert At</Text>
              <Text style={styles.detailValue}>
                {threshold} {unitLabel}
              </Text>
            </View>
          ) : null}
          {reductionAmount > 0 && product.nextPriceReductionAt ? (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Next Price Drop</Text>
              <Text style={styles.detailValueSchedule}>
                {new Date(product.nextPriceReductionAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          ) : null}
        </View>
      ) : null}

      {/* Action Buttons Row */}
      <View style={styles.actionRow}>
        <ButtonComponent
          title={expanded ? "Less" : "Details"}
          variant="secondary"
          onPress={() => setExpanded((prev) => !prev)}
          icon={expanded ? <ChevronUp size={16} color={colors.text} /> : <ChevronDown size={16} color={colors.text} />}
          style={[styles.actionButton, styles.detailsButton]}
          textStyle={[styles.actionText, styles.detailsText]}
        />

        {!isArchived && !isOutOfStock ? (
          <ButtonComponent
            title={hasActiveBoost(product.boost) ? "View Boost" : "Boost"}
            variant="secondary"
            onPress={() => router.push({ pathname: "/(app)/marketing/[productId]", params: { productId: product.id } })}
            icon={<Zap size={16} color={colors.primary} />}
            style={[styles.actionButton, styles.boostButton]}
            textStyle={styles.actionText}
          />
        ) : null}

        <ButtonComponent
          title="Edit Listing"
          onPress={onEdit || onPress}
          icon={<Edit3 size={16} color={colors.white} />}
          style={[styles.actionButton, styles.editButton]}
          textStyle={styles.actionText}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border, padding: spacing.base, marginBottom: spacing.base, ...shadows.card, },
  cardArchived: {
    opacity: 0.65,
    backgroundColor: "#F9FAFB",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  imageContainer: { width: 88, height: 88, borderRadius: radii.input + 2, overflow: "hidden", marginRight: spacing.md, },
  thumbnail: { width: "100%", height: "100%", borderRadius: radii.input + 2, resizeMode: "cover" },
  placeholderThumbnail: { width: "100%", height: "100%", borderRadius: radii.input + 2, backgroundColor: colors.primarySurface, justifyContent: "center", alignItems: "center" },
  infoContainer: { flex: 1 },
  nameRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.sm },
  nameText: { ...typography.sectionHeading, flex: 1, color: colors.text },
  codeText: { ...typography.labelSmall, color: colors.textMuted, },
  priceBadgeRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", columnGap: spacing.sm, rowGap: spacing.xs, marginTop: spacing.xs, },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 6,
  },
  badge: { flexDirection: "row", alignItems: "center", paddingHorizontal: spacing.sm + 2, paddingVertical: spacing.xs, borderRadius: radii.full, },
  badgeIcon: {
    marginRight: 4,
  },
  badgeActive: {
    backgroundColor: "#D1FAE5",
  },
  badgeLowStock: {
    backgroundColor: "#FEF3C7",
  },
  badgeOutOfStock: {
    backgroundColor: "#FEE2E2",
  },
  badgeArchived: {
    backgroundColor: "#F3F4F6",
  },
  badgeBoost: {
    backgroundColor: "#FEF3C7",
  },
  badgeText: { fontFamily: fonts.body.medium, fontSize: 12, },
  badgeTextActive: {
    color: "#065F46",
  },
  badgeTextLowStock: {
    color: "#92400E",
  },
  badgeTextOutOfStock: {
    color: "#991B1B",
  },
  badgeTextArchived: {
    color: "#4B5563",
  },
  badgeTextBoost: {
    color: "#92400E",
  },
  priceRow: { flexDirection: "row", alignItems: "baseline", },
  priceSymbol: { fontFamily: fonts.heading.bold, fontSize: 14, color: colors.primary, },
  priceValue: { fontFamily: fonts.heading.bold, fontSize: 18, color: colors.primary, },
  priceUnit: { ...typography.label, color: colors.textMuted, marginLeft: 2, },
  originalPrice: { ...typography.label, color: colors.textMuted, textDecorationLine: "line-through", marginLeft: spacing.sm, },
  stockSection: {
    marginTop: spacing.md,
    paddingTop: spacing.xs,
  },
  progressBarTrack: { height: 6, borderRadius: 3, backgroundColor: colors.border, overflow: "hidden", flexDirection: "row", },
  progressBarFill: { height: "100%", backgroundColor: colors.primary, borderRadius: 3, },
  stockMetricsRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: spacing.sm, },
  stockMetricCol: {
    alignItems: "flex-start",
  },
  stockMetricColRight: {
    alignItems: "flex-end",
  },
  stockMetricValueGreen: { fontFamily: fonts.body.semiBold, fontSize: 14, color: colors.primary, },
  stockMetricValueDark: { fontFamily: fonts.body.semiBold, fontSize: 14, color: colors.text, },
  stockMetricLabel: { ...typography.labelSmall, color: colors.textMuted, marginTop: 1, },
  expandedContent: {
    marginTop: spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 3,
  },
  detailLabel: {
    fontSize: 13,
    color: "#6B7280",
    fontFamily: fonts.body.regular,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },
  detailValueSchedule: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0F920F",
  },
  actionRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: spacing.base, },
  actionButton: { paddingHorizontal: spacing.sm, paddingVertical: spacing.sm },
  actionText: { fontSize: 13 },
  detailsText: { color: colors.text },
  detailsButton: { flex: 1 },
  boostButton: { flex: 1.3, },
  editButton: { flex: 1.4, },
});

export const ProductCard = React.memo(ProductCardComponent);
