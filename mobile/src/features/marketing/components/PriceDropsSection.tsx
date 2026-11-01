import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TrendingDown } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import { PriceDropPromptList } from "./PriceDropPromptList";

/** Lower prices waiting to be shared again. */
export function PriceDropsSection({ refreshSignal, count }: { refreshSignal: number; count: number }) {
  return (
    <View>
      <PriceDropPromptList refreshSignal={refreshSignal} />
      {count === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}><TrendingDown size={30} color={colors.primary} /></View>
          <Text style={styles.emptyTitle}>No price drops waiting</Text>
          <Text style={styles.emptyText}>When a boosted price goes down, you can share the new price here.</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { alignItems: "center", paddingVertical: spacing.xl, paddingHorizontal: spacing.lg, backgroundColor: colors.surface, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border },
  emptyIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.primaryLight, alignItems: "center", justifyContent: "center", marginBottom: spacing.md },
  emptyTitle: { fontFamily: fonts.heading.bold, fontSize: 16, color: colors.text },
  emptyText: { fontFamily: fonts.body.regular, fontSize: 13, lineHeight: 18, color: colors.textMuted, textAlign: "center", marginTop: spacing.xs },
});
