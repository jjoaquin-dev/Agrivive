import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, spacing } from "../../../theme";
import { StallHoursEditor, type HoursDay } from "./StallHoursEditor";

/** Opening hours step inside first-time setup. The same editor as Stall Hours in the menu. */
export function StallHoursSetupSection({ days, onChange, error }: { days: HoursDay[]; onChange: (weekday: number, patch: Partial<HoursDay>) => void; error?: string }) {
  return (
    <View style={styles.section}>
      <Text style={styles.label}>Opening Hours</Text>
      <Text style={styles.hint}>Buyers can only reserve pickup times inside these hours. You can change them later in Stall Hours.</Text>
      <StallHoursEditor days={days} onChange={onChange} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: spacing.base },
  label: { fontFamily: fonts.body.medium, fontSize: 14, color: colors.text, marginBottom: 2 },
  hint: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted, marginBottom: spacing.xs },
  error: { fontFamily: fonts.body.medium, fontSize: 12, color: colors.error, marginTop: spacing.xs },
});
