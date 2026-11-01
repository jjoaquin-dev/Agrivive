import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { colors, fonts, spacing } from "../../../theme";

interface AuthTextLinkProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

/** Quiet green text button for the "use another way" choices under the main button. */
export const AuthTextLink: React.FC<AuthTextLinkProps> = ({ label, onPress, disabled }) => (
  <Pressable onPress={onPress} disabled={disabled} accessibilityRole="button" accessibilityLabel={label} hitSlop={8} style={styles.link}>
    <Text style={styles.text}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  link: { alignItems: "center", justifyContent: "center", minHeight: 48, marginTop: spacing.base },
  text: { fontFamily: fonts.heading.bold, fontSize: 15, color: colors.primary },
});
