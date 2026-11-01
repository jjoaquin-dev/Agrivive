import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { Flame } from "lucide-react-native";
import { useRouter } from "expo-router";
import { colors, fonts, radii, spacing } from "../../../theme";
import { boostState, type SellerVisibilityBoost } from "../types";
import { BoostHistoryCard } from "./BoostHistoryCard";

const activeStates = ["posting", "running", "needs_choice", "not_posted", "failed"];

interface Props {
  items: SellerVisibilityBoost[];
  loading: boolean;
}

/** Boosts still going out or needing the seller. Price drops waiting for a boost have their own tab. */
export function ActiveBoostsSection({ items, loading }: Props) {
  const router = useRouter();
  const active = items.filter((item) => activeStates.includes(boostState(item)));

  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Running boosts ({active.length})</Text>
      </View>

      {loading && items.length === 0 ? <ActivityIndicator color={colors.primary} style={styles.loader} /> : null}

      {active.map((item) => (
        <BoostHistoryCard
          key={item.id}
          item={item}
          onOpen={() => router.push({ pathname: "/(app)/marketing/[productId]", params: { productId: item.productId } })}
        />
      ))}

      {!loading && active.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}><Flame size={30} color={colors.terracotta} /></View>
          <Text style={styles.emptyTitle}>No boosts running</Text>
          <Text style={styles.emptyText}>Boost a product from your Listings to share it.</Text>
          <Pressable
            onPress={() => router.push("/(app)/(tabs)/inventory")}
            accessibilityRole="button"
            style={({ pressed }) => [styles.emptyCta, pressed && styles.pressed]}
          >
            <Text style={styles.emptyCtaText}>Go to Listings</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    fontFamily: fonts.heading.bold,
    fontSize: 15,
    color: colors.text,
  },
  loader: {
    marginVertical: spacing.base,
  },
  empty: {
    alignItems: "center",
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.xs,
  },
  emptyIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.primaryLight, alignItems: "center", justifyContent: "center", marginBottom: spacing.md },
  emptyTitle: {
    fontFamily: fonts.heading.bold,
    fontSize: 16,
    color: colors.text,
  },
  emptyText: {
    fontFamily: fonts.body.regular,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing.xs,
  },
  emptyCta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderRadius: radii.button,
    marginTop: spacing.base,
    minHeight: 44,
  },
  emptyCtaText: {
    fontFamily: fonts.body.semiBold,
    fontSize: 13,
    color: colors.white,
  },
  pressed: {
    opacity: 0.8,
  },
});
