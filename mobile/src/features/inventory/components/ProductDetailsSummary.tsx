import React from "react";
import { Image, Text, View } from "react-native";
import { Clock, Package } from "lucide-react-native";
import { colors } from "../../../theme";
import { getProductStatus } from "../productStatus";
import { hasActiveBoost } from "../../marketing/types";
import type { Product } from "../types";
import { styles } from "./ProductDetailsStyles";

/** Photo, name, price and amount for one listing, grouped in two cards (Gestalt common region, Wertheimer et al.). */
export function ProductDetailsSummary({ product }: { product: Product }) {
  const qty = parseFloat(product.productQty as string) || 0;
  const originalQty = product.originalQty != null ? parseFloat(product.originalQty as string) : qty;
  const price = parseFloat(product.productPrice as string) || 0;
  const basePrice = product.basePrice != null ? parseFloat(product.basePrice as string) : null;
  const reduction = parseFloat(String(product.priceReductionAmount ?? "0")) || 0;
  const threshold = product.lowStockThreshold != null ? parseFloat(product.lowStockThreshold as string) : null;
  const status = getProductStatus(product);
  const unit = product.scalingType === "kilo" ? "kg" : product.scalingType;
  const imageUrl = product.displayImageUrl || product.imagUrl;
  const wasReduced = basePrice != null && basePrice > price;
  const total = Math.max(originalQty, qty);
  const percent = total > 0 ? Math.min(100, Math.max(0, (qty / total) * 100)) : 0;
  const stockColor = status.kind === "selling" ? colors.primary : status.color;
  const boosted = hasActiveBoost(product.boost);

  return (
    <>
      <View style={styles.photoCard}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.photo} />
        ) : (
          <>
            <Package size={44} color={colors.textMuted} />
            <Text style={styles.photoEmpty}>No photo yet</Text>
          </>
        )}
      </View>

      <View style={[styles.card, { marginTop: 16 }]}>
        <View style={styles.metaRow}>
          <Text style={styles.code}>PRD-{product.id.slice(0, 4).toUpperCase()}</Text>
          <Text style={styles.category}>{product.productType}</Text>
        </View>
        <Text style={styles.name}>{product.productName}</Text>
        <View style={styles.chips}>
          <View style={[styles.chip, { backgroundColor: status.background }]}>
            <View style={[styles.chipDot, { backgroundColor: status.color }]} />
            <Text style={[styles.chipText, { color: status.color }]}>{status.label}</Text>
          </View>
          {boosted ? (
            <View style={[styles.chip, { backgroundColor: "#FFF7ED", borderWidth: 1, borderColor: "#FFEDD5" }]}>
              <Text style={[styles.chipText, { color: colors.terracotta }]}>⚡ Boosted</Text>
            </View>
          ) : null}
          {!product.isMarketable && status.kind !== "archived" ? (
            <View style={[styles.chip, { backgroundColor: "#F3F4F6" }]}>
              <Text style={[styles.chipText, { color: colors.textMuted }]}>Reservations paused</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.price}>₱{price.toFixed(2)} <Text style={styles.priceUnit}>/ {unit}</Text></Text>
          {wasReduced ? <Text style={styles.oldPrice}>₱{basePrice!.toFixed(2)}</Text> : null}
          {wasReduced ? <Text style={styles.offChip}>-{Math.round((1 - price / basePrice!) * 100)}% Off</Text> : null}
        </View>

        {reduction > 0 ? (
          <View style={styles.dropBox}>
            <View style={styles.dropIcon}><Clock size={14} color={colors.primary} /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.dropTitle}>Drops ₱{reduction.toFixed(2)} every 6 hours after Boost</Text>
              {product.minimumPrice != null ? (
                <Text style={styles.dropSub}>Final price: ₱{Number(product.minimumPrice).toFixed(2)} / {unit}</Text>
              ) : null}
              {product.nextPriceReductionAt ? (
                <Text style={styles.dropSub}>Next drop: {new Date(product.nextPriceReductionAt).toLocaleString()}</Text>
              ) : null}
            </View>
          </View>
        ) : null}

        <View style={styles.stockBox}>
          <View style={styles.stockTop}>
            <View style={{ flexDirection: "row", alignItems: "baseline", gap: 8 }}>
              <Text style={[styles.stockValue, { color: stockColor }]}>{qty.toFixed(2)} {unit}</Text>
              <Text style={styles.stockLabel}>Available to buyers</Text>
            </View>
            <Text style={[styles.stockPill, { color: stockColor, backgroundColor: status.kind === "selling" ? "#DCFCE7" : status.background }]}>
              {Math.round(percent)}% left
            </Text>
          </View>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${percent}%`, backgroundColor: stockColor }]} />
          </View>
          <View style={styles.stockMeta}>
            <Text style={styles.stockMetaText}>Started with: <Text style={styles.stockMetaStrong}>{total.toFixed(1)} {unit}</Text></Text>
            {threshold != null ? <Text style={styles.stockMetaText}>Low stock alert at: <Text style={styles.stockMetaStrong}>{threshold} {unit}</Text></Text> : null}
          </View>
        </View>
      </View>
    </>
  );
}
