import React from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { AlertCircle, Camera, Pencil, ShieldCheck } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import { profileColors } from "../profileTokens";

interface Props {
  shopName: string;
  sellerName: string;
  avatarUrl?: string | null;
  isVerified: boolean;
  memberSince: string;
  uploadingAvatar: boolean;
  onPickAvatar: () => void;
  onEditProfile: () => void;
}

const AVATAR = 112;

function initialsOf(name: string) {
  const letters = name.trim().split(/\s+/).slice(0, 2).map((word) => word[0]?.toUpperCase() ?? "");
  return letters.join("") || "S";
}

/** The seller's identity, centered on the page with no card: photo, stall name, owner, verified pill, member since. The pencil edits the profile. */
export function ProfileHeroCard({ shopName, sellerName, avatarUrl, isVerified, memberSince, uploadingAvatar, onPickAvatar, onEditProfile }: Props) {
  return (
    <View style={styles.wrap}>
      <Pressable onPress={onEditProfile} accessibilityRole="button" accessibilityLabel="Edit profile" hitSlop={4} style={({ pressed }) => [styles.pencil, pressed && styles.pencilPressed]}>
        <Pencil size={18} color={colors.primary} />
      </Pressable>
      <Pressable onPress={onPickAvatar} disabled={uploadingAvatar} accessibilityRole="button" accessibilityLabel="Change profile picture" style={styles.avatarWrap}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}><Text style={styles.initials}>{initialsOf(sellerName)}</Text></View>
        )}
        <View style={styles.cameraBadge}>
          {uploadingAvatar ? <ActivityIndicator size="small" color={colors.primary} /> : <Camera size={16} color={colors.primary} />}
        </View>
      </Pressable>
      <Text style={styles.shop} numberOfLines={2}>{shopName}</Text>
      <Text style={styles.owner} numberOfLines={1}>{sellerName}</Text>
      <View style={[styles.pill, isVerified ? styles.pillOk : styles.pillWarn]}>
        {isVerified ? <ShieldCheck size={14} color={profileColors.mintText} /> : <AlertCircle size={14} color={profileColors.amberText} />}
        <Text style={[styles.pillText, { color: isVerified ? profileColors.mintText : profileColors.amberText }]}>{isVerified ? "Verified Seller" : "Not Verified Yet"}</Text>
      </View>
      {uploadingAvatar ? <Text style={styles.uploading}>Uploading photo...</Text> : null}
      <Text style={styles.since}>Selling on Agrivive since {memberSince}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", paddingTop: spacing.sm, paddingBottom: spacing.lg, marginBottom: spacing.sm },
  pencil: { position: "absolute", top: 0, right: 0, width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primaryLight, alignItems: "center", justifyContent: "center", zIndex: 1 },
  pencilPressed: { opacity: 0.8 },
  avatarWrap: { marginBottom: spacing.md },
  avatar: { width: AVATAR, height: AVATAR, borderRadius: AVATAR / 2 },
  avatarFallback: { backgroundColor: colors.terracotta, alignItems: "center", justifyContent: "center" },
  initials: { fontFamily: fonts.heading.bold, fontSize: 38, color: colors.white },
  cameraBadge: { position: "absolute", right: 0, bottom: 0, width: 34, height: 34, borderRadius: 17, backgroundColor: colors.white, borderWidth: 1, borderColor: profileColors.border, alignItems: "center", justifyContent: "center" },
  shop: { fontFamily: fonts.heading.bold, fontSize: 22, lineHeight: 28, color: colors.text, textAlign: "center", paddingHorizontal: spacing.xl },
  owner: { fontFamily: fonts.body.regular, fontSize: 15, color: colors.textMuted, marginTop: 2, textAlign: "center" },
  pill: { flexDirection: "row", alignItems: "center", gap: 5, borderRadius: radii.full, paddingHorizontal: 12, paddingVertical: 5, marginTop: spacing.sm },
  pillOk: { backgroundColor: profileColors.mint },
  pillWarn: { backgroundColor: profileColors.amber },
  pillText: { fontFamily: fonts.body.semiBold, fontSize: 13 },
  uploading: { fontFamily: fonts.body.medium, fontSize: 12, color: profileColors.amberText, marginTop: spacing.xs },
  since: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted, marginTop: spacing.sm },
});
