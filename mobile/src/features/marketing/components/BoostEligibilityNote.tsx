import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { CheckCircle2, Clock3 } from "lucide-react-native";
import { colors, fonts, spacing } from "../../../theme";

/** Says up front whether the seller can boost, so a "no" is never found out after tapping. */
export function BoostEligibilityNote({ canBoost, headline, message }: { canBoost: boolean; headline: string; message: string }) {
  const Icon = canBoost ? CheckCircle2 : Clock3;
  const tone = canBoost ? colors.success : colors.warning;
  return (
    <View style={styles.row} accessibilityRole="summary">
      <Icon size={26} color={tone} />
      <View style={styles.copy}>
        <Text style={styles.title}>{canBoost ? "You're all set!" : headline}</Text>
        <Text style={styles.text}>{canBoost ? "You can boost this product." : message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md, marginTop: spacing.base, paddingVertical: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
  copy: { flex: 1 },
  title: { fontFamily: fonts.heading.bold, fontSize: 16, color: colors.text },
  text: { fontFamily: fonts.body.regular, fontSize: 13, lineHeight: 19, color: colors.textMuted },
});
