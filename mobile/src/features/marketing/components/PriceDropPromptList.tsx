import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { Sparkles } from "lucide-react-native";
import { useRouter } from "expo-router";
import { dismissSellerBoostPrompt, fetchSellerBoostPrompts } from "../api/visibility-boosts";
import { colors, fonts, radii, spacing, shadows } from "../../../theme";
import { PlatformBadge } from "./PlatformBadge";
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
      <View style={styles.header}>
        <View style={styles.tagWrap}>
          <Sparkles size={14} color={colors.primary} />
          <Text style={styles.tagText}>Price dropped</Text>
        </View>
        <View style={styles.platforms}>
          <PlatformBadge platform="facebook" size={16} />
          <PlatformBadge platform="instagram" size={16} />
        </View>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {items.map((item) => (
        <View key={item.id} style={styles.card}>
          <View style={styles.cardBody}>
            <Text style={styles.product}>{item.productName}</Text>
            <View style={styles.priceRow}>
              {item.priceBefore ? (
                <Text style={styles.priceOld}>₱{Number(item.priceBefore).toFixed(2)}</Text>
              ) : null}
              {item.priceBefore && item.priceAfter ? <Text style={styles.arrow}>→</Text> : null}
              <Text style={styles.priceNew}>
                {item.priceAfter ? `₱${Number(item.priceAfter).toFixed(2)}` : "New Price Available"}
              </Text>
            </View>
            <Text style={styles.promptCopy}>
              Broadcast this lower price to shoppers on Agrivive Facebook & Instagram.
            </Text>
          </View>
          <View style={styles.actions}>
            <Pressable
              onPress={() => openBoost(item)}
              disabled={busyId !== null}
              accessibilityRole="button"
              accessibilityLabel={`Boost ${item.productName} again`}
              style={({ pressed }) => [styles.boostBtn, pressed && styles.pressed]}
            >
              <Sparkles size={16} color={colors.white} />
              <Text style={styles.boostText}>Boost Again</Text>
            </Pressable>
            <Pressable
              onPress={() => void dismiss(item)}
              disabled={busyId !== null}
              accessibilityRole="button"
              accessibilityLabel="Not now"
              style={({ pressed }) => [styles.dismissBtn, pressed && styles.pressed]}
            >
              <Text style={styles.dismissText}>Not Now</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.base,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.xs,
  },
  tagWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  tagText: {
    fontFamily: fonts.heading.semiBold,
    fontSize: 17,
    color: colors.text,
  },
  platforms: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1.5,
    borderColor: colors.primary,
    padding: spacing.base,
    marginTop: spacing.xs,
    ...shadows.card,
  },
  cardBody: {
    marginBottom: spacing.md,
  },
  product: {
    fontFamily: fonts.heading.bold,
    fontSize: 16,
    color: colors.text,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: spacing.xs,
  },
  priceOld: {
    fontFamily: fonts.body.regular,
    fontSize: 14,
    color: colors.textMuted,
    textDecorationLine: "line-through",
  },
  arrow: {
    fontSize: 14,
    color: colors.textMuted,
  },
  priceNew: {
    fontFamily: fonts.heading.bold,
    fontSize: 17,
    color: colors.primary,
  },
  promptCopy: {
    fontFamily: fonts.body.regular,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
    marginTop: 4,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  boostBtn: {
    minHeight: 48,
    flex: 1,
    borderRadius: radii.button,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
  },
  boostText: {
    fontFamily: fonts.body.semiBold,
    color: colors.white,
    fontSize: 14,
  },
  dismissBtn: {
    minHeight: 48,
    minWidth: 84,
    borderRadius: radii.button,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.sm,
  },
  dismissText: {
    fontFamily: fonts.body.medium,
    color: colors.textMuted,
    fontSize: 13,
  },
  error: {
    fontFamily: fonts.body.medium,
    color: colors.error,
    fontSize: 13,
    marginTop: spacing.xs,
  },
  loader: {
    marginVertical: spacing.md,
  },
  pressed: {
    opacity: 0.8,
  },
});
