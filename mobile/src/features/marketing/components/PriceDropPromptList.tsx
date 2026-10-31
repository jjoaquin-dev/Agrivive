import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { Megaphone, Sparkles } from "lucide-react-native";
import { useRouter } from "expo-router";
import { dismissSellerBoostPrompt, fetchSellerBoostPrompts } from "../api/visibility-boosts";
import { colors, fonts, radii, spacing } from "../../../theme";
import type { SellerBoostPrompt } from "../../notifications/types";

export function PriceDropPromptList({ refreshSignal }: { refreshSignal: number }) {
  const router = useRouter();
  const [items, setItems] = useState<SellerBoostPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetchSellerBoostPrompts();
      setItems(response.items);
    } catch (reason: any) {
      setError(reason?.message || "Could not load price drops.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, [refreshSignal]);

  const openBoost = (item: SellerBoostPrompt) => {
    // Open the Boost screen for this price drop.
    router.push({
      pathname: "/(app)/marketing/[productId]",
      params: { productId: item.productId, promptId: item.id },
    });
  };

  const dismiss = async (item: SellerBoostPrompt) => {
    setBusyId(item.id);
    setError("");
    try {
      await dismissSellerBoostPrompt(item.id);
      setItems((current) => current.filter((candidate) => candidate.id !== item.id));
    } catch (reason: any) {
      setError(reason?.message || "Could not dismiss the prompt.");
    } finally {
      setBusyId(null);
    }
  };

  if (loading && items.length === 0) return <ActivityIndicator color={colors.primary} style={styles.loader} />;
  if (!loading && items.length === 0 && !error) return null;

  return (
    <View style={styles.section}>
      <View style={styles.headingRow}>
        <View style={styles.icon}><Megaphone size={18} color={colors.primary} /></View>
        <View style={styles.headingCopy}>
          <Text style={styles.title}>Price dropped</Text>
          <Text style={styles.subtitle}>Boost it again to post the new price on the Agrivive Facebook Page.</Text>
        </View>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {items.map((item) => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.product}>{item.productName}</Text>
          <Text style={styles.price}>
            {item.priceBefore && item.priceAfter ? `₱${Number(item.priceBefore).toFixed(2)} → ₱${Number(item.priceAfter).toFixed(2)}` : "New price available"}
          </Text>
          <View style={styles.actions}>
            <Pressable
              onPress={() => openBoost(item)}
              disabled={busyId !== null}
              accessibilityRole="button"
              accessibilityLabel={`Boost ${item.productName} again`}
              style={({ pressed }) => [styles.boost, pressed && styles.pressed]}
            >
              <Sparkles size={16} color={colors.white} />
              <Text style={styles.boostText}>Boost Again</Text>
            </Pressable>
            <Pressable
              onPress={() => void dismiss(item)}
              disabled={busyId !== null}
              accessibilityRole="button"
              accessibilityLabel="Not now"
              style={({ pressed }) => [styles.dismiss, pressed && styles.pressed]}
            >
              <Text style={styles.dismissText}>Not now</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.base, marginBottom: spacing.lg },
  headingRow: { flexDirection: "row", alignItems: "center", marginBottom: spacing.sm },
  icon: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.primaryLight, alignItems: "center", justifyContent: "center", marginRight: spacing.sm },
  headingCopy: { flex: 1 },
  title: { fontFamily: fonts.heading.bold, fontSize: 18, color: colors.text },
  subtitle: { fontFamily: fonts.body.regular, fontSize: 13, lineHeight: 18, color: colors.textMuted, marginTop: 2 },
  card: { backgroundColor: colors.surface, borderRadius: radii.card, borderWidth: 1, borderColor: colors.primary, padding: spacing.base, marginTop: spacing.sm },
  product: { fontFamily: fonts.body.semiBold, fontSize: 16, color: colors.text },
  price: { fontFamily: fonts.body.medium, fontSize: 14, color: colors.primary, marginTop: spacing.xs },
  actions: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.md },
  boost: { minHeight: 48, flex: 1, borderRadius: radii.button, backgroundColor: colors.primary, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.xs },
  boostText: { fontFamily: fonts.body.semiBold, color: colors.white, fontSize: 14 },
  dismiss: { minHeight: 44, minWidth: 88, borderRadius: radii.button, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center", paddingHorizontal: spacing.sm },
  dismissText: { fontFamily: fonts.body.semiBold, color: colors.primary, fontSize: 13 },
  error: { fontFamily: fonts.body.medium, color: colors.error, fontSize: 13, marginTop: spacing.xs },
  loader: { marginVertical: spacing.md },
  pressed: { opacity: 0.75 },
});
