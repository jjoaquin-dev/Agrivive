import React, { useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { Sparkles } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import type { Product } from "../../inventory/types";

interface AnalyticsProductPerformanceProps {
  products: Product[];
}

function getProduceEmoji(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes("cabbage") || lower.includes("repolyo") || lower.includes("lettuce")) return "🥬";
  if (lower.includes("tomato") || lower.includes("kamatis")) return "🍅";
  if (lower.includes("carrot")) return "🥕";
  if (lower.includes("eggplant") || lower.includes("talong")) return "🍆";
  if (lower.includes("pepper") || lower.includes("sili") || lower.includes("bell")) return "🫑";
  if (lower.includes("onion") || lower.includes("sibuyas")) return "🧅";
  if (lower.includes("potato") || lower.includes("patatas")) return "🥔";
  if (lower.includes("cucumber") || lower.includes("pipino")) return "🥒";
  return "🍃";
}

export function AnalyticsProductPerformance({ products }: AnalyticsProductPerformanceProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "low" | "out">("all");

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const qty = Number(p.productQty) || 0;
      if (filter === "out") return qty <= 0;
      if (filter === "low") return qty > 0 && qty <= 10;
      return true;
    });
  }, [products, filter]);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleColumn}>
          <Text style={styles.title}>Produce Listing Performance</Text>
          <Text style={styles.subtitle}>Current surplus stock and depletion status</Text>
        </View>
      </View>

      <View style={styles.filterRow}>
        <TouchableOpacity
          onPress={() => setFilter("all")}
          style={[styles.filterChip, filter === "all" && styles.filterChipActive]}
        >
          <Text style={[styles.filterText, filter === "all" && styles.filterTextActive]}>All ({products.length})</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFilter("low")}
          style={[styles.filterChip, filter === "low" && styles.filterChipActive]}
        >
          <Text style={[styles.filterText, filter === "low" && styles.filterTextActive]}>Low Amount</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFilter("out")}
          style={[styles.filterChip, filter === "out" && styles.filterChipActive]}
        >
          <Text style={[styles.filterText, filter === "out" && styles.filterTextActive]}>Depleted</Text>
        </TouchableOpacity>
      </View>

      {filteredProducts.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No produce matching this filter.</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {filteredProducts.slice(0, 5).map((p) => {
            const qty = Number(p.productQty) || 0;
            const isOut = qty <= 0;
            const isLow = qty > 0 && qty <= 10;
            const isDiscounted = Boolean(p.basePrice != null && Number(p.basePrice) > Number(p.productPrice));
            const unit = p.scalingType === "kilo" ? "kg" : p.scalingType;
            const badgeBg = isOut ? "rgba(220, 38, 38, 0.1)" : isLow ? "rgba(217, 119, 6, 0.1)" : "rgba(22, 163, 74, 0.1)";
            const badgeColor = isOut ? "#DC2626" : isLow ? "#D97706" : "#16A34A";
            const badgeLabel = isOut ? "Depleted" : isLow ? "Low Stock" : "In Stock";

            return (
              <View key={p.id} style={[styles.itemRow, isDiscounted && styles.itemRowDiscounted]}>
                <View style={styles.itemAvatar}>
                  <Text style={styles.itemEmoji}>{getProduceEmoji(p.productName)}</Text>
                </View>
                <View style={styles.itemDetails}>
                  <View style={styles.itemNameRow}>
                    <Text style={styles.itemName} numberOfLines={1}>{p.productName}</Text>
                    <View style={styles.badgeGroup}>
                      {isDiscounted && (
                        <>
                          <View style={styles.discountBadge}>
                            <Text style={styles.discountBadgeText}>Price Drop</Text>
                          </View>
                          <TouchableOpacity
                            onPress={() => router.push({ pathname: "/(app)/marketing/[productId]", params: { productId: p.id } })}
                            style={styles.previewPostBtn}
                            accessibilityRole="button"
                            accessibilityLabel={`Boost ${p.productName}`}
                            hitSlop={6}
                          >
                            <Sparkles size={11} color="#FFFFFF" />
                            <Text style={styles.previewPostBtnText}>Boost</Text>
                          </TouchableOpacity>
                        </>
                      )}
                      <View style={[styles.statusBadge, { backgroundColor: badgeBg }]}>
                        <Text style={[styles.statusText, { color: badgeColor }]}>{badgeLabel}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.itemMetaRow}>
                    <Text style={styles.itemStock}>{qty} {unit} available</Text>
                    <View style={styles.priceContainer}>
                      {isDiscounted && (
                        <Text style={styles.basePrice}>₱{p.basePrice}</Text>
                      )}
                      <Text style={[styles.itemPrice, isDiscounted && styles.discountedItemPrice]}>
                        ₱{p.productPrice}/{unit}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border, padding: spacing.base, marginBottom: spacing.base },
  header: { marginBottom: spacing.sm },
  titleColumn: { flex: 1 },
  title: { fontFamily: fonts.heading.bold, fontSize: 16, color: colors.text },
  subtitle: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted, marginTop: 2 },
  filterRow: { flexDirection: "row", gap: spacing.xs, marginBottom: spacing.md },
  filterChip: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: radii.full, backgroundColor: colors.surfaceMuted, borderWidth: 1, borderColor: colors.border },
  filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { fontFamily: fonts.body.medium, fontSize: 12, color: colors.text },
  filterTextActive: { fontFamily: fonts.body.semiBold, color: colors.white },
  list: { gap: spacing.sm },
  itemRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, paddingVertical: spacing.xs, borderBottomWidth: 1, borderBottomColor: colors.surfaceMuted },
  itemRowDiscounted: { borderColor: "rgba(217, 119, 6, 0.4)", borderWidth: 1, borderRadius: radii.input, backgroundColor: "rgba(217, 119, 6, 0.04)", paddingHorizontal: spacing.xs },
  itemAvatar: { width: 38, height: 38, borderRadius: radii.button, backgroundColor: colors.surfaceMuted, alignItems: "center", justifyContent: "center" },
  itemEmoji: { fontSize: 20 },
  itemDetails: { flex: 1 },
  itemNameRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  itemName: { fontFamily: fonts.heading.bold, fontSize: 14, color: colors.text, flex: 1, marginRight: spacing.sm },
  badgeGroup: { flexDirection: "row", alignItems: "center", gap: 4 },
  discountBadge: { backgroundColor: "rgba(217, 119, 6, 0.15)", paddingHorizontal: 6, paddingVertical: 2, borderRadius: radii.full, borderWidth: 0.5, borderColor: colors.warning },
  discountBadgeText: { fontFamily: fonts.body.semiBold, fontSize: 10, color: colors.warning },
  previewPostBtn: { flexDirection: "row", alignItems: "center", gap: 3, backgroundColor: colors.primary, paddingHorizontal: 7, paddingVertical: 2.5, borderRadius: radii.full },
  previewPostBtnText: { fontFamily: fonts.body.semiBold, fontSize: 10, color: colors.white },
  statusBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: radii.full },
  statusText: { fontFamily: fonts.body.semiBold, fontSize: 10 },
  itemMetaRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 2 },
  itemStock: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted },
  priceContainer: { flexDirection: "row", alignItems: "center", gap: 4 },
  basePrice: { fontFamily: fonts.body.regular, fontSize: 11, color: colors.textMuted, textDecorationLine: "line-through" },
  itemPrice: { fontFamily: fonts.body.semiBold, fontSize: 12, color: colors.primary },
  discountedItemPrice: { color: colors.warning },
  empty: { paddingVertical: spacing.md, alignItems: "center" },
  emptyText: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted },
});
