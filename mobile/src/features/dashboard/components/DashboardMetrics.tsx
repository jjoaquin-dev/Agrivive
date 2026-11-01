import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { ClipboardList, TriangleAlert, PackageX, Scale, type LucideIcon } from "lucide-react-native";
import { SkeletonBlock, SkeletonCard } from "./DashboardSkeleton";
import { colors, fonts, radii, shadows, spacing, typography } from "../../../theme";
import type { InventorySummary } from "../../inventory/types";

interface DashboardMetricsProps {
  summary: InventorySummary;
  onPressInventory: () => void;
  loading?: boolean;
  error?: boolean;
}

interface Metric {
  id: string;
  label: string;
  Icon: LucideIcon;
  iconColor: string;
  quietWhenZero?: boolean;
  isZero: boolean;
  value: string;
  valueColor: string;
  subtitle: string;
  pill: { bg: string; fg: string; border: string };
  a11y: string;
}

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({
  summary,
  onPressInventory,
  loading = false,
  error = false,
}) => {
  const kiloTotal = Math.round(summary.unitTotals?.kilo || 0);
  const sackTotal = Math.round(summary.unitTotals?.sack || 0);
  const pileTotal = Math.round(summary.unitTotals?.pile || 0);

  const metrics: Metric[] = [
    {
      id: "active",
      label: "Selling Now",
      Icon: ClipboardList,
      iconColor: colors.primary,
      isZero: summary.activeCount === 0,
      value: String(summary.activeCount),
      valueColor: colors.text,
      subtitle: "Buyers can see these",
      pill: { bg: "#F9FAFB", fg: colors.textMuted, border: "#E5E7EB" },
      a11y: "Selling now produce count",
    },
    {
      id: "low",
      label: "Running Low",
      Icon: TriangleAlert,
      iconColor: colors.warning,
      quietWhenZero: true,
      isZero: summary.lowStockCount === 0,
      value: String(summary.lowStockCount),
      valueColor: colors.text,
      subtitle: "Add more soon",
      pill: { bg: "#FFF7ED", fg: colors.warning, border: "#FED7AA" },
      a11y: "Running low produce count",
    },
    {
      id: "out",
      label: "Out of Stock",
      Icon: PackageX,
      iconColor: colors.error,
      quietWhenZero: true,
      isZero: summary.outOfStockCount === 0,
      value: String(summary.outOfStockCount),
      valueColor: colors.text,
      subtitle: "Nothing left",
      pill: { bg: "#FEF2F2", fg: colors.error, border: "#FECACA" },
      a11y: "Out of stock produce count",
    },
    {
      id: "ready",
      label: "Ready to Sell",
      Icon: Scale,
      iconColor: colors.primary,
      isZero: kiloTotal === 0,
      value: `${kiloTotal} kg`,
      valueColor: colors.primaryPressed,
      subtitle: `${sackTotal} sacks · ${pileTotal} piles`,
      pill: { bg: "#F9FAFB", fg: colors.textMuted, border: "#E5E7EB" },
      a11y: "Ready to sell total quantity",
    },
  ];

  return (
    <View style={styles.section}>
      <Text style={styles.heading}>Your Stock Now</Text>
      <View style={styles.grid}>
        {metrics.map((m) => {
          if (loading) {
            return (
              <SkeletonCard key={m.id} style={styles.card}>
                <SkeletonBlock width="55%" height={12} />
                <SkeletonBlock width="35%" height={24} radius={8} />
                <SkeletonBlock width="75%" height={18} radius={9} />
              </SkeletonCard>
            );
          }
          const quiet = error || (m.quietWhenZero && m.isZero);
          const neutralPill = { bg: "#F9FAFB", fg: colors.textMuted, border: "#E5E7EB" };
          const pill = quiet ? neutralPill : m.pill;
          return (
          <Pressable
            key={m.id}
            onPress={onPressInventory}
            accessibilityRole="button"
            accessibilityLabel={m.a11y}
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          >
            <View style={styles.cardTop}>
              <Text style={styles.cardLabel} numberOfLines={1}>{m.label}</Text>
              <m.Icon size={18} color={error ? colors.textMuted : m.iconColor} />
            </View>
            <Text style={[styles.cardValue, { color: error ? colors.textMuted : m.valueColor }]} numberOfLines={1} adjustsFontSizeToFit>{error ? "—" : m.value}</Text>
            <View style={[styles.pill, { backgroundColor: pill.bg, borderColor: pill.border }]}>
              <Text style={[styles.pillText, { color: pill.fg }]}>{error ? "Unavailable" : m.subtitle}</Text>
            </View>
          </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: { marginBottom: spacing.lg },
  heading: { ...typography.sectionHeading, fontFamily: fonts.heading.bold, color: colors.text, marginBottom: spacing.sm },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  card: { width: "48.5%", backgroundColor: colors.surface, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border, padding: spacing.md, minHeight: 112, justifyContent: "space-between", ...shadows.card },
  cardTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.xs },
  cardLabel: { ...typography.labelSmall, flex: 1, color: colors.textMuted },
  cardValue: { ...typography.largeTitle, marginVertical: spacing.xs },
  cardSubtitle: { ...typography.labelSmall, color: colors.textMuted },
  pill: { alignSelf: "flex-start", borderWidth: 1, borderRadius: radii.full, paddingHorizontal: spacing.sm, paddingVertical: 2 },
  pillText: { ...typography.caption },
  cardPressed: { transform: [{ scale: 0.98 }], opacity: 0.9 },
});
