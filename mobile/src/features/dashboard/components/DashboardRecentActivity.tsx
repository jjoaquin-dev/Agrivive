import React from "react";
import { StyleSheet, View, Text, Pressable, ActivityIndicator } from "react-native";
import { History } from "lucide-react-native";
import { colors, fonts, radii, spacing, shadows } from "../../../theme";
import type { StockAdjustment } from "../../inventory/types";

interface DashboardRecentActivityProps {
  activity: StockAdjustment[];
  loading: boolean;
  onViewHistory: () => void;
}

export const DashboardRecentActivity: React.FC<DashboardRecentActivityProps> = ({
  activity,
  loading,
  onViewHistory,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionHeading}>Recent Amount Changes</Text>
        <Pressable
          onPress={onViewHistory}
          accessibilityRole="button"
          accessibilityLabel="View full amount change history"
          style={styles.seeAllButton}
        >
          <Text style={styles.seeAllText}>Full History</Text>
          <History size={14} color={colors.primary} />
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator size="small" color={colors.primary} style={styles.loader} />
      ) : activity.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptySub}>
            No amount changes recorded yet. Add products or change an amount to see history.
          </Text>
        </View>
      ) : (
        <View style={styles.activityCard}>
          {activity.map((act, index) => {
            const isPositive = parseFloat(act.delta) >= 0;
            const unit = act.scalingType === "kilo" ? "kg" : act.scalingType;
            const dateStr = new Date(act.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <View
                key={act.id}
                style={[
                  styles.activityRow,
                  index < activity.length - 1 && styles.activityRowDivider,
                ]}
              >
                <View style={styles.activityLeft}>
                  <Text style={styles.activityProduct}>{act.productName}</Text>
                  <Text style={styles.activityReason}>{act.reason}</Text>
                </View>
                <View style={styles.activityRight}>
                  <Text
                    style={[
                      styles.activityDelta,
                      isPositive ? styles.activityPositive : styles.activityNegative,
                    ]}
                  >
                    {isPositive ? `+${parseFloat(act.delta).toFixed(2)}` : parseFloat(act.delta).toFixed(2)} {unit}
                  </Text>
                  <Text style={styles.activityTime}>{dateStr}</Text>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.base,
    marginBottom: spacing.xxxl,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  sectionHeading: {
    fontFamily: fonts.heading.bold,
    fontSize: 18,
    color: colors.text,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.xs,
  },
  seeAllText: {
    fontFamily: fonts.body.semiBold,
    fontSize: 13,
    color: colors.primary,
    marginRight: 4,
  },
  loader: {
    marginVertical: spacing.base,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
    alignItems: "center",
    ...shadows.card,
  },
  emptySub: {
    fontFamily: fonts.body.regular,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: "center",
  },
  activityCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.base,
    ...shadows.card,
  },
  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
  },
  activityRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  activityLeft: {
    flex: 1,
  },
  activityProduct: {
    fontFamily: fonts.heading.bold,
    fontSize: 14,
    color: colors.text,
  },
  activityReason: {
    fontFamily: fonts.body.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  activityRight: {
    alignItems: "flex-end",
  },
  activityDelta: {
    fontFamily: fonts.heading.bold,
    fontSize: 14,
  },
  activityPositive: {
    color: colors.success,
  },
  activityNegative: {
    color: colors.error,
  },
  activityTime: {
    fontFamily: fonts.body.regular,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
});
