import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { LogOut } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import { profileColors } from "../profileTokens";

/** Kept apart from the settings and solid red, because it is the one action that ends the session (Von Restorff, isolation effect). */
export function ProfileLogoutButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel="Log out" style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <LogOut size={20} color={colors.white} />
      <Text style={styles.text}>Log Out</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: 52, borderRadius: radii.button, backgroundColor: profileColors.redSolid, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm, marginTop: spacing.sm, marginBottom: spacing.base },
  pressed: { opacity: 0.88 },
  text: { fontFamily: fonts.body.semiBold, fontSize: 16, color: colors.white },
});
