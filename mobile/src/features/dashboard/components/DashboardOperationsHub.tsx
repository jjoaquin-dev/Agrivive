import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import {
  TriangleAlert,
  MessageCircle,
  BarChart3,
  TrendingUp,
  History,
  AlertTriangle,
} from "lucide-react-native";
import { fonts, radii, spacing } from "../../../theme";

interface DashboardOperationsHubProps {
  lowStockCount?: number;
  openMessageCount?: number;
  onPressInventory: () => void;
  onPressMessages: () => void;
  onAnalytics: () => void;
  onMarketing: () => void;
  onActivity: () => void;
  onAdvisories: () => void;
}

export const DashboardOperationsHub: React.FC<DashboardOperationsHubProps> = ({
  lowStockCount = 0,
  openMessageCount = 0,
  onPressInventory,
  onPressMessages,
  onAnalytics,
  onMarketing,
  onActivity,
  onAdvisories,
}) => {
  const items = [
    {
      id: "lowStock",
      label: lowStockCount > 0 ? `${lowStockCount} Low Stock` : "Low Stock",
      icon: <TriangleAlert size={22} color="#D97706" />,
      bg: "#FFFBEB",
      textColor: "#D97706",
      onPress: onPressInventory,
    },
    {
      id: "messages",
      label: openMessageCount > 0 ? `${openMessageCount} Messages` : "Messages",
      icon: <MessageCircle size={22} color="#4F46E5" />,
      bg: "#EEF2FF",
      textColor: "#4F46E5",
      onPress: onPressMessages,
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: <BarChart3 size={22} color="#16A34A" />,
      bg: "#ECFDF5",
      textColor: "#16A34A",
      onPress: onAnalytics,
    },
    {
      id: "marketing",
      label: "Marketing",
      icon: <TrendingUp size={22} color="#EA580C" />,
      bg: "#FFF7ED",
      textColor: "#EA580C",
      onPress: onMarketing,
    },
    {
      id: "activity",
      label: "Change History",
      icon: <History size={22} color="#0284C7" />,
      bg: "#F0F9FF",
      textColor: "#0284C7",
      onPress: onActivity,
    },
    {
      id: "advisories",
      label: "Advisories",
      icon: <AlertTriangle size={22} color="#CA8A04" />,
      bg: "#FEFCE8",
      textColor: "#CA8A04",
      onPress: onAdvisories,
    },
  ];

  return (
    <View style={styles.section}>
      <Text style={styles.heading}>Needs Your Attention</Text>
      <Text style={styles.subheading}>Tap any item for details</Text>

      <View style={styles.grid}>
        {items.map((item) => (
          <Pressable
            key={item.id}
            onPress={item.onPress}
            accessibilityRole="button"
            accessibilityLabel={item.label}
            style={({ pressed }) => [
              styles.tile,
              { backgroundColor: item.bg },
              pressed && styles.tilePressed,
            ]}
          >
            <View style={styles.iconWrap}>{item.icon}</View>
            <Text style={[styles.tileLabel, { color: item.textColor }]} numberOfLines={2}>
              {item.label}
            </Text>
          </Pressable>
        ))}
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
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "space-between",
  },
  tile: {
    width: "31.5%",
    aspectRatio: 1.15,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  iconWrap: {
    marginBottom: 6,
  },
  tileLabel: {
    fontFamily: fonts.body.semiBold,
    fontSize: 11,
    textAlign: "center",
  },
  tilePressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.85,
  },
});
