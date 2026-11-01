import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors, fonts, spacing } from "../../../theme";

/** Shown under the header while the live connection is down (Visibility of System Status, Nielsen). */
export function ConversationReconnectBanner() {
  return (
    <View style={styles.banner} accessibilityRole="alert">
      <ActivityIndicator size="small" color="#B45309" />
      <Text style={styles.text}>Reconnecting… new messages may be late.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm, backgroundColor: "#FEF3C7", borderBottomWidth: 1, borderBottomColor: "#FDE68A", paddingVertical: spacing.sm, paddingHorizontal: spacing.base },
  text: { fontFamily: fonts.body.medium, fontSize: 13, color: "#92400E" },
});
