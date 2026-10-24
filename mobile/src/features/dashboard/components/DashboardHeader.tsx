import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { Bell, MapPin, Check, Sprout } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";

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
  const hasNotifs = unreadCount > 0;
  const locationLabel = detailAddress || shopName || "Bankerohan Public Market";
  
  const initials = sellerName
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "S";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning,";
    if (hour < 18) return "Good afternoon,";
    return "Good evening,";
  };

  return (
    <View style={styles.header}>
      {/* Top Brand Bar */}
      <View style={styles.topBar}>
        <View style={styles.brandGroup}>
          <View style={styles.logoRow}>
            <View style={styles.logoCircle}>
              <Sprout size={16} color="#FFFFFF" strokeWidth={2.5} />
            </View>
            <Text style={styles.brandTitle}>Agrivive</Text>
          </View>
          <View style={styles.locationRow}>
            <MapPin size={11} color={colors.textMuted} style={styles.locationIcon} />
            <Text style={styles.locationText} numberOfLines={1}>{locationLabel}</Text>
          </View>
        </View>

        <View style={styles.topActions}>
          <Pressable
            onPress={onPressNotifications}
            accessibilityRole="button"
            accessibilityLabel={hasNotifs ? `${unreadCount} unread notifications` : "Notifications"}
            style={styles.bellButton}
          >
            <Bell size={20} color={colors.text} />
            {hasNotifs ? <View style={styles.redDot} /> : null}
          </Pressable>

          <Pressable
            onPress={onPressProfile}
            accessibilityRole="button"
            accessibilityLabel="Seller Profile"
            style={styles.avatarButton}
          >
            <Text style={styles.avatarText}>{initials}</Text>
          </Pressable>
        </View>
      </View>

      {/* Greeting & Seller Name */}
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
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  brandGroup: {
    flex: 1,
    marginRight: spacing.sm,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  logoCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#16A34A",
    alignItems: "center",
    justifyContent: "center",
  },
  brandTitle: {
    fontFamily: fonts.heading.bold,
    fontSize: 18,
    color: "#16A34A",
    letterSpacing: -0.3,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    paddingLeft: 2,
  },
  locationIcon: {
    marginRight: 3,
  },
  locationText: {
    fontFamily: fonts.body.regular,
    fontSize: 11,
    color: colors.textMuted,
  },
  topActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  bellButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  redDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
    borderWidth: 1.5,
    borderColor: "#F1F5F9",
  },
  avatarButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#34D399",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontFamily: fonts.heading.bold,
    fontSize: 13,
    color: "#064E3B",
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
