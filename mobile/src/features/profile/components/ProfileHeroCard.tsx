import React from "react";
import { StyleSheet, View, Text, Pressable, Image, ActivityIndicator } from "react-native";
import { Camera, Check, Pencil, Shield } from "lucide-react-native";
import { fonts, radii, spacing } from "../../../theme";

interface ProfileHeroCardProps {
  shopName: string;
  sellerName: string;
  sellerType: string;
  avatarUrl?: string | null;
  isVerified: boolean;
  memberSince: string;
  profileComplete: boolean;
  trustPoints?: number;
  uploadingAvatar: boolean;
  onPickAvatar: () => void;
  onEditProfile: () => void;
  onSecurity: () => void;
}

export const ProfileHeroCard: React.FC<ProfileHeroCardProps> = ({
  shopName,
  sellerName,
  sellerType,
  avatarUrl,
  isVerified,
  memberSince,
  profileComplete,
  trustPoints = 100,
  uploadingAvatar,
  onPickAvatar,
  onEditProfile,
  onSecurity,
}) => {
  const initials = sellerName ? sellerName[0].toUpperCase() : "S";

  return (
    <View style={styles.card}>
      {/* Top Identity Row */}
      <View style={styles.identityRow}>
        <Pressable
          onPress={onPickAvatar}
          disabled={uploadingAvatar}
          accessibilityRole="button"
          accessibilityLabel="Change profile picture"
          style={styles.avatarWrapper}
        >
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
          )}
          <View style={styles.cameraBadge}>
            {uploadingAvatar ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Camera size={12} color="#064E3B" />
            )}
          </View>
        </Pressable>

        <View style={styles.identityText}>
          <Text style={styles.shopName} numberOfLines={1}>
            {shopName}
          </Text>
          <View style={styles.badgeRow}>
            {isVerified ? (
              <View style={styles.verifiedPill}>
                <Check size={11} color="#22C55E" strokeWidth={3} />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            ) : (
              <View style={styles.unverifiedPill}>
                <Text style={styles.unverifiedText}>Pending Verification</Text>
              </View>
            )}
          </View>
          <Text style={styles.sellerName}>{sellerName}</Text>
          <Text style={styles.subInfo} numberOfLines={1}>
            {`${sellerType.toUpperCase()} · ${shopName}`}
          </Text>
        </View>
      </View>

      {/* 3 Metric Pills */}
      <View style={styles.statsRow}>
        <View style={styles.statPill}>
          <Text style={styles.statValue}>{profileComplete ? "100%" : "85%"}</Text>
          <Text style={styles.statLabel}>Profile Complete</Text>
        </View>

        <View style={styles.statPill}>
          <Text style={styles.statValue}>{memberSince}</Text>
          <Text style={styles.statLabel}>Member Since</Text>
        </View>

        <View style={styles.statPill}>
          <Text style={styles.statValue}>{`${trustPoints} pts`}</Text>
          <Text style={styles.statLabel}>Trust Score</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsRow}>
        <Pressable
          onPress={onEditProfile}
          accessibilityRole="button"
          accessibilityLabel="Edit stall profile"
          style={styles.actionBtn}
        >
          <Pencil size={14} color="#FFFFFF" />
          <Text style={styles.actionBtnText}>Edit Profile</Text>
        </Pressable>

        <Pressable
          onPress={onSecurity}
          accessibilityRole="button"
          accessibilityLabel="Open security settings"
          style={[styles.actionBtn, styles.actionBtnSecondary]}
        >
          <Shield size={14} color="#FFFFFF" />
          <Text style={styles.actionBtnText}>Security Settings</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: "#14532D", borderRadius: radii.card || 20, padding: spacing.base, marginBottom: spacing.base },
  identityRow: { flexDirection: "row", alignItems: "center" },
  avatarWrapper: { position: "relative", marginRight: spacing.md },
  avatarImage: { width: 68, height: 68, borderRadius: 34, borderWidth: 2, borderColor: "#34D399" },
  avatarFallback: { width: 68, height: 68, borderRadius: 34, backgroundColor: "#34D399", alignItems: "center", justifyContent: "center" },
  avatarText: { fontFamily: fonts.heading.bold, fontSize: 26, color: "#064E3B" },
  cameraBadge: { position: "absolute", bottom: -2, right: -2, backgroundColor: "#FFFFFF", width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: "#14532D" },
  identityText: { flex: 1 },
  shopName: { fontFamily: fonts.heading.bold, fontSize: 18, color: "#FFFFFF" },
  badgeRow: { flexDirection: "row", marginTop: 2 },
  verifiedPill: { flexDirection: "row", alignItems: "center", gap: 3, backgroundColor: "rgba(34, 197, 94, 0.2)", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  verifiedText: { fontFamily: fonts.body.semiBold, fontSize: 11, color: "#4ADE80" },
  unverifiedPill: { backgroundColor: "rgba(234, 179, 8, 0.2)", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  unverifiedText: { fontFamily: fonts.body.semiBold, fontSize: 11, color: "#FDE047" },
  sellerName: { fontFamily: fonts.body.semiBold, fontSize: 13, color: "rgba(255, 255, 255, 0.9)", marginTop: 2 },
  subInfo: { fontFamily: fonts.body.regular, fontSize: 11, color: "rgba(255, 255, 255, 0.7)" },
  statsRow: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.base },
  statPill: { flex: 1, backgroundColor: "rgba(255, 255, 255, 0.12)", borderRadius: 12, paddingVertical: 8, alignItems: "center" },
  statValue: { fontFamily: fonts.heading.bold, fontSize: 14, color: "#FFFFFF" },
  statLabel: { fontFamily: fonts.body.regular, fontSize: 10, color: "rgba(255, 255, 255, 0.7)", marginTop: 1 },
  actionsRow: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.md },
  actionBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, backgroundColor: "rgba(255, 255, 255, 0.22)", borderRadius: 10, paddingVertical: 9 },
  actionBtnSecondary: { backgroundColor: "rgba(255, 255, 255, 0.12)" },
  actionBtnText: { fontFamily: fonts.body.semiBold, fontSize: 12, color: "#FFFFFF" },
});
