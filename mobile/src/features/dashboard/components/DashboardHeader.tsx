import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Check } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import { DashboardHeaderBrand } from "./DashboardHeaderBrand";

interface DashboardHeaderProps {
  sellerName: string;
  shopName?: string | null;
  detailAddress?: string | null;
  isVerified?: boolean;
  unreadCount: number;
  onPressNotifications: () => void;
  onPressProfile: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  sellerName,
  shopName,
  detailAddress,
  isVerified = true,
  unreadCount,
  onPressNotifications,
  onPressProfile,
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning,";
    if (hour < 18) return "Good afternoon,";
    return "Good evening,";
  };

  return (
    <View style={styles.header}>
      <DashboardHeaderBrand
        sellerName={sellerName}
        shopName={shopName}
        detailAddress={detailAddress}
        unreadCount={unreadCount}
        onPressNotifications={onPressNotifications}
        onPressProfile={onPressProfile}
      />

      <View style={styles.greetingSection}>
        <Text style={styles.greetingText}>{getGreeting()}</Text>
        <View style={styles.nameRow}>
          <Text style={styles.sellerName} numberOfLines={1}>{sellerName}</Text>
          {isVerified ? (
            <View style={styles.verifiedBadge}>
              <Check size={11} color="#FFFFFF" strokeWidth={3} />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.roleSubtitle}>
          Supplier-Vendor · Manage your surplus products today.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.base,
  },
  greetingSection: {
    marginTop: spacing.xs,
  },
  greetingText: {
    fontFamily: fonts.body.regular,
    fontSize: 13,
    color: colors.textMuted,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
  },
  sellerName: {
    fontFamily: fonts.heading.bold,
    fontSize: 22,
    color: colors.text,
    letterSpacing: -0.4,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#16A34A",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.full,
  },
  verifiedText: {
    fontFamily: fonts.body.semiBold,
    fontSize: 11,
    color: "#FFFFFF",
  },
  roleSubtitle: {
    fontFamily: fonts.body.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
});
