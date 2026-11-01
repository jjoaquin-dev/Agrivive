import React from "react";
import { Image, Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { ArrowRight, ExternalLink } from "lucide-react-native";
import { colors, fonts, radii, shadows, spacing } from "../../../theme";
import { formatBoostTime, type PriceDropHistoryItem } from "../types";
import { PlatformBadge } from "./PlatformBadge";

const peso = (value: number) => `₱${value.toFixed(2)}`;

/** One lower-price post: the product, the old and new price, the words posted and when (Common Region, Gestalt). */
export function PriceDropHistoryCard({ item }: { item: PriceDropHistoryItem }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {item.imageUrl ? <Image source={{ uri: item.imageUrl }} style={styles.photo} /> : <View style={[styles.photo, styles.placeholder]} />}
        <View style={styles.title}>
          <Text style={styles.product} numberOfLines={1}>{item.productName}</Text>
          <View style={styles.platformRow}>
            <PlatformBadge platform="facebook" size={14} />
            <Text style={styles.meta}>Posted {formatBoostTime(item.postedAt)}</Text>
          </View>
        </View>
      </View>
      <View style={styles.priceRow}>
        <Text style={styles.old}>{peso(item.priceBefore)}</Text>
        <ArrowRight size={16} color={colors.textMuted} />
        <Text style={styles.new}>{peso(item.priceAfter)}</Text>
        <Text style={styles.off}>−{peso(item.priceBefore - item.priceAfter)}</Text>
      </View>
      {item.caption ? <Text style={styles.caption}>{item.caption}</Text> : null}
      {item.postUrl ? (
        <Pressable onPress={() => void Linking.openURL(item.postUrl as string)} accessibilityRole="link" style={styles.link}>
          <Text style={styles.linkText}>View post</Text>
          <ExternalLink size={14} color={colors.primary} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border, padding: spacing.base, marginTop: spacing.sm, ...shadows.card },
  header: { flexDirection: "row", gap: spacing.sm, alignItems: "center" },
  photo: { width: 52, height: 52, borderRadius: radii.sm + 4, backgroundColor: colors.surfaceMuted },
  placeholder: { backgroundColor: colors.primaryLight },
  title: { flex: 1 },
  product: { fontFamily: fonts.heading.bold, fontSize: 16, color: colors.text },
  platformRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 },
  meta: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted },
  priceRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: spacing.md },
  old: { fontFamily: fonts.body.regular, fontSize: 14, color: colors.textMuted, textDecorationLine: "line-through" },
  new: { fontFamily: fonts.heading.bold, fontSize: 18, color: colors.primary },
  off: { fontFamily: fonts.body.semiBold, fontSize: 12, color: colors.terracotta, marginLeft: "auto" },
  caption: { fontFamily: fonts.body.regular, fontSize: 13, lineHeight: 18, color: colors.text, backgroundColor: colors.surfaceMuted, borderRadius: radii.input, padding: spacing.sm, marginTop: spacing.sm },
  link: { flexDirection: "row", alignItems: "center", gap: 4, minHeight: 44, marginTop: spacing.xs },
  linkText: { fontFamily: fonts.body.semiBold, fontSize: 13, color: colors.primary },
});
