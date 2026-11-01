import React, { useMemo, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Package } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import { cardStyles } from "../analyticsCard";
import type { Product } from "../../inventory/types";

type Filter = "all" | "low" | "out";

const FILTERS: { id: Filter; label: (count: number) => string }[] = [
  { id: "all", label: (n) => `All (${n})` },
  { id: "low", label: () => "10 or Less" },
  { id: "out", label: () => "Sold Out" },
];

export function AnalyticsProductPerformance({ products }: { products: Product[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");

  const shown = useMemo(() => products.filter((p) => {
    const qty = Number(p.productQty) || 0;
    return filter === "out" ? qty <= 0 : filter === "low" ? qty > 0 && qty <= 10 : true;
  }), [products, filter]);

  return (
    <View style={cardStyles.card}>
      <Text style={cardStyles.title}>Your Produce</Text>
      <Text style={cardStyles.subtitle}>All produce, today</Text>

      <View style={styles.filters}>
        {FILTERS.map((f) => {
          const active = filter === f.id;
          return (
            <Pressable key={f.id} onPress={() => setFilter(f.id)} accessibilityRole="button" accessibilityState={{ selected: active }} style={[styles.filter, active && styles.filterActive]}>
              <Text style={[styles.filterText, active && styles.filterTextActive]}>{f.label(products.length)}</Text>
            </Pressable>
          );
        })}
      </View>

      {shown.length === 0 ? (
        <Text style={styles.empty}>No produce matches this filter.</Text>
      ) : (
        shown.slice(0, 5).map((p, index) => {
          const qty = Number(p.productQty) || 0;
          const out = qty <= 0;
          const low = !out && qty <= 10;
          const unit = p.scalingType === "kilo" ? "kg" : p.scalingType;
          const dropped = p.basePrice != null && Number(p.basePrice) > Number(p.productPrice);
          const tone = out ? { fg: colors.error, bg: "#FEF2F2", label: "Sold Out" } : low ? { fg: colors.warning, bg: "#FFF7ED", label: "10 or Less" } : { fg: colors.primary, bg: "#F0FDF4", label: "In Stock" };
          const imageUrl = p.displayImageUrl || p.imagUrl;
          return (
            <View key={p.id} style={[styles.item, index > 0 && styles.itemDivider]}>
              <View style={styles.photo}>
                {imageUrl ? <Image source={{ uri: imageUrl }} style={styles.photoImage} /> : <Package size={20} color={colors.primary} />}
              </View>
              <View style={styles.body}>
                <View style={styles.nameRow}>
                  <Text style={styles.name} numberOfLines={1}>{p.productName}</Text>
                  {dropped ? <Text style={styles.dropBadge}>Price Drop</Text> : null}
                </View>
                <View style={styles.meta}>
                  <Text style={[styles.metaText, out && { color: colors.error }]}>{qty} {unit} left</Text>
                  <Text style={styles.metaText}>•</Text>
                  <Text style={styles.price}>₱{p.productPrice}/{unit}</Text>
                  {dropped ? <Text style={styles.oldPrice}>₱{p.basePrice}</Text> : null}
                </View>
              </View>
              <View style={styles.end}>
                <Text style={[styles.status, { color: tone.fg, backgroundColor: tone.bg }]}>{tone.label}</Text>
                {dropped && !out ? (
                  <Pressable onPress={() => router.push({ pathname: "/(app)/marketing/[productId]", params: { productId: p.id } })} accessibilityRole="button" accessibilityLabel={`Boost ${p.productName}`} style={styles.boost}>
                    <Text style={styles.boostText}>Boost</Text>
                  </Pressable>
                ) : null}
              </View>
            </View>
          );
        })
      )}

      <Pressable onPress={() => router.push("/(app)/(tabs)/inventory")} accessibilityRole="button" style={styles.link}>
        <Text style={styles.linkText}>See All in Listings ›</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  filters: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.md, marginBottom: spacing.sm },
  filter: { minHeight: 36, paddingHorizontal: spacing.md, justifyContent: "center", borderRadius: radii.full, backgroundColor: "#F3F4F6" },
  filterActive: { backgroundColor: colors.text },
  filterText: { fontFamily: fonts.body.medium, fontSize: 12, color: colors.textMuted },
  filterTextActive: { color: colors.white },
  item: { flexDirection: "row", alignItems: "center", gap: spacing.md, paddingVertical: spacing.md },
  itemDivider: { borderTopWidth: 1, borderTopColor: colors.border },
  photo: { width: 40, height: 40, borderRadius: radii.input, overflow: "hidden", backgroundColor: colors.primarySurface, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" },
  photoImage: { width: "100%", height: "100%" },
  body: { flex: 1, minWidth: 0 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  name: { flexShrink: 1, fontFamily: fonts.body.semiBold, fontSize: 14, color: colors.text },
  dropBadge: { fontFamily: fonts.body.semiBold, fontSize: 10, color: colors.success, backgroundColor: "#DCFCE7", paddingHorizontal: 6, paddingVertical: 2, borderRadius: radii.full, overflow: "hidden" },
  meta: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 },
  metaText: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted },
  price: { fontFamily: fonts.body.semiBold, fontSize: 12, color: colors.text },
  oldPrice: { fontFamily: fonts.body.regular, fontSize: 11, color: colors.textMuted, textDecorationLine: "line-through" },
  end: { alignItems: "flex-end", gap: 6 },
  status: { fontFamily: fonts.body.semiBold, fontSize: 11, paddingHorizontal: 8, paddingVertical: 3, borderRadius: radii.full, overflow: "hidden" },
  boost: { minHeight: 32, minWidth: 44, paddingHorizontal: 10, borderRadius: 8, backgroundColor: colors.terracotta, alignItems: "center", justifyContent: "center" },
  boostText: { fontFamily: fonts.body.semiBold, fontSize: 11, color: colors.white },
  empty: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted, paddingVertical: spacing.md, textAlign: "center" },
  link: { minHeight: 44, alignItems: "center", justifyContent: "center", borderTopWidth: 1, borderTopColor: colors.border, marginTop: spacing.xs },
  linkText: { fontFamily: fonts.body.semiBold, fontSize: 14, color: colors.primary },
});
