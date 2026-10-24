import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { fonts, radii, spacing } from "../../../theme";

interface ProfileBusinessInfoCardProps {
  businessName: string;
  ownerName: string;
  marketName: string;
  email: string;
  sellerId: string;
  onEdit: () => void;
}

export const ProfileBusinessInfoCard: React.FC<ProfileBusinessInfoCardProps> = ({
  businessName,
  ownerName,
  marketName,
  email,
  sellerId,
  onEdit,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.cardTitle}>BUSINESS INFORMATION</Text>
        <Pressable onPress={onEdit} accessibilityRole="button" accessibilityLabel="Edit business info">
          <Text style={styles.editBtn}>Edit</Text>
        </Pressable>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Business Name</Text>
        <Text style={styles.value} numberOfLines={1}>{businessName}</Text>
      </View>
      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.label}>Owner</Text>
        <Text style={styles.value} numberOfLines={1}>{ownerName}</Text>
      </View>
      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.label}>Market</Text>
        <Text style={styles.value} numberOfLines={1}>{marketName}</Text>
      </View>
      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.label}>Account Email</Text>
        <Text style={styles.value} numberOfLines={1}>{email}</Text>
      </View>
      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.label}>Seller ID</Text>
        <Text style={styles.valueMono}>{sellerId}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: radii.card || 16,
    borderWidth: 1,
    borderColor: "#E5E2DA",
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
  valueMono: {
    fontFamily: fonts.body.semiBold,
    fontSize: 12,
    color: "#334155",
  },
});
