import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { CircleAlert } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import { SkeletonBlock, SkeletonCard } from "./DashboardSkeleton";

export const LowStockSkeleton: React.FC = () => (
  <>
    {[0, 1, 2].map((i) => (
      <SkeletonCard key={i} style={styles.skeletonRow}>
        <View style={styles.info}>
          <SkeletonBlock width="45%" height={14} />
          <View style={{ height: spacing.xs }} />
          <SkeletonBlock width="70%" height={10} />
        </View>
        <SkeletonBlock width={84} height={44} radius={radii.button} />
      </SkeletonCard>
    ))}
  </>
);

export const LowStockError: React.FC = () => (
  <View style={styles.errorRow}>
    <CircleAlert size={20} color={colors.textMuted} />
    <Text style={styles.errorText}>Stock alerts unavailable. Tap 'Try Again' above to reload.</Text>
  </View>
);

const styles = StyleSheet.create({
  skeletonRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
    padding: spacing.md,
  },
  info: { flex: 1, marginRight: spacing.sm },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
  },
  errorText: {
    flex: 1,
    fontFamily: fonts.body.regular,
    fontSize: 13,
    color: colors.textMuted,
  },
});
