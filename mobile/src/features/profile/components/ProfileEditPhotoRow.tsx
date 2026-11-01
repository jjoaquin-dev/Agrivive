import React from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Camera, ImageIcon } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import { profileColors } from "../profileTokens";

interface Props {
  avatarUrl?: string | null;
  initial: string;
  uploading: boolean;
  onPress: () => void;
}

export function ProfileEditPhotoRow({ avatarUrl, initial, uploading, onPress }: Props) {
  return (
    <View style={styles.row}>
      <Pressable onPress={onPress} disabled={uploading} accessibilityRole="button" accessibilityLabel="Change profile picture">
        {avatarUrl ? <Image source={{ uri: avatarUrl }} style={styles.avatar} /> : <View style={[styles.avatar, styles.fallback]}><Text style={styles.initial}>{initial}</Text></View>}
        <View style={styles.badge}>{uploading ? <ActivityIndicator size="small" color={colors.white} /> : <Camera size={14} color={colors.white} />}</View>
      </Pressable>
      <View style={styles.side}>
        <Pressable onPress={onPress} disabled={uploading} accessibilityRole="button" style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}>
          <ImageIcon size={18} color={colors.primary} />
          <Text style={styles.btnText}>Change Photo</Text>
        </Pressable>
        <Text style={styles.hint}>{uploading ? "Uploading photo..." : "JPG, PNG or WebP under 5 MB"}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: spacing.base, marginBottom: spacing.lg },
  avatar: { width: 84, height: 84, borderRadius: 42, borderWidth: 2, borderColor: colors.white },
  fallback: { backgroundColor: colors.terracotta, alignItems: "center", justifyContent: "center" },
  initial: { fontFamily: fonts.heading.bold, fontSize: 28, color: colors.white },
  badge: { position: "absolute", right: 0, bottom: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primary, borderWidth: 2, borderColor: colors.white, alignItems: "center", justifyContent: "center" },
  side: { flex: 1, alignItems: "flex-start", gap: spacing.xs },
  btn: { flexDirection: "row", alignItems: "center", gap: spacing.sm, minHeight: 48, paddingHorizontal: spacing.base, borderRadius: radii.button, borderWidth: 1.5, borderColor: colors.primary, backgroundColor: colors.white },
  btnPressed: { backgroundColor: colors.primaryLight },
  btnText: { fontFamily: fonts.body.semiBold, fontSize: 15, color: colors.primary },
  hint: { fontFamily: fonts.body.regular, fontSize: 12, color: profileColors.slate },
});
