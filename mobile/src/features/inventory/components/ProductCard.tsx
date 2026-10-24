import React, { useState } from "react";
import { StyleSheet, View, Text, Image, Pressable } from "react-native";
import {
  Package,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  AlertTriangle,
  Edit3,
} from "lucide-react-native";
import { colors, fonts, spacing } from "../../../theme";
import type { Product } from "../types";

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onEdit?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onEdit,
}) => {
  const [expanded, setExpanded] = useState(false);

  const qty = parseFloat(product.productQty as string) || 0;
  const originalQty =
    product.originalQty != null ? parseFloat(product.originalQty as string) : qty;
  const price = parseFloat(product.productPrice as string) || 0;
  const basePrice =
    product.basePrice != null ? parseFloat(product.basePrice as string) : null;
  const reductionPercent =
    parseFloat(String(product.priceReductionPercent ?? "0")) || 0;
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
          <Text style={styles.nameText} numberOfLines={1}>
            {product.productName}
          </Text>
          <Text style={styles.codeText}>{productCode}</Text>

          {/* Badges Row */}
          <View style={styles.badgeRow}>
            {isArchived ? (
              <View style={[styles.badge, styles.badgeArchived]}>
                <Text style={[styles.badgeText, styles.badgeTextArchived]}>
                  Archived
                </Text>
              </View>
            ) : isOutOfStock ? (
              <View style={[styles.badge, styles.badgeOutOfStock]}>
                <AlertCircle size={11} color="#DC2626" style={styles.badgeIcon} />
                <Text style={[styles.badgeText, styles.badgeTextOutOfStock]}>
                  Sold Out
                </Text>
              </View>
            ) : isLowStock ? (
              <View style={[styles.badge, styles.badgeLowStock]}>
                <AlertTriangle size={11} color="#D97706" style={styles.badgeIcon} />
                <Text style={[styles.badgeText, styles.badgeTextLowStock]}>
                  Low Stock
                </Text>
              </View>
            ) : (
              <View style={[styles.badge, styles.badgeActive]}>
                <Text style={[styles.badgeText, styles.badgeTextActive]}>Active</Text>
              </View>
            )}

            {reductionPercent > 0 ? (
              <View style={[styles.badge, styles.badgeBoost]}>
                <Text style={[styles.badgeText, styles.badgeTextBoost]}>
                  {reductionPercent}% Discount
                </Text>
              </View>
            ) : null}
          </View>

          {/* Price */}
          <View style={styles.priceRow}>
            <Text style={styles.priceSymbol}>₱</Text>
            <Text style={styles.priceValue}>{price.toFixed(0)}</Text>
            <Text style={styles.priceUnit}>/{unitLabel}</Text>
            {basePrice != null && basePrice > price ? (
              <Text style={styles.originalPrice}>₱{basePrice.toFixed(0)}</Text>
            ) : null}
          </View>
        </View>
      </Pressable>

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
          {reductionPercent > 0 && product.nextPriceReductionAt ? (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Next Reduction</Text>
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
        <Pressable
          onPress={() => setExpanded((prev) => !prev)}
          style={styles.detailsButton}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel={expanded ? "Show less details" : "Show more details"}
        >
          <Text style={styles.detailsButtonText}>{expanded ? "Less" : "Details"}</Text>
          {expanded ? (
            <ChevronUp size={16} color="#374151" />
          ) : (
            <ChevronDown size={16} color="#374151" />
          )}
        </Pressable>

        <Pressable
          onPress={onEdit || onPress}
          style={styles.editButton}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel={`Edit ${product.productName}`}
        >
          <Edit3 size={15} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.editButtonText}>Edit Listing</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: spacing.base,
    marginBottom: spacing.base,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardArchived: {
    opacity: 0.65,
    backgroundColor: "#F9FAFB",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  imageContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    overflow: "hidden",
    marginRight: spacing.md,
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
    resizeMode: "cover",
  },
  placeholderThumbnail: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
    backgroundColor: "#ECFDF5",
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    fontFamily: fonts.heading.bold,
  },
  codeText: {
    fontSize: 12,
    color: "#6B7280",
    fontFamily: fonts.body.regular,
    marginTop: 1,
    marginBottom: 6,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 6,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
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
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
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
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 2,
  },
  priceSymbol: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F920F",
  },
  priceValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F920F",
  },
  priceUnit: {
    fontSize: 13,
    color: "#6B7280",
    marginLeft: 2,
  },
  originalPrice: {
    fontSize: 13,
    color: "#9CA3AF",
    textDecorationLine: "line-through",
    marginLeft: 8,
  },
  stockSection: {
    marginTop: spacing.md,
    paddingTop: spacing.xs,
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
    flexDirection: "row",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#0F920F",
    borderRadius: 3,
  },
  stockMetricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  stockMetricCol: {
    alignItems: "flex-start",
  },
  stockMetricColRight: {
    alignItems: "flex-end",
  },
  stockMetricValueGreen: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F920F",
  },
  stockMetricValueDark: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  stockMetricLabel: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 1,
  },
  expandedContent: {
    marginTop: spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: spacing.sm,
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
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: spacing.md,
  },
  detailsButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    gap: 4,
  },
  detailsButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  editButton: {
    flex: 1.4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 42,
    borderRadius: 12,
    backgroundColor: "#0F920F",
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
