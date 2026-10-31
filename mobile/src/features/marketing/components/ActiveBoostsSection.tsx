import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { colors, fonts, spacing } from "../../../theme";
import { boostState, type SellerVisibilityBoost } from "../types";
import { BoostHistoryCard } from "./BoostHistoryCard";
import { PriceDropPromptList } from "./PriceDropPromptList";

const activeStates = ["posting", "running", "needs_choice", "not_posted", "failed"];

interface Props {
  items: SellerVisibilityBoost[];
  loading: boolean;
  refreshSignal: number;
}

/** What needs the seller now: price drops waiting for a boost, then boosts still running or that did not post. */
export function ActiveBoostsSection({ items, loading, refreshSignal }: Props) {
  const router = useRouter();
  const active = items.filter((item) => activeStates.includes(boostState(item)));

  return (
    <View>
      <PriceDropPromptList refreshSignal={refreshSignal} />
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
          <Text style={styles.emptyTitle}>No boosts running</Text>
          <Text style={styles.emptyText}>Boost a listing from Listings to start one.</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  loader: { marginVertical: spacing.base },
  empty: { alignItems: "center", paddingVertical: spacing.xxxl },
  emptyTitle: { fontFamily: fonts.heading.semiBold, fontSize: 18, color: colors.text },
  emptyText: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, color: colors.textMuted, textAlign: "center", marginTop: spacing.xs },
});
