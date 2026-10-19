import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { BarChart3, TrendingUp, History, AlertTriangle, ArrowRight } from "lucide-react-native";
import { colors, fonts, radii, spacing, shadows } from "../../../theme";

interface DashboardOperationsHubProps {
  onAnalytics: () => void;
  onBoosts: () => void;
  onActivity: () => void;
  onAdvisories: () => void;
}

export const DashboardOperationsHub: React.FC<DashboardOperationsHubProps> = ({
  onAnalytics,
  onBoosts,
  onActivity,
  onAdvisories,
}) => {
  const hubItems = [
    {
      id: "analytics",
      label: "Analytics",
      sub: "Sales & Insights",
      icon: <BarChart3 size={20} color={colors.primary} />,
      iconBg: "rgba(31, 77, 58, 0.08)",
      onPress: onAnalytics,
    },
    {
      id: "boosts",
      label: "Boosts",
      sub: "Promote Produce",
      icon: <TrendingUp size={20} color={colors.terracotta} />,
      iconBg: "rgba(201, 120, 80, 0.12)",
      onPress: onBoosts,
    },
    {
      id: "activity",
      label: "Change History",
      sub: "Stock Audit Ledger",
      icon: <History size={20} color="#3F7D58" />,
      iconBg: "rgba(63, 125, 88, 0.12)",
      onPress: onActivity,
    },
    {
      id: "advisories",
      label: "Advisories",
      sub: "Market Alerts",
      icon: <AlertTriangle size={20} color={colors.warning} />,
      iconBg: "rgba(199, 149, 62, 0.15)",
      onPress: onAdvisories,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeading}>Operations Hub</Text>
      <View style={styles.grid}>
        {hubItems.map((item) => (
          <Pressable
            key={item.id}
            onPress={item.onPress}
            accessibilityRole="button"
            accessibilityLabel={item.label}
            style={({ pressed }) => [styles.hubCard, pressed && styles.cardPressed]}
          >
            <View style={[styles.iconWrap, { backgroundColor: item.iconBg }]}>
              {item.icon}
            </View>
            <View style={styles.textWrap}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.sub}>{item.sub}</Text>
            </View>
            <ArrowRight size={14} color={colors.textMuted} />
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.base,
  },
  sectionHeading: {
    fontFamily: fonts.heading.bold,
    fontSize: 18,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  hubCard: {
    width: "48.5%",
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...shadows.card,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
    backgroundColor: "rgba(31, 77, 58, 0.02)",
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  textWrap: {
    flex: 1,
    marginLeft: spacing.sm,
    marginRight: 4,
  },
  label: {
    fontFamily: fonts.body.semiBold,
    fontSize: 13,
    color: colors.text,
  },
  sub: {
    fontFamily: fonts.body.regular,
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 1,
  },
});
