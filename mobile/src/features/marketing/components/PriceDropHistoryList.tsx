import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { TrendingDown } from "lucide-react-native";
import { fetchPriceDropHistory } from "../api/visibility-boosts";
import type { PriceDropHistoryItem } from "../types";
import { colors, fonts, radii, spacing } from "../../../theme";
import { PriceDropHistoryCard } from "./PriceDropHistoryCard";

/** Every lower price that went out on Facebook, newest first. */
export function PriceDropHistoryList({ refreshSignal }: { refreshSignal: number }) {
  const [items, setItems] = useState<PriceDropHistoryItem[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async (next?: string) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetchPriceDropHistory(next);
      setItems((current) => (next ? [...current, ...response.items] : response.items));
      setCursor(response.nextCursor);
    } catch (reason: any) {
      setError(reason?.message || "Could not load price drop history.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load, refreshSignal]);

  return (
    <View>
      <Text style={styles.heading}>Price drop history</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {items.map((item) => <PriceDropHistoryCard key={item.id} item={item} />)}
      {loading ? <ActivityIndicator color={colors.primary} style={styles.loader} /> : null}
      {!loading && items.length === 0 && !error ? (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}><TrendingDown size={30} color={colors.primary} /></View>
          <Text style={styles.emptyTitle}>No price drops yet</Text>
          <Text style={styles.emptyText}>When a price goes down and is posted on Facebook, it shows here.</Text>
        </View>
      ) : null}
      {!loading && cursor ? (
        <Pressable onPress={() => void load(cursor)} accessibilityRole="button" style={styles.more}>
          <Text style={styles.moreText}>Show more</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  heading: { fontFamily: fonts.heading.bold, fontSize: 15, color: colors.text, marginTop: spacing.base },
  error: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.error, marginTop: spacing.sm },
  loader: { marginVertical: spacing.base },
  empty: { alignItems: "center", paddingVertical: spacing.xl, paddingHorizontal: spacing.lg, backgroundColor: colors.surface, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border, marginTop: spacing.sm },
  emptyIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.primaryLight, alignItems: "center", justifyContent: "center", marginBottom: spacing.md },
  emptyTitle: { fontFamily: fonts.heading.bold, fontSize: 16, color: colors.text },
  emptyText: { fontFamily: fonts.body.regular, fontSize: 13, lineHeight: 18, color: colors.textMuted, textAlign: "center", marginTop: spacing.xs },
  more: { minHeight: 48, alignItems: "center", justifyContent: "center", marginTop: spacing.sm },
  moreText: { fontFamily: fonts.body.semiBold, fontSize: 14, color: colors.primary },
});
