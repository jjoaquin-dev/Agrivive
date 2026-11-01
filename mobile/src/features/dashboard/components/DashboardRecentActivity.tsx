import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { Plus, Minus, History } from "lucide-react-native";
import { colors, fonts, radii, spacing, shadows, typography } from "../../../theme";
import type { StockAdjustment } from "../../inventory/types";
import { SkeletonBlock, SkeletonCard } from "./DashboardSkeleton";

interface DashboardRecentActivityProps {
  activity: StockAdjustment[];
  loading: boolean;
  error?: boolean;
  onViewHistory: () => void;
}

const formatAdjustmentDate = (dateIso: string): string => {
  const d = new Date(dateIso);
  const now = new Date();
  const timeStr = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  if (d.toDateString() === now.toDateString()) return `Today, ${timeStr}`;
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return `Yesterday, ${timeStr}`;
  const dateFormatted = d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
  return `${dateFormatted}, ${timeStr}`;
};

const formatDelta = (val: number, scalingType: string): string => {
  const abs = Math.abs(val);
  const numStr = Number.isInteger(abs) ? String(abs) : String(abs);
  const unit = scalingType === "kilo" ? "kg" : abs === 1 ? scalingType : `${scalingType}s`;
  return `${val >= 0 ? "+" : "−"}${numStr} ${unit}`;
};

export const DashboardRecentActivity: React.FC<DashboardRecentActivityProps> = ({
  activity,
  loading,
  error = false,
  onViewHistory,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionHeading}>Recent Changes</Text>
        {!loading && !error && activity.length > 0 ? (
          <Pressable
            onPress={onViewHistory}
            accessibilityRole="button"
            accessibilityLabel="View recent changes history"
            style={styles.seeAllButton}
          >
            <Text style={styles.seeAllText}>See all</Text>
          </Pressable>
        ) : null}
      </View>

      {loading ? (
        <View style={styles.list}>
          {[0, 1, 2, 3].map((i) => (
            <SkeletonCard key={i} style={styles.skeletonRow}>
              <SkeletonBlock width={40} height={40} radius={20} />
              <View style={styles.activityBody}>
                <SkeletonBlock width="40%" height={12} />
                <View style={{ height: spacing.xs }} />
                <SkeletonBlock width="65%" height={10} />
              </View>
            </SkeletonCard>
          ))}
        </View>
      ) : error ? (
        <View style={styles.emptyCard}>
          <History size={24} color={colors.textMuted} />
          <Text style={styles.emptySub}>Unable to load recent activity.</Text>
        </View>
      ) : activity.length === 0 ? (
        <View style={styles.emptyCard}>
          <History size={28} color={colors.textMuted} />
          <Text style={styles.emptySub}>
            No changes yet. When you add or take away vegetables, they show up here.
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {activity.map((act) => {
            const delta = parseFloat(act.delta);
            const isPositive = delta >= 0;
            const dateStr = formatAdjustmentDate(act.createdAt);
            const tone = isPositive ? colors.success : colors.warning;
            const deltaStr = formatDelta(delta, act.scalingType);

            return (
              <View key={act.id} style={styles.activityRow}>
                <View style={[styles.iconWrap, { backgroundColor: isPositive ? colors.primaryLight : "#FEF3C7" }]}>
                  {isPositive ? <Plus size={18} color={tone} /> : <Minus size={18} color={tone} />}
                </View>
                <View style={styles.activityBody}>
                  <View style={styles.titleLine}>
                    <Text style={styles.activityProduct} numberOfLines={1}>{act.productName}</Text>
                    <View style={[styles.reasonPill, { backgroundColor: isPositive ? colors.primaryLight : "#FEF3C7" }]}>
                      <Text style={[styles.reasonText, { color: isPositive ? colors.primaryPressed : "#92400E" }]} numberOfLines={1}>{act.reason}</Text>
                    </View>
                  </View>
                  <Text style={styles.activityMeta}>
                    <Text style={{ color: tone, fontFamily: fonts.body.semiBold }}>
                      {deltaStr}
                    </Text>
                    {"  ·  "}{dateStr}
                  </Text>
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
  container: { marginBottom: spacing.xxl },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.sm },
  sectionHeading: { ...typography.sectionHeading, fontFamily: fonts.heading.bold, color: colors.text },
  seeAllButton: { flexDirection: "row", alignItems: "center", paddingVertical: spacing.xs },
  seeAllText: { ...typography.label, fontFamily: fonts.body.semiBold, color: colors.primary },
  skeletonRow: { flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.md },
  emptyCard: { backgroundColor: colors.surface, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border, padding: spacing.base, alignItems: "center", gap: spacing.sm, ...shadows.card },
  emptySub: { ...typography.labelSmall, color: colors.textMuted, textAlign: "center" },
  list: { gap: spacing.sm },
  activityRow: { flexDirection: "row", alignItems: "center", gap: spacing.md, backgroundColor: colors.surface, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border, padding: spacing.md, ...shadows.card },
  iconWrap: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  activityBody: { flex: 1 },
  titleLine: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  activityProduct: { ...typography.bodyLarge, fontFamily: fonts.heading.semiBold, color: colors.text, flexShrink: 1 },
  reasonPill: { borderRadius: radii.full, paddingHorizontal: spacing.sm, paddingVertical: 2, flexShrink: 1 },
  reasonText: { ...typography.caption },
  activityMeta: { ...typography.labelSmall, color: colors.textMuted, marginTop: 2 },
});
