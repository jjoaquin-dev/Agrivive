import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";

interface ProfileVerificationCardProps {
  isVerified: boolean;
  sellerType: string;
  verifiedSince: string;
  isActive: boolean;
  onRequestReview: () => void;
}

export const ProfileVerificationCard: React.FC<ProfileVerificationCardProps> = ({
  isVerified,
  sellerType,
  verifiedSince,
  isActive,
  onRequestReview,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>VERIFICATION & ACCOUNT STATUS</Text>

      {/* Status Banner */}
      {isVerified ? (
        <View style={styles.verifiedBanner}>
          <CheckCircle2 size={18} color="#16A34A" />
          <View style={styles.bannerTextWrap}>
            <Text style={styles.bannerTitle}>Verified Seller</Text>
            <Text style={styles.bannerSubtitle}>
              Your seller credentials and market stall were reviewed and approved.
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.unverifiedBanner}>
          <AlertTriangle size={18} color="#D97706" />
          <View style={styles.bannerTextWrap}>
            <Text style={styles.bannerTitleWarning}>Pending Verification</Text>
            <Text style={styles.bannerSubtitleWarning}>
              Complete email verification and stall profile to receive verified status.
            </Text>
          </View>
        </View>
      )}

      {/* Field Rows */}
      <View style={styles.row}>
        <Text style={styles.label}>Classification</Text>
        <Text style={styles.value}>{`${sellerType.charAt(0).toUpperCase() + sellerType.slice(1)}-Vendor`}</Text>
      </View>
      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.label}>Verified Since</Text>
        <Text style={styles.value}>{verifiedSince}</Text>
      </View>
      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.label}>Account Status</Text>
        <Text style={[styles.value, isActive ? styles.activeStatus : styles.inactiveStatus]}>
          {isActive ? "Active" : "Suspended"}
        </Text>
      </View>

      <Text style={styles.footerNote}>
        Your seller classification was approved during account verification and cannot be changed directly.
      </Text>

      <Pressable
        onPress={onRequestReview}
        accessibilityRole="button"
        accessibilityLabel="Request classification review"
        style={styles.reviewLink}
      >
        <Text style={styles.reviewLinkText}>Request Trust & Classification Review</Text>
        <ArrowRight size={13} color="#16A34A" />
      </Pressable>
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
  cardTitle: {
    fontFamily: fonts.heading.bold,
    fontSize: 11,
    color: "#64748B",
    letterSpacing: 0.8,
    marginBottom: spacing.sm,
  },
  verifiedBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.xs,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    borderRadius: 12,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  unverifiedBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.xs,
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FDE68A",
    borderRadius: 12,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  bannerTextWrap: {
    flex: 1,
  },
  bannerTitle: {
    fontFamily: fonts.heading.bold,
    fontSize: 13,
    color: "#065F46",
  },
  bannerSubtitle: {
    fontFamily: fonts.body.regular,
    fontSize: 11,
    lineHeight: 16,
    color: "#047857",
    marginTop: 1,
  },
  bannerTitleWarning: {
    fontFamily: fonts.heading.bold,
    fontSize: 13,
    color: "#92400E",
  },
  bannerSubtitleWarning: {
    fontFamily: fonts.body.regular,
    fontSize: 11,
    lineHeight: 16,
    color: "#B45309",
    marginTop: 1,
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
  },
  activeStatus: {
    color: "#16A34A",
  },
  inactiveStatus: {
    color: "#DC2626",
  },
  footerNote: {
    fontFamily: fonts.body.regular,
    fontSize: 11,
    lineHeight: 16,
    color: "#94A3B8",
    marginTop: spacing.sm,
  },
  reviewLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: spacing.xs,
  },
  reviewLinkText: {
    fontFamily: fonts.body.semiBold,
    fontSize: 12,
    color: "#16A34A",
  },
});
