import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { FileText } from "lucide-react-native";
import { fonts, radii, spacing } from "../../../theme";
import type { SellerAnalyticsMetrics } from "../../analytics/types";
import type { Product } from "../../inventory/types";
import { DashboardAnalyticsChart } from "./DashboardAnalyticsChart";

interface DashboardAnalyticsSectionProps {
  metrics: SellerAnalyticsMetrics | null;
  summaryText: string | null;
  selectedPeriod: "today" | "7d" | "30d";
  onChangePeriod: (period: "today" | "7d" | "30d") => void;
  onFullView: () => void;
  products: Product[];
}

export const DashboardAnalyticsSection: React.FC<DashboardAnalyticsSectionProps> = ({
  metrics,
  summaryText,
  selectedPeriod,
  onChangePeriod,
  onFullView,
  products,
}) => {
  const postedDisplay = metrics?.postedQuantity || "0 kg";
  const soldDisplay = metrics?.completedQuantity || "0 kg";
  const sellThroughDisplay = metrics?.sellThroughRate != null
    ? `${metrics.sellThroughRate.toFixed(1)}%`
    : "0.0%";

  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <Text style={styles.heading}>Analytics</Text>
          <Text style={styles.subheading}>Historical surplus marketplace activity</Text>
        </View>
        <Pressable
          onPress={onFullView}
          accessibilityRole="button"
          accessibilityLabel="Full analytics view"
          style={styles.fullViewButton}
        >
          <Text style={styles.fullViewText}>Full View</Text>
        </Pressable>
      </View>

      <View style={styles.periodRow}>
        {(["today", "7d", "30d"] as const).map((p) => (
          <Pressable
            key={p}
            onPress={() => onChangePeriod(p)}
            style={[styles.periodPill, selectedPeriod === p && styles.periodPillActive]}
          >
            <Text style={[styles.periodText, selectedPeriod === p && styles.periodTextActive]}>
              {p === "today" ? "Today" : p === "7d" ? "Last 7 Days" : "Last 30 Days"}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.kpiRow}>
        <View style={[styles.kpiCard, { backgroundColor: "#F8FAFC" }]}>
          <Text style={[styles.kpiValue, { color: "#1E293B" }]}>{postedDisplay}</Text>
          <Text style={styles.kpiLabel}>Posted</Text>
        </View>
        <View style={[styles.kpiCard, { backgroundColor: "#ECFDF5" }]}>
          <Text style={[styles.kpiValue, { color: "#16A34A" }]}>{soldDisplay}</Text>
          <Text style={styles.kpiLabel}>Sold</Text>
        </View>
        <View style={[styles.kpiCard, { backgroundColor: "#EEF2FF" }]}>
          <Text style={[styles.kpiValue, { color: "#4F46E5" }]}>{sellThroughDisplay}</Text>
          <Text style={styles.kpiLabel}>Sell-Through</Text>
        </View>
      </View>

      <DashboardAnalyticsChart products={products} />

      <View style={styles.insightBanner}>
        <FileText size={16} color="#D97706" style={styles.insightIcon} />
        <Text style={styles.insightText}>
          {summaryText || "Surplus produce sell-through is tracked across 7-day pickup cycles to optimize daily market listings."}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 14,
    marginBottom: spacing.base,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  titleWrap: {
    flex: 1,
    marginRight: 8,
  },
  heading: {
    fontFamily: fonts.heading.bold,
    fontSize: 16,
    color: "#1E1E1E",
  },
  subheading: {
    fontFamily: fonts.body.regular,
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  fullViewButton: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.full,
  },
  fullViewText: {
    fontFamily: fonts.body.semiBold,
    fontSize: 11,
    color: "#16A34A",
  },
  periodRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  periodPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.full,
    backgroundColor: "#F1F5F9",
  },
  periodPillActive: {
    backgroundColor: "#0F920F",
  },
  periodText: {
    fontFamily: fonts.body.medium,
    fontSize: 12,
    color: "#64748B",
  },
  periodTextActive: {
    color: "#FFFFFF",
    fontFamily: fonts.body.semiBold,
  },
  kpiRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  kpiCard: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  kpiValue: {
    fontFamily: fonts.heading.bold,
    fontSize: 15,
    marginBottom: 2,
  },
  kpiLabel: {
    fontFamily: fonts.body.medium,
    fontSize: 11,
    color: "#64748B",
  },
  insightBanner: {
    flexDirection: "row",
    backgroundColor: "#FEFCE8",
    borderWidth: 1,
    borderColor: "#FEF08A",
    borderRadius: 12,
    padding: 10,
    gap: 8,
    marginTop: 4,
  },
  insightIcon: {
    marginTop: 2,
  },
  insightText: {
    flex: 1,
    fontFamily: fonts.body.regular,
    fontSize: 11,
    color: "#854D0E",
    lineHeight: 16,
  },
});
