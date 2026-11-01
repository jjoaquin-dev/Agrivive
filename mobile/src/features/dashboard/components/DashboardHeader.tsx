import React from "react";
import { Image, StyleSheet, View, Text, Pressable } from "react-native";
import { Bell, Store, Check } from "lucide-react-native";
import { colors, fonts, radii, spacing, touchTargets, typography } from "../../../theme";

interface DashboardHeaderProps {
  sellerName: string;
  shopName?: string | null;
  isVerified?: boolean;
  avatarUrl?: string | null;
  unreadCount: number;
  openMessageCount: number;
  onPressNotifications: () => void;
  onPressProfile: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  sellerName,
  shopName,
  isVerified = false,
  avatarUrl,
  unreadCount,
  onPressNotifications,
  onPressProfile,
}) => {
  const hasNotifs = unreadCount > 0;
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
      <Pressable
        onPress={onPressProfile}
        accessibilityRole="button"
        accessibilityLabel={isVerified ? "Seller Profile, verified" : "Seller Profile"}
        style={styles.avatarButton}
      >
        {avatarUrl ? <Image source={{ uri: avatarUrl }} style={styles.avatarImage} accessibilityIgnoresInvertColors /> : <Text style={styles.avatarText}>{initials}</Text>}
        {isVerified ? (
          <View style={styles.verifiedBadge}>
            <Check size={10} color={colors.white} strokeWidth={3} />
          </View>
        ) : null}
      </Pressable>

      <View style={styles.identity}>
        <Text style={styles.greetingText}>{getGreeting()}</Text>
        <Text style={styles.sellerName} numberOfLines={1}>{sellerName}</Text>
        {shopName ? (
          <View style={styles.locationRow}>
            <Store size={12} color={colors.primary} />
            <Text style={styles.locationText} numberOfLines={1}>{shopName}</Text>
          </View>
        ) : null}
      </View>

      <Pressable
        onPress={onPressNotifications}
        accessibilityRole="button"
        accessibilityLabel={hasNotifs ? `${unreadCount} unread notifications` : "Notifications"}
        style={styles.bellButton}
      >
        <Bell size={20} color={colors.text} />
        {hasNotifs ? <View style={styles.redDot} /> : null}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.base },
  avatarButton: { width: touchTargets.min, height: touchTargets.min, borderRadius: radii.full, backgroundColor: colors.primaryLight, alignItems: "center", justifyContent: "center" },
  avatarImage: { width: touchTargets.min, height: touchTargets.min, borderRadius: radii.full },
  avatarText: { fontFamily: fonts.heading.bold, fontSize: 15, color: colors.primaryPressed },
  verifiedBadge: { position: "absolute", right: -2, bottom: -2, width: 16, height: 16, borderRadius: 8, backgroundColor: colors.primary, borderWidth: 1.5, borderColor: colors.white, alignItems: "center", justifyContent: "center" },
  identity: { flex: 1 },
  greetingText: { ...typography.labelSmall, color: colors.textMuted },
  sellerName: { ...typography.sectionHeading, color: colors.text },
  locationRow: { flexDirection: "row", alignItems: "center", gap: spacing.xs, marginTop: 2 },
  locationText: { ...typography.labelSmall, flex: 1, color: colors.textMuted },
  bellButton: { width: touchTargets.min - 4, height: touchTargets.min - 4, borderRadius: radii.full, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" },
  redDot: { position: "absolute", top: 9, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.error },
});
