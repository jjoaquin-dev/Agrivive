import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Lightbulb, Settings } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";

interface Props {
  guideOpen: boolean;
  onSettings: () => void;
  onGuide: () => void;
}

/** Two clearly labelled buttons: Settings for the things you can change, and the guide for how buyers find you (Recognition over Recall, Nielsen). */
export function MarketingToolbar({ guideOpen, onSettings, onGuide }: Props) {
  return (
    <View style={styles.row}>
      <Pressable onPress={onSettings} accessibilityRole="button" accessibilityLabel="Settings: automatic price drops" style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
        <Settings size={18} color={colors.primary} />
        <Text style={styles.text}>Settings</Text>
      </Pressable>
      <Pressable onPress={onGuide} accessibilityRole="button" accessibilityState={{ selected: guideOpen }} style={({ pressed }) => [styles.button, guideOpen && styles.selected, pressed && styles.pressed]}>
        <Lightbulb size={18} color={colors.primary} />
        <Text style={styles.text} numberOfLines={1}>How buyers find you</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.base },
  button: { flex: 1, minHeight: 48, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm, paddingHorizontal: spacing.sm, backgroundColor: colors.surface, borderRadius: radii.button, borderWidth: 1, borderColor: colors.border },
  selected: { backgroundColor: colors.primaryLight, borderColor: colors.primary },
  pressed: { opacity: 0.8 },
  text: { fontFamily: fonts.body.semiBold, fontSize: 13, color: colors.text, flexShrink: 1 },
});
