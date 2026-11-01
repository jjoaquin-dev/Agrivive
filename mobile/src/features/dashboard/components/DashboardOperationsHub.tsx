import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { TrendingUp, History, Flame, CloudSun, ChevronRight } from "lucide-react-native";
import { colors, fonts, radii, shadows, spacing, typography } from "../../../theme";

interface DashboardOperationsHubProps {
  lowStockCount?: number;
  openMessageCount?: number;
  onPressInventory?: () => void;
  onPressMessages?: () => void;
  onAnalytics: () => void;
  onMarketing: () => void;
  onActivity: () => void;
  onAdvisories: () => void;
}

export const DashboardOperationsHub: React.FC<DashboardOperationsHubProps> = ({
  onAnalytics,
  onMarketing,
  onActivity,
  onAdvisories,
}) => {
  const items = [
    {
      id: "analytics",
      label: "Reports",
      icon: <TrendingUp size={18} color={colors.primary} />,
      iconBg: colors.primaryLight,
      onPress: onAnalytics,
    },
    {
      id: "marketing",
      label: "Promote",
      icon: <Flame size={18} color={colors.terracotta} />,
      iconBg: "rgba(201, 120, 80, 0.12)",
      onPress: onMarketing,
    },
    {
      id: "activity",
      label: "Change History",
      icon: <History size={18} color={colors.text} />,
      iconBg: "#F3F1EA",
      onPress: onActivity,
    },
    {
      id: "advisories",
      label: "Weather & Demand",
      icon: <CloudSun size={18} color={colors.warning} />,
      iconBg: "#FEF3C7",
      onPress: onAdvisories,
    },
  ];

  return (
    <View style={styles.section}>
      <Text style={styles.heading}>More Tools</Text>

      <View style={styles.grid}>
        {items.map((item) => (
          <Pressable
            key={item.id}
            onPress={item.onPress}
            accessibilityRole="button"
            accessibilityLabel={item.label}
            style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}
          >
            <View style={[styles.iconWrap, { backgroundColor: item.iconBg }]}>
              {item.icon}
            </View>
            <Text style={styles.tileLabel} numberOfLines={2}>{item.label}</Text>
            <ChevronRight size={16} color={colors.textMuted} />
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: { marginBottom: spacing.lg },
  heading: { ...typography.sectionHeading, fontFamily: fonts.heading.bold, color: colors.text, marginBottom: spacing.sm },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  tile: { width: "48.5%", height: 56, backgroundColor: colors.surface, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border, flexDirection: "row", alignItems: "center", paddingHorizontal: spacing.sm, ...shadows.card },
  iconWrap: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  tileLabel: { flex: 1, fontFamily: fonts.body.semiBold, fontSize: 14, color: colors.text, marginHorizontal: spacing.xs },
  tilePressed: { transform: [{ scale: 0.98 }], opacity: 0.9 },
});
