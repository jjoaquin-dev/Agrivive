import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { fonts, radii, spacing } from "../../../theme";

interface DashboardReservationsSummaryProps {
  activeCount: number;
  expiringCount: number;
  completedCount: number;
  cancelledCount: number;
  onViewAll: () => void;
}

export const DashboardReservationsSummary: React.FC<DashboardReservationsSummaryProps> = ({
  activeCount,
  expiringCount,
  completedCount,
  cancelledCount,
  onViewAll,
}) => {
  return (
    <View style={styles.section}>
      <Text style={styles.heading}>Reservations</Text>
      <Text style={styles.subheading}>Upcoming buyer pickups</Text>

      <View style={styles.pillsRow}>
        <View style={[styles.pill, { backgroundColor: "#DCFCE7" }]}>
          <Text style={[styles.pillNumber, { color: "#16A34A" }]}>{activeCount}</Text>
          <Text style={[styles.pillLabel, { color: "#16A34A" }]}>Active</Text>
        </View>

        <View style={[styles.pill, { backgroundColor: "#FFEDD5" }]}>
          <Text style={[styles.pillNumber, { color: "#EA580C" }]}>{expiringCount}</Text>
          <Text style={[styles.pillLabel, { color: "#EA580C" }]}>Expiring</Text>
        </View>

        <View style={[styles.pill, { backgroundColor: "#F1F5F9" }]}>
          <Text style={[styles.pillNumber, { color: "#475569" }]}>{completedCount}</Text>
          <Text style={[styles.pillLabel, { color: "#475569" }]}>Completed</Text>
        </View>

        <View style={[styles.pill, { backgroundColor: "#FEE2E2" }]}>
          <Text style={[styles.pillNumber, { color: "#DC2626" }]}>{cancelledCount}</Text>
          <Text style={[styles.pillLabel, { color: "#DC2626" }]}>Cancelled</Text>
        </View>
      </View>

      <Pressable
        onPress={onViewAll}
        accessibilityRole="button"
        accessibilityLabel="View all buyer reservations"
        style={({ pressed }) => [styles.actionButton, pressed && styles.buttonPressed]}
      >
        <Text style={styles.actionText}>View All Reservations</Text>
        <ChevronRight size={16} color="#0F920F" />
      </Pressable>
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
  pillsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  pill: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  pillNumber: {
    fontFamily: fonts.heading.bold,
    fontSize: 18,
    marginBottom: 2,
  },
  pillLabel: {
    fontFamily: fonts.body.medium,
    fontSize: 11,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ECFDF5",
    borderRadius: radii.full,
    paddingVertical: 11,
    gap: 4,
  },
  actionText: {
    fontFamily: fonts.body.semiBold,
    fontSize: 13,
    color: "#0F920F",
  },
  buttonPressed: {
    opacity: 0.8,
  },
});
