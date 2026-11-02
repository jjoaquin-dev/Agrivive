import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Check } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import { openLegalPage } from "../../legal/legalLinks";

interface Props {
  checked: boolean;
  error?: string;
  onChange: (checked: boolean) => void;
}

export function TermsConsent({ checked, error, onChange }: Props) {
  return (
    <View>
      <View style={styles.row}>
        <Pressable
          onPress={() => onChange(!checked)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked }}
          accessibilityLabel="I agree to the Terms of Use and Privacy Policy"
          hitSlop={12}
          style={[styles.box, checked && styles.boxChecked, !!error && styles.boxError]}
        >
          {checked ? <Check size={16} color={colors.white} /> : null}
        </Pressable>
        <Text style={styles.text}>
          I agree to the{" "}
          <Text style={styles.link} onPress={() => openLegalPage("terms")} accessibilityRole="link">Terms of Use</Text>
          {" "}and{" "}
          <Text style={styles.link} onPress={() => openLegalPage("privacy")} accessibilityRole="link">Privacy Policy</Text>.
        </Text>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm },
  box: {
    width: 24,
    height: 24,
    borderRadius: radii.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  boxChecked: { backgroundColor: colors.primary, borderColor: colors.primary },
  boxError: { borderColor: colors.error },
  text: { flex: 1, fontFamily: fonts.body.regular, fontSize: 13, lineHeight: 19, color: colors.textMuted },
  link: { fontFamily: fonts.body.semiBold, color: colors.primary, textDecorationLine: "underline" },
  error: { marginTop: spacing.xs, fontFamily: fonts.body.regular, fontSize: 12, color: colors.error },
});
