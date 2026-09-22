import React from "react";
import { StyleSheet, View, Text, Image, Pressable } from "react-native";
import { ChevronRight, Package, AlertTriangle, AlertCircle } from "lucide-react-native";
import { colors, fonts, radii, spacing, touchTargets } from "../../../theme";
import type { Product } from "../types";

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const qty = parseFloat(product.productQty as string) || 0;
  const price = parseFloat(product.productPrice as string) || 0;
  const threshold =
    product.lowStockThreshold != null
      ? parseFloat(product.lowStockThreshold as string)
      : null;

  const isOutOfStock = qty <= 0;
  const isLowStock = !isOutOfStock && threshold != null && qty <= threshold;
  const isArchived = !product.isActive;

  const unitLabel = product.scalingType === "kilo" ? "kg" : product.scalingType;
  const imageUrl = product.displayImageUrl || product.imagUrl;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${product.productName}, ${qty.toFixed(2)} ${unitLabel} available, ₱${price.toFixed(2)} per ${unitLabel}`}
      style={({ pressed }) => [
        styles.card,
        isArchived && styles.cardArchived,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.thumbnail} />
        ) : (
          <View style={styles.placeholderThumbnail}>
            <Package size={24} color={colors.textMuted} />
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.nameText} numberOfLines={1}>
            {product.productName}
          </Text>
          <ChevronRight size={18} color={colors.textMuted} />
        </View>

        <Text style={styles.categoryText}>{product.productType}</Text>

        <View style={styles.detailsRow}>
          <Text style={styles.qtyText}>
            <Text style={styles.qtyValue}>{qty.toFixed(2)}</Text> {unitLabel}
          </Text>
          <Text style={styles.dotSeparator}>•</Text>
          <Text style={styles.priceText}>
            ₱{price.toFixed(2)} / {unitLabel}
          </Text>
        </View>

        {isArchived ? (
          <View style={[styles.badge, styles.badgeArchived]}>
            <Text style={[styles.badgeText, styles.badgeTextArchived]}>Archived</Text>
          </View>
        ) : isOutOfStock ? (
          <View style={[styles.badge, styles.badgeOutOfStock]}>
            <AlertCircle size={12} color={colors.error} style={styles.badgeIcon} />
            <Text style={[styles.badgeText, styles.badgeTextOutOfStock]}>Out of Stock</Text>
          </View>
        ) : isLowStock ? (
          <View style={[styles.badge, styles.badgeLowStock]}>
            <AlertTriangle size={12} color={colors.warning} style={styles.badgeIcon} />
            <Text style={[styles.badgeText, styles.badgeTextLowStock]}>Low Stock</Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
    marginBottom: spacing.md,
    alignItems: "center",
    minHeight: touchTargets.min,
  },
  cardArchived: {
    opacity: 0.7,
    backgroundColor: "#F2EFEB",
  },
  cardPressed: {
    backgroundColor: "#F0EEE9",
  },
  imageContainer: {
    width: 64,
    height: 64,
    borderRadius: radii.sm,
    overflow: "hidden",
    marginRight: spacing.base,
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    borderRadius: radii.sm,
  },
  placeholderThumbnail: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.background,
    borderRadius: radii.sm,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  nameText: {
    fontFamily: fonts.heading.bold,
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  categoryText: {
    fontFamily: fonts.body.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.xs,
  },
  qtyText: {
    fontFamily: fonts.body.medium,
    fontSize: 13,
    color: colors.text,
  },
  qtyValue: {
    fontFamily: fonts.heading.bold,
    color: colors.primary,
  },
  dotSeparator: {
    marginHorizontal: spacing.xs,
    color: colors.textMuted,
  },
  priceText: {
    fontFamily: fonts.body.medium,
    fontSize: 13,
    color: colors.textMuted,
  },
  badge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.full,
    marginTop: spacing.xs,
  },
  badgeIcon: {
    marginRight: 4,
  },
  badgeLowStock: {
    backgroundColor: "rgba(199, 149, 62, 0.15)",
    borderWidth: 1,
    borderColor: colors.warning,
  },
  badgeOutOfStock: {
    backgroundColor: "rgba(184, 84, 80, 0.12)",
    borderWidth: 1,
    borderColor: colors.error,
  },
  badgeArchived: {
    backgroundColor: "#E2DFD8",
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeText: {
    fontFamily: fonts.body.semiBold,
    fontSize: 11,
  },
  badgeTextLowStock: {
    color: colors.warning,
  },
  badgeTextOutOfStock: {
    color: colors.error,
  },
  badgeTextArchived: {
    color: colors.textMuted,
  },
});
