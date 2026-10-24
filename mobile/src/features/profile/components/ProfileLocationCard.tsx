import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { MapPickerComponent, type Coordinates } from "../../../components/MapPickerComponent";
import { colors, fonts, radii, spacing } from "../../../theme";

interface ProfileLocationCardProps {
  coordinates: Coordinates;
  marketName: string;
  detailAddress: string;
  pickupInstructions?: string | null;
  onEdit: () => void;
}

export const ProfileLocationCard: React.FC<ProfileLocationCardProps> = ({
  coordinates,
  marketName,
  detailAddress,
  pickupInstructions,
  onEdit,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.cardTitle}>PRIMARY BUSINESS LOCATION</Text>
        <Pressable onPress={onEdit} accessibilityRole="button" accessibilityLabel="Edit location info">
          <Text style={styles.editBtn}>Edit</Text>
        </Pressable>
      </View>

      {/* Map Preview */}
      <View style={styles.mapContainer}>
        <MapPickerComponent
          initialCoordinates={coordinates}
          height={140}
          readOnly
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Market</Text>
        <Text style={styles.value} numberOfLines={1}>{marketName}</Text>
      </View>
      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.label}>Stall & Landmark</Text>
        <Text style={styles.value} numberOfLines={2}>{detailAddress}</Text>
      </View>
      <View style={styles.divider} />

      {pickupInstructions ? (
        <>
          <View style={styles.row}>
            <Text style={styles.label}>Pickup Note</Text>
            <Text style={styles.value} numberOfLines={2}>{pickupInstructions}</Text>
          </View>
          <View style={styles.divider} />
        </>
      ) : null}

      <View style={styles.row}>
        <Text style={styles.label}>City</Text>
        <Text style={styles.value}>Davao City, Philippines</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: radii.card || 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
    marginBottom: spacing.base,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  cardTitle: {
    fontFamily: fonts.heading.bold,
    fontSize: 11,
    color: "#64748B",
    letterSpacing: 0.8,
  },
  editBtn: {
    fontFamily: fonts.body.semiBold,
    fontSize: 13,
    color: "#16A34A",
  },
  mapContainer: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 4,
  },
  label: {
    fontFamily: fonts.body.regular,
    fontSize: 13,
    color: "#64748B",
  },
  value: {
    fontFamily: fonts.heading.bold,
    fontSize: 13,
    color: "#0F172A",
    maxWidth: "60%",
    textAlign: "right",
  },
});
