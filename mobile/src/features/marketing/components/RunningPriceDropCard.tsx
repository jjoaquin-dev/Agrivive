import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Clock, TrendingDown } from "lucide-react-native";
import { ButtonComponent } from "../../../components/ButtonComponent";
import { colors, fonts, radii, shadows, spacing } from "../../../theme";
import { formatBoostTime, type RunningPriceDrop } from "../types";

const peso = (value: number) => `₱${value.toFixed(2)}`;

interface Props {
  item: RunningPriceDrop;
  busy: boolean;
  onLowerNow: () => void;
}

/** A listing waiting for its next automatic price drop, with a button to lower the price now instead of waiting. */
export function RunningPriceDropCard({ item, busy, onLowerNow }: Props) {
  const hours = item.waitUntil ? Math.max(1, Math.ceil((new Date(item.waitUntil).getTime() - Date.now()) / 3_600_000)) : 0;
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
      {item.available || item.waitUntil ? (
        <ButtonComponent
          title={item.available ? "Lower Price Now" : `Lower price again in about ${hours} hour${hours === 1 ? "" : "s"}`}
          variant="secondary"
          onPress={onLowerNow}
          loading={busy}
          disabled={!item.available}
          icon={<TrendingDown size={18} color={colors.primary} />}
          style={styles.button}
        />
      ) : item.message ? <Text style={styles.note}>{item.message}</Text> : null}
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
