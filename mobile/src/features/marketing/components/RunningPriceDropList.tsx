import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { fetchRunningPriceDrops, requestPriceDropNow } from "../api/visibility-boosts";
import type { RunningPriceDrop } from "../types";
import { colors, fonts, spacing } from "../../../theme";
import { RunningPriceDropCard } from "./RunningPriceDropCard";

interface Props {
  refreshSignal: number;
  /** Called after a drop was brought forward, so the history below can reload. */
  onChanged: () => void;
}

/** The price drops that are waiting: lower now (follow_up) or wait for the automatic round. Nothing shows when none are running. */
export function RunningPriceDropList({ refreshSignal, onChanged }: Props) {
  const [items, setItems] = useState<RunningPriceDrop[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    try {
      setItems((await fetchRunningPriceDrops()).items);
    } catch (reason: any) {
      setError(reason?.message || "Could not load your price drops.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load, refreshSignal]);

  const lowerNow = async (item: RunningPriceDrop) => {
    setBusyId(item.productId);
    setError("");
    setNotice("");
    try {
      await requestPriceDropNow(item.productId);
      setNotice(`Lowering the price of ${item.productName}. It is posted within a minute.`);
      await load();
      onChanged();
    } catch (reason: any) {
      setError(reason?.message || "Could not lower the price. Check your connection and try again.");
    } finally {
      setBusyId(null);
    }
  };

  if (loading && items.length === 0) return <ActivityIndicator color={colors.primary} style={styles.loader} />;
  if (items.length === 0 && !error) return null;

  return (
    <View>
      <Text style={styles.heading}>Waiting for the next drop</Text>
      {notice ? <Text style={styles.notice}>{notice}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {items.map((item) => (
        <RunningPriceDropCard key={item.boostId} item={item} busy={busyId === item.productId} onLowerNow={() => void lowerNow(item)} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  heading: { fontFamily: fonts.heading.bold, fontSize: 15, color: colors.text, marginTop: spacing.xs },
  loader: { marginVertical: spacing.base },
  notice: { fontFamily: fonts.body.medium, fontSize: 13, color: colors.primary, marginTop: spacing.sm },
  error: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.error, marginTop: spacing.sm },
});
