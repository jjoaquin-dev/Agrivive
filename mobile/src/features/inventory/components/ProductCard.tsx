import React, { useState } from "react";
import { View, Text, Image, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Package, ChevronDown, ChevronUp, TrendingDown, Pencil, Megaphone } from "lucide-react-native";
import { colors } from "../../../theme";
import { ButtonComponent } from "../../../components/ButtonComponent";
import type { Product } from "../types";
import { getProductStatus } from "../productStatus";
import { BoostChip } from "../../marketing/components/BoostChip";
import { hasActiveBoost } from "../../marketing/types";
import { styles } from "./ProductCardStyles";

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onEdit?: () => void;
}

const ProductCardComponent: React.FC<ProductCardProps> = ({ product, onPress, onEdit }) => {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  const qty = parseFloat(product.productQty as string) || 0;
  const originalQty = product.originalQty != null ? parseFloat(product.originalQty as string) : qty;
  const price = parseFloat(product.productPrice as string) || 0;
  const basePrice = product.basePrice != null ? parseFloat(product.basePrice as string) : null;
  const reductionAmount = parseFloat(String(product.priceReductionAmount ?? "0")) || 0;
  const threshold = product.lowStockThreshold != null ? parseFloat(product.lowStockThreshold as string) : null;

  const status = getProductStatus(product);
  const isArchived = status.kind === "archived";
  const unitLabel = product.scalingType === "kilo" ? "kg" : product.scalingType;
  const imageUrl = product.displayImageUrl || product.imagUrl;
  const productCode = `PRD-${product.id.slice(0, 4).toUpperCase()}`;
  const wasReduced = basePrice != null && basePrice > price;

  const totalQty = Math.max(originalQty, qty);
  const soldQty = Math.max(0, totalQty - qty);
  const availablePercent = totalQty > 0 ? Math.min(100, Math.max(0, (qty / totalQty) * 100)) : 0;

  return (
    <View style={[styles.card, isArchived && styles.cardArchived]}>
      <Pressable onPress={onPress} style={styles.topRow} accessibilityRole="button" accessibilityLabel={`Open ${product.productName}`}>
        <View style={styles.thumbnail}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.thumbnailImage} />
          ) : (
            <Package size={26} color={colors.primary} />
          )}
        </View>

        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>{product.productName}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: status.background, alignSelf: "flex-start", marginTop: 2 }]}>
            <Text style={[styles.badgeText, { color: status.color }]}>{status.label}</Text>
          </View>
          <Text style={styles.meta} numberOfLines={1}>{productCode} · {product.productType}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>₱{price.toFixed(2)} <Text style={styles.priceUnit}>/ {unitLabel}</Text></Text>
            {wasReduced ? <Text style={styles.oldPrice}>₱{basePrice!.toFixed(2)}</Text> : null}
          </View>
          {reductionAmount > 0 ? (
            <View style={styles.dropChip}>
              <TrendingDown size={12} color={colors.text} />
              <Text style={styles.dropChipText}>Drops ₱{reductionAmount.toFixed(2)} every 6 hrs after Boost</Text>
            </View>
          ) : null}
          <BoostChip boost={product.boost} />
        </View>
      </Pressable>

      <Pressable
        onPress={() => setExpanded((prev) => !prev)}
        accessibilityRole="button"
        accessibilityLabel={expanded ? "Hide details" : "Show details"}
        style={styles.expandButton}
      >
        {expanded ? <ChevronUp size={20} color={colors.textMuted} /> : <ChevronDown size={20} color={colors.textMuted} />}
      </Pressable>

      <View style={styles.stockSection}>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${availablePercent}%`, backgroundColor: status.kind === "selling" ? colors.success : status.color }]} />
        </View>
        <View style={styles.stockRow}>
          <Text style={[styles.stockAvailable, { color: status.kind === "archived" ? colors.textMuted : status.color }]}>
            {qty.toFixed(1)} {unitLabel} available
          </Text>
          <Text style={styles.stockSold}>{soldQty.toFixed(1)} {unitLabel} sold / taken away</Text>
        </View>
      </View>

      {expanded ? (
        <View style={styles.expanded}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Category</Text>
            <Text style={styles.detailValue}>{product.productType}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Selling unit</Text>
            <Text style={styles.detailValue}>{unitLabel.toUpperCase()}</Text>
          </View>
          {threshold != null ? (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Low stock alert at</Text>
              <Text style={styles.detailValue}>{threshold} {unitLabel}</Text>
            </View>
          ) : null}
          {reductionAmount > 0 && product.nextPriceReductionAt ? (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Next price drop</Text>
              <Text style={[styles.detailValue, { color: colors.primary }]}>
                {new Date(product.nextPriceReductionAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </Text>
            </View>
          ) : null}
          <View style={styles.actionRow}>
            {!isArchived && status.kind !== "soldOut" ? (
              <ButtonComponent
                title={hasActiveBoost(product.boost) ? "View Boost" : "Boost"}
                variant="secondary"
                onPress={() => router.push({ pathname: "/(app)/marketing/[productId]", params: { productId: product.id } })}
                icon={<Megaphone size={16} color={colors.primary} />}
                style={styles.actionButton}
                textStyle={styles.actionText}
              />
            ) : null}
            <ButtonComponent
              title="Edit Listing"
              onPress={onEdit || onPress}
              icon={<Pencil size={16} color={colors.white} />}
              style={styles.actionButton}
              textStyle={styles.actionText}
            />
          </View>
        </View>
      ) : null}
    </View>
  );
};

export const ProductCard = React.memo(ProductCardComponent);
