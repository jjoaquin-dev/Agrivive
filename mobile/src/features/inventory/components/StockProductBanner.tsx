import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Package } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import { getProductStatus } from "../productStatus";
import type { Product } from "../types";

export function StockProductBanner({ product }: { product: Product }) {
  const status = getProductStatus(product);
  const qty = parseFloat(product.productQty as string) || 0;
  const unit = product.scalingType === "kilo" ? "kg" : product.scalingType;
  const imageUrl = product.displayImageUrl || product.imagUrl;
  return (
    <View style={styles.banner}>
      <View style={styles.photo}>
        {imageUrl ? <Image source={{ uri: imageUrl }} style={styles.image} /> : <Package size={22} color={colors.primary} />}
      </View>
      <View style={styles.body}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>{product.productName}</Text>
          <View style={[styles.badge, { backgroundColor: status.background }]}>
            <Text style={[styles.badgeText, { color: status.color }]}>{status.label}</Text>
          </View>
        </View>
        <Text style={styles.sub}>Current: <Text style={styles.subStrong}>{qty.toFixed(2)} {unit}</Text> available</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { flexDirection: "row", alignItems: "center", gap: spacing.md, backgroundColor: colors.surfaceMuted, borderWidth: 1, borderColor: colors.border, borderRadius: radii.card - 4, padding: 10, marginHorizontal: spacing.base, marginTop: spacing.sm, marginBottom: spacing.base },
  photo: { width: 44, height: 44, borderRadius: 8, overflow: "hidden", backgroundColor: colors.primarySurface, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border },
  image: { width: "100%", height: "100%" },
  body: { flex: 1, minWidth: 0 },
  nameRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.sm },
  name: { flexShrink: 1, fontFamily: fonts.body.semiBold, fontSize: 15, color: colors.text },
  badge: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radii.full },
  badgeText: { fontFamily: fonts.body.semiBold, fontSize: 11 },
  sub: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted, marginTop: 2 },
  subStrong: { fontFamily: fonts.body.medium, color: "#374151" },
});
