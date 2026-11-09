import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Clock } from "lucide-react-native";
import { colors, fonts, radii, shadows, spacing } from "../../../theme";
import { formatBoostTime, type RunningPriceDrop } from "../types";

const peso = (value: number) => `₱${value.toFixed(2)}`;

interface Props {
  item: RunningPriceDrop;
}

/** A listing waiting for its next automatic price drop. The drop runs on its own; there is nothing to tap. */
export function RunningPriceDropCard({ item }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {item.imageUrl ? <Image source={{ uri: item.imageUrl }} style={styles.photo} /> : <View style={[styles.photo, styles.placeholder]} />}
        <View style={styles.title}>
          <Text style={styles.product} numberOfLines={1}>{item.productName}</Text>
          <Text style={styles.meta}>
            {peso(item.currentPrice)}{item.lowestPrice != null ? ` → lowest ${peso(item.lowestPrice)}` : ""} · −{peso(item.dropAmount)} each time
          </Text>
        </View>
      </View>
      {item.nextDropAt ? (
        <View style={styles.next}>
          <Clock size={16} color={colors.primary} />
          <Text style={styles.nextText}>Next automatic drop: {formatBoostTime(item.nextDropAt)}</Text>
        </View>
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
  meta: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted, marginTop: 2 },
  next: { flexDirection: "row", alignItems: "center", gap: spacing.sm, backgroundColor: colors.primarySurface, borderRadius: radii.input, padding: spacing.sm, marginTop: spacing.md },
  nextText: { flex: 1, fontFamily: fonts.body.medium, fontSize: 13, color: colors.text },
  button: { minHeight: 48, marginTop: spacing.md },
  note: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted, marginTop: spacing.sm },
});
