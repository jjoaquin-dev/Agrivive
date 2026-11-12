import React, { useState } from "react";
import { Image, StyleSheet, Switch, Text, View } from "react-native";
import { setAutoPostEnabled } from "../api/visibility-boosts";
import type { Product } from "../../inventory/types";
import { colors, fonts, radii, spacing } from "../../../theme";
import { surface } from "../../../theme/surface";

/** One switch per listing. On lets Agrivive post again after your first post. Off stops it. */
export function AutoPostSwitches({ products }: { products: Product[] }) {
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const listed = products.filter((product) => product.isActive !== false);
  if (listed.length === 0) return null;

  const toggle = async (product: Product, enabled: boolean) => {
    setBusyId(product.id);
    setError("");
    try {
      await setAutoPostEnabled(product.id, enabled);
      setOverrides((current) => ({ ...current, [product.id]: enabled }));
    } catch (reason: any) {
      setError(reason?.message || "Could not change this setting.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <View>
      <Text style={styles.heading}>Auto-Post</Text>
      <Text style={styles.caption}>You start the first post. When this is on, we post again after 6 hours and when your produce ranks high again.</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {listed.map((product) => {
        const on = overrides[product.id] ?? product.autoPostEnabled === true;
        return (
          <View key={product.id} style={styles.row}>
            {product.imagUrl ? <Image source={{ uri: product.displayImageUrl ?? product.imagUrl }} style={styles.photo} /> : <View style={[styles.photo, styles.placeholder]} />}
            <View style={styles.body}>
              <Text style={styles.name} numberOfLines={1}>{product.productName}</Text>
              <Text style={[styles.state, { color: on ? colors.primary : colors.textMuted }]}>{on ? "On" : "Off"}</Text>
            </View>
            <Switch
              value={on}
              disabled={busyId !== null}
              onValueChange={(value) => void toggle(product, value)}
              trackColor={{ true: colors.primary, false: colors.border }}
              accessibilityLabel={`Auto-Post for ${product.productName}`}
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  heading: { fontFamily: fonts.heading.bold, fontSize: 17, color: colors.text, marginTop: spacing.base },
  caption: { fontFamily: fonts.body.regular, fontSize: 13, lineHeight: 18, color: colors.textMuted, marginTop: 2 },
  error: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.error, marginTop: spacing.sm },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.sm, backgroundColor: colors.surface, borderRadius: radii.card, borderWidth: 1, borderColor: "#F3F1EC", padding: spacing.md, marginTop: spacing.sm, minHeight: 64, ...surface.shadow },
  photo: { width: 44, height: 44, borderRadius: radii.sm + 2, backgroundColor: colors.surfaceMuted },
  placeholder: { backgroundColor: colors.primaryLight },
  body: { flex: 1 },
  name: { fontFamily: fonts.heading.bold, fontSize: 15, color: colors.text },
  state: { fontFamily: fonts.body.semiBold, fontSize: 13, marginTop: 2 },
});
