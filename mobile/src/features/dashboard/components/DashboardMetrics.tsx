import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { ClipboardList, Package, SquareCheck, Leaf, ChevronRight } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";

interface DashboardMetricsProps {
  activeListingsCount: number;
  reservedLabel: string;
  completedPickupsCount: number;
  availableSurplusLabel: string;
  onPressListings: () => void;
  onPressReservations: () => void;
}

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({
  activeListingsCount,
  reservedLabel,
  completedPickupsCount,
  availableSurplusLabel,
  onPressListings,
  onPressReservations,
}) => {
  return (
    <View style={styles.grid}>
      {/* 1. Active Listings */}
      <Pressable
        onPress={onPressListings}
        accessibilityRole="button"
        accessibilityLabel="Active listings"
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      >
        <View style={styles.cardTop}>
          <ClipboardList size={18} color="#6B7280" />
          <ChevronRight size={14} color="#9CA3AF" />
        </View>
        <Text style={[styles.cardValue, { color: "#16A34A" }]}>
          {activeListingsCount}
        </Text>
        <Text style={styles.cardTitle}>Active Listings</Text>
        <Text style={styles.cardSubtitle}>Visible to buyers</Text>
      </Pressable>

      {/* 2. Reserved */}
      <Pressable
        onPress={onPressReservations}
        accessibilityRole="button"
        accessibilityLabel="Reserved orders"
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      >
        <View style={styles.cardTop}>
          <Package size={18} color="#6B7280" />
          <ChevronRight size={14} color="#9CA3AF" />
        </View>
        <Text style={[styles.cardValue, { color: "#4F46E5", fontSize: 16 }]} numberOfLines={1}>
          {reservedLabel}
        </Text>
        <Text style={styles.cardTitle}>Reserved</Text>
        <Text style={styles.cardSubtitle}>Held for pickup</Text>
      </Pressable>

      {/* 3. Completed Pickups */}
      <Pressable
        onPress={onPressReservations}
        accessibilityRole="button"
        accessibilityLabel="Completed pickups"
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      >
        <View style={styles.cardTop}>
          <SquareCheck size={18} color="#16A34A" />
          <ChevronRight size={14} color="#9CA3AF" />
        </View>
        <Text style={[styles.cardValue, { color: "#16A34A" }]}>
          {completedPickupsCount}
        </Text>
        <Text style={styles.cardTitle}>Completed Pickups</Text>
        <Text style={styles.cardSubtitle}>This week via QR</Text>
      </Pressable>

      {/* 4. Available Surplus */}
      <Pressable
        onPress={onPressListings}
        accessibilityRole="button"
        accessibilityLabel="Available surplus volume"
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      >
        <View style={styles.cardTop}>
          <Leaf size={18} color="#16A34A" />
          <ChevronRight size={14} color="#9CA3AF" />
        </View>
        <Text style={[styles.cardValue, { color: "#D97706", fontSize: 16 }]} numberOfLines={1}>
          {availableSurplusLabel}
        </Text>
        <Text style={styles.cardTitle}>Available Surplus</Text>
        <Text style={styles.cardSubtitle}>Across active listings</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.base,
  },
  card: {
    width: "48.5%",
    backgroundColor: "#FFFFFF",
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 12,
    minHeight: 110,
    justifyContent: "space-between",
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardValue: {
    fontFamily: fonts.heading.bold,
    fontSize: 20,
    marginTop: 8,
    marginBottom: 2,
    letterSpacing: -0.3,
  },
  cardTitle: {
    fontFamily: fonts.heading.bold,
    fontSize: 13,
    color: colors.text,
  },
  cardSubtitle: {
    fontFamily: fonts.body.regular,
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 1,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
});
