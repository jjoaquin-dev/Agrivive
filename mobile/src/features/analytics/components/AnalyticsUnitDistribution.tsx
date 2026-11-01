import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import { cardStyles } from "../analyticsCard";
import type { InventorySummary } from "../../inventory/types";

interface AnalyticsUnitDistributionProps {
  summary: InventorySummary | null;
}

export function AnalyticsUnitDistribution({ summary }: AnalyticsUnitDistributionProps) {
  const kilo = summary?.unitTotals?.kilo || 0;
  const sack = summary?.unitTotals?.sack || 0;
  const pile = summary?.unitTotals?.pile || 0;
  const totalUnits = kilo + sack + pile;

  const kiloPct = totalUnits > 0 ? (kilo / totalUnits) * 100 : 0;
  const sackPct = totalUnits > 0 ? (sack / totalUnits) * 100 : 0;
  const pilePct = totalUnits > 0 ? (pile / totalUnits) * 100 : 0;

  return (
    <View style={cardStyles.card}>
      <View style={styles.header}>
        <Text style={cardStyles.title}>Stock Right Now</Text>
        <Text style={cardStyles.subtitle}>All produce, today</Text>
      </View>

      {totalUnits > 0 ? (
        <>
          {/* Segmented Progress Bar */}
          <View style={styles.progressBar}>
            {kiloPct > 0 && (
              <View style={[styles.progressSegment, { flex: kiloPct, backgroundColor: colors.primary }]} />
            )}
            {sackPct > 0 && (
              <View style={[styles.progressSegment, { flex: sackPct, backgroundColor: colors.sage }]} />
            )}
            {pilePct > 0 && (
              <View style={[styles.progressSegment, { flex: pilePct, backgroundColor: colors.terracotta }]} />
            )}
          </View>

          {/* Unit Legend Rows */}
          <View style={styles.legendContainer}>
            <View style={styles.unitRow}>
              <View style={styles.unitInfo}>
                <View style={[styles.colorSquare, { backgroundColor: colors.primary }]} />
                <Text style={styles.unitName}>Kilos</Text>
              </View>
              <View style={styles.unitValues}>
                <Text style={styles.unitAmount}>{kilo.toLocaleString()} kg</Text>
                <Text style={styles.unitPercent}>{kiloPct.toFixed(0)}%</Text>
              </View>
            </View>

            <View style={styles.unitRow}>
              <View style={styles.unitInfo}>
                <View style={[styles.colorSquare, { backgroundColor: colors.sage }]} />
                <Text style={styles.unitName}>Sacks</Text>
              </View>
              <View style={styles.unitValues}>
                <Text style={styles.unitAmount}>{sack.toLocaleString()} sacks</Text>
                <Text style={styles.unitPercent}>{sackPct.toFixed(0)}%</Text>
              </View>
            </View>

            <View style={styles.unitRow}>
              <View style={styles.unitInfo}>
                <View style={[styles.colorSquare, { backgroundColor: colors.terracotta }]} />
                <Text style={styles.unitName}>Piles</Text>
              </View>
              <View style={styles.unitValues}>
                <Text style={styles.unitAmount}>{pile.toLocaleString()} piles</Text>
                <Text style={styles.unitPercent}>{pilePct.toFixed(0)}%</Text>
              </View>
            </View>
          </View>
        </>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No produce in stock right now.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {},
  progressBar: {
    height: 10,
    flexDirection: "row",
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: colors.surfaceMuted,
    marginVertical: spacing.md,
  },
  progressSegment: { height: "100%" },
  legendContainer: { gap: spacing.sm },
  unitRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 2,
  },
  unitInfo: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  colorSquare: { width: 12, height: 12, borderRadius: 3 },
  unitName: { fontFamily: fonts.body.medium, fontSize: 13, color: colors.text },
  unitValues: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  unitAmount: { fontFamily: fonts.body.semiBold, fontSize: 13, color: colors.text },
  unitPercent: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted, minWidth: 42, textAlign: "right" },
  emptyState: { paddingVertical: spacing.md, alignItems: "center" },
  emptyText: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted },
});
