import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Flame } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import { PlatformBadge } from "./PlatformBadge";
import { surface } from "../../../theme/surface";

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
    borderColor: "#F3F1EC",
    padding: spacing.base,
    ...surface.shadow,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  text: { flex: 1, fontFamily: fonts.body.medium, fontSize: 14, lineHeight: 20, color: colors.text },
  badges: { flexDirection: "row", alignItems: "center", gap: 6 },
});
