import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, radii, spacing } from "../../../theme";

export function ConversationDateDivider({ label }: { label: string }) {
  return (
    <View style={styles.row}>
      <View style={styles.chip}>
        <Text style={styles.text}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { alignItems: "center", marginVertical: spacing.md },
  chip: { backgroundColor: colors.border, borderRadius: radii.full, paddingHorizontal: spacing.md, paddingVertical: 4 },
  text: { fontFamily: fonts.body.medium, fontSize: 12, color: colors.textMuted },
});
