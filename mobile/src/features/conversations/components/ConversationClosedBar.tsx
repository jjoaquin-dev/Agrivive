import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Lock } from "lucide-react-native";
import { colors, fonts, spacing } from "../../../theme";

/** Replaces the message box when the chat is closed, and says why in plain words. */
export function ConversationClosedBar({ reason }: { reason: string }) {
  return (
    <View style={styles.bar}>
      <View style={styles.title}>
        <Lock size={18} color={colors.textMuted} />
        <Text style={styles.titleText}>This chat is closed.</Text>
      </View>
      <Text style={styles.reason}>{reason}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { backgroundColor: colors.surfaceMuted, borderTopWidth: 1, borderTopColor: colors.border, paddingVertical: spacing.base, paddingHorizontal: spacing.base, alignItems: "center", gap: 4 },
  title: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  titleText: { fontFamily: fonts.heading.bold, fontSize: 16, color: colors.text },
  reason: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, color: colors.textMuted, textAlign: "center" },
});
