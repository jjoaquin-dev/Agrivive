import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import {
  Clock,
  TriangleAlert,
  MessageCircle,
  Thermometer,
  Megaphone,
  RefreshCw,
} from "lucide-react-native";
import { fonts, radii, spacing } from "../../../theme";

interface DashboardAttentionGridProps {
  expiringCount: number;
  lowStockCount: number;
  openMessageCount: number;
  contentReadyCount: number;
  onPressExpiring: () => void;
  onPressLowStock: () => void;
  onPressMessages: () => void;
  onPressWeather: () => void;
  onPressContent: () => void;
  onPressUpdate: () => void;
}

export const DashboardAttentionGrid: React.FC<DashboardAttentionGridProps> = ({
  expiringCount,
  lowStockCount,
  openMessageCount,
  contentReadyCount,
  onPressExpiring,
  onPressLowStock,
  onPressMessages,
  onPressWeather,
  onPressContent,
  onPressUpdate,
}) => {
  const items = [
    {
      id: "expiring",
      label: expiringCount > 0 ? `${expiringCount} Expiring` : "Expiring Soon",
      icon: <Clock size={22} color="#DC2626" />,
      bg: "#FEF2F2",
      textColor: "#DC2626",
      onPress: onPressExpiring,
    },
    {
      id: "lowStock",
      label: lowStockCount > 0 ? `${lowStockCount} Low Stock` : "Low Stock",
      icon: <TriangleAlert size={22} color="#D97706" />,
      bg: "#FFFBEB",
      textColor: "#D97706",
      onPress: onPressLowStock,
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
      id: "weather",
      label: "Weather Alert",
      icon: <Thermometer size={22} color="#EA580C" />,
      bg: "#FFF7ED",
      textColor: "#EA580C",
      onPress: onPressWeather,
    },
    {
      id: "content",
      label: contentReadyCount > 0 ? `${contentReadyCount} Boost Ready` : "Content Ready",
      icon: <Megaphone size={22} color="#16A34A" />,
      bg: "#F0FDF4",
      textColor: "#16A34A",
      onPress: onPressContent,
    },
    {
      id: "update",
      label: "Update Needed",
      icon: <RefreshCw size={22} color="#0284C7" />,
      bg: "#F0F9FF",
      textColor: "#0284C7",
      onPress: onPressUpdate,
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
