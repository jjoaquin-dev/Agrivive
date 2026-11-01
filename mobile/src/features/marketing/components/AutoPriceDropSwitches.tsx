import React, { useState } from "react";
import { Image, StyleSheet, Switch, Text, View } from "react-native";
import { setAutoPriceDropEnabled } from "../api/visibility-boosts";
import type { Product } from "../../inventory/types";
import { colors, fonts, radii, shadows, spacing } from "../../../theme";

const peso = (value: string | number) => `₱${Number(value).toFixed(2)}`;
const hasDrops = (product: Product) => Number(product.priceReductionAmount ?? 0) > 0 && product.minimumPrice != null && product.isActive !== false;

/** One switch per listing that has a drop amount and a final price. Off keeps the numbers and stops the 6-hour drops. */
export function AutoPriceDropSwitches({ products }: { products: Product[] }) {
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const listed = products.filter(hasDrops);
  if (listed.length === 0) return null;

  const toggle = async (product: Product, enabled: boolean) => {
    setBusyId(product.id);
    setError("");
    try {
      await setAutoPriceDropEnabled(product.id, enabled);
      setOverrides((current) => ({ ...current, [product.id]: enabled }));
    } catch (reason: any) {
      setError(reason?.message || "Could not change this setting.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <View>
      <Text style={styles.heading}>Automatic price drops</Text>
      <Text style={styles.caption}>Every 6 hours after your Boost post, if it has not sold out.</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {listed.map((product) => {
        const on = overrides[product.id] ?? product.priceReductionEnabled !== false;
        return (
          <View key={product.id} style={styles.row}>
            {product.imagUrl ? <Image source={{ uri: product.displayImageUrl ?? product.imagUrl }} style={styles.photo} /> : <View style={[styles.photo, styles.placeholder]} />}
            <View style={styles.body}>
              <Text style={styles.name} numberOfLines={1}>{product.productName}</Text>
              <Text style={styles.meta}>−{peso(product.priceReductionAmount ?? 0)} each time, down to {peso(product.minimumPrice ?? 0)}</Text>
              <Text style={[styles.state, { color: on ? colors.primary : colors.textMuted }]}>{on ? "On" : "Off"}</Text>
            </View>
            <Switch
              value={on}
              disabled={busyId !== null}
              onValueChange={(value) => void toggle(product, value)}
              trackColor={{ true: colors.primary, false: colors.border }}
              accessibilityLabel={`Automatic price drops for ${product.productName}`}
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  heading: { fontFamily: fonts.heading.bold, fontSize: 15, color: colors.text, marginTop: spacing.xs },
  caption: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted, marginTop: 2 },
  error: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.error, marginTop: spacing.sm },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.sm, backgroundColor: colors.surface, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border, padding: spacing.md, marginTop: spacing.sm, minHeight: 72, ...shadows.card },
  photo: { width: 44, height: 44, borderRadius: radii.sm + 2, backgroundColor: colors.surfaceMuted },
  placeholder: { backgroundColor: colors.primaryLight },
  body: { flex: 1 },
  name: { fontFamily: fonts.heading.bold, fontSize: 14, color: colors.text },
  meta: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted, marginTop: 2 },
  state: { fontFamily: fonts.body.semiBold, fontSize: 12, marginTop: 2 },
});
