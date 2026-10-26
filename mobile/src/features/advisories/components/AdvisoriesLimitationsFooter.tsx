import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { fonts, radii, spacing } from "../../../theme";

export const AdvisoriesLimitationsFooter: React.FC = () => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Important Limitations</Text>
      <Text style={styles.text}>
        Outdoor weather and public holiday advisories are provided as general operational context only. They do not determine actual product freshness, spoilage, or food safety. They do not automatically deactivate listings or cancel reservations. Physical inspection remains the seller's responsibility.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: radii.card || 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: spacing.base,
    marginBottom: spacing.xxl,
  },
  title: {
    fontFamily: fonts.heading.bold,
    fontSize: 13,
    color: "#0F172A",
    marginBottom: 4,
  },
  text: {
    fontFamily: fonts.body.regular,
    fontSize: 11,
    lineHeight: 17,
    color: "#64748B",
  },
});
