import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { fetchRunningPriceDrops } from "../api/visibility-boosts";
import type { RunningPriceDrop } from "../types";
import { colors, fonts, spacing } from "../../../theme";
import { RunningPriceDropCard } from "./RunningPriceDropCard";

interface Props {
  refreshSignal: number;
}

/** The price drops that are waiting: lower now (follow_up) or wait for the automatic round. Nothing shows when none are running. */
export function RunningPriceDropList({ refreshSignal }: Props) {
  const [items, setItems] = useState<RunningPriceDrop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading || (items.length === 0 && !error)) return null;

  return (
    <View>
      <Text style={styles.heading}>Waiting for the next drop</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {items.map((item) => (
        <RunningPriceDropCard key={item.boostId} item={item} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  heading: { fontFamily: fonts.heading.bold, fontSize: 15, color: colors.text, marginTop: spacing.xs },
  loader: { marginVertical: spacing.base },
  error: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.error, marginTop: spacing.sm },
});
