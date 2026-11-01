import React from "react";
import { StyleSheet, View } from "react-native";
import { radii, spacing } from "../../../theme";
import { cardStyles } from "../analyticsCard";

const Block = ({ width, height }: { width: number | `${number}%`; height: number }) => (
  <View style={[styles.block, { width, height }]} />
);

/** Grey placeholders that keep the card shapes while numbers load (Doherty Threshold, Doherty & Thadani). */
export function AnalyticsSkeleton() {
  return (
    <View accessibilityLabel="Loading your sales report" accessibilityLiveRegion="polite">
      <View style={cardStyles.card}><Block width={60} height={18} /><View style={styles.gap} /><Block width="55%" height={30} /><View style={styles.gap} /><Block width="75%" height={16} /></View>
      <View style={cardStyles.card}><Block width="45%" height={18} /><View style={styles.gap} /><Block width="100%" height={8} /></View>
      <View style={cardStyles.card}><Block width="60%" height={18} /><View style={styles.gap} /><Block width="100%" height={170} /></View>
      <View style={cardStyles.card}><Block width="40%" height={18} /><View style={styles.gap} /><Block width="100%" height={10} /><View style={styles.gap} /><Block width="100%" height={10} /></View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { backgroundColor: "#F3F4F6", borderRadius: radii.sm },
  gap: { height: spacing.md },
});
