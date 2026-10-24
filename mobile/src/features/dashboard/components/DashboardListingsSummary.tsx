import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { fonts, radii, spacing } from "../../../theme";

interface DashboardListingsSummaryProps {
  activeCount: number;
  draftCount: number;
  reservedCount: number;
  soldOutCount: number;
  onViewAll: () => void;
}

export const DashboardListingsSummary: React.FC<DashboardListingsSummaryProps> = ({
  activeCount,
  draftCount,
  reservedCount,
  soldOutCount,
  onViewAll,
}) => {
  return (
    <View style={styles.section}>
      <Text style={styles.heading}>My Listings</Text>
      <Text style={styles.subheading}>Your surplus product listings</Text>

      <View style={styles.pillsRow}>
        <View style={[styles.pill, { backgroundColor: "#DCFCE7" }]}>
          <Text style={[styles.pillNumber, { color: "#16A34A" }]}>{activeCount}</Text>
          <Text style={[styles.pillLabel, { color: "#16A34A" }]}>Active</Text>
        </View>

        <View style={[styles.pill, { backgroundColor: "#F1F5F9" }]}>
          <Text style={[styles.pillNumber, { color: "#475569" }]}>{draftCount}</Text>
          <Text style={[styles.pillLabel, { color: "#475569" }]}>Draft</Text>
        </View>

        <View style={[styles.pill, { backgroundColor: "#EEF2FF" }]}>
          <Text style={[styles.pillNumber, { color: "#4F46E5" }]}>{reservedCount}</Text>
          <Text style={[styles.pillLabel, { color: "#4F46E5" }]}>Reserved</Text>
        </View>

        <View style={[styles.pill, { backgroundColor: "#FEE2E2" }]}>
          <Text style={[styles.pillNumber, { color: "#DC2626" }]}>{soldOutCount}</Text>
          <Text style={[styles.pillLabel, { color: "#DC2626" }]}>Sold Out</Text>
        </View>
      </View>

      <Pressable
        onPress={onViewAll}
        accessibilityRole="button"
        accessibilityLabel="View all product listings"
        style={({ pressed }) => [styles.actionButton, pressed && styles.buttonPressed]}
      >
        <Text style={styles.actionText}>View All Listings</Text>
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
