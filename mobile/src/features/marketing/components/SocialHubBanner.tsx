import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Flame } from "lucide-react-native";
import { colors, fonts, radii, shadows, spacing } from "../../../theme";
import { PlatformBadge } from "./PlatformBadge";

/** Says where a boost goes, in the same words on every tab of the Boost hub. */
export function SocialHubBanner() {
  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Flame size={22} color={colors.terracotta} />
      </View>
      <Text style={styles.text}>Share your produce on the Agrivive Facebook and Instagram pages for free.</Text>
      <View style={styles.badges}>
        <PlatformBadge platform="facebook" size={22} />
        <PlatformBadge platform="instagram" size={22} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
    ...shadows.card,
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: radii.card,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  text: { flex: 1, fontFamily: fonts.body.regular, fontSize: 13, lineHeight: 20, color: colors.textMuted },
  badges: { flexDirection: "row", alignItems: "center", gap: 6 },
});
