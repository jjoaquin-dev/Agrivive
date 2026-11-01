import React from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { AlertCircle, Camera, ShieldCheck } from "lucide-react-native";
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

function initialsOf(name: string) {
  const letters = name.trim().split(/\s+/).slice(0, 2).map((word) => word[0]?.toUpperCase() ?? "");
  return letters.join("") || "S";
}

export function ProfileHeroCard({ shopName, sellerName, avatarUrl, isVerified, memberSince, uploadingAvatar, onPickAvatar, onEditProfile }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Pressable onPress={onPickAvatar} disabled={uploadingAvatar} accessibilityRole="button" accessibilityLabel="Change profile picture" style={styles.avatarWrap}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarFallback]}><Text style={styles.initials}>{initialsOf(sellerName)}</Text></View>
          )}
          <View style={styles.cameraBadge}>
            {uploadingAvatar ? <ActivityIndicator size="small" color={colors.primary} /> : <Camera size={14} color={colors.primary} />}
          </View>
        </Pressable>
        <View style={styles.text}>
          <Text style={styles.shop} numberOfLines={2}>{shopName}</Text>
          <Text style={styles.owner} numberOfLines={1}>{sellerName}</Text>
          <View style={[styles.pill, isVerified ? styles.pillOk : styles.pillWarn]}>
            {isVerified ? <ShieldCheck size={13} color={profileColors.mintText} /> : <AlertCircle size={13} color={profileColors.amberText} />}
            <Text style={[styles.pillText, { color: isVerified ? profileColors.mintText : profileColors.amberText }]}>{isVerified ? "Verified Seller" : "Not Verified Yet"}</Text>
          </View>
          {uploadingAvatar ? <Text style={styles.uploading}>Uploading photo...</Text> : null}
          <Text style={styles.since}>Selling on Agrivive since {memberSince}</Text>
        </View>
      </View>
      <Pressable onPress={onEditProfile} accessibilityRole="button" accessibilityLabel="Edit profile" style={({ pressed }) => [styles.edit, pressed && styles.editPressed]}>
        <Text style={styles.editText}>Edit Profile</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radii.sheet, borderWidth: 1, borderColor: profileColors.border, padding: spacing.base, marginBottom: spacing.base },
  row: { flexDirection: "row", alignItems: "flex-start" },
  avatarWrap: { marginRight: spacing.md },
  avatar: { width: 76, height: 76, borderRadius: 38 },
  avatarFallback: { backgroundColor: colors.terracotta, alignItems: "center", justifyContent: "center" },
  initials: { fontFamily: fonts.heading.bold, fontSize: 26, color: colors.white },
  cameraBadge: { position: "absolute", right: -2, bottom: -2, width: 28, height: 28, borderRadius: 14, backgroundColor: colors.white, borderWidth: 1, borderColor: profileColors.border, alignItems: "center", justifyContent: "center" },
  text: { flex: 1 },
  shop: { fontFamily: fonts.heading.bold, fontSize: 18, color: colors.text },
  owner: { fontFamily: fonts.body.regular, fontSize: 14, color: colors.textMuted, marginTop: 2 },
  pill: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start", gap: 5, borderRadius: radii.full, paddingHorizontal: 10, paddingVertical: 4, marginTop: spacing.xs },
  pillOk: { backgroundColor: profileColors.mint },
  pillWarn: { backgroundColor: profileColors.amber },
  pillText: { fontFamily: fonts.body.semiBold, fontSize: 12 },
  uploading: { fontFamily: fonts.body.medium, fontSize: 12, color: profileColors.amberText, marginTop: spacing.xs },
  since: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted, marginTop: spacing.xs },
  edit: { minHeight: 52, borderRadius: radii.button, borderWidth: 1.5, borderColor: colors.primary, alignItems: "center", justifyContent: "center", marginTop: spacing.base },
  editPressed: { backgroundColor: colors.primaryLight },
  editText: { fontFamily: fonts.body.semiBold, fontSize: 16, color: colors.primary },
});
