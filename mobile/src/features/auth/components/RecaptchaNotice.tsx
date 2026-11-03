import React from "react";
import { StyleSheet, Text, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { ShieldCheck } from "lucide-react-native";
import { colors, fonts, spacing } from "../../../theme";
import { recaptchaSiteKey } from "../recaptcha";

const open = (url: string) => WebBrowser.openBrowserAsync(url);

/** Google's badge lives inside a hidden web view, so the app shows the required notice itself. Only when the check is on. */
export function RecaptchaNotice() {
  if (!recaptchaSiteKey) return null;
  return (
    <View style={styles.row} accessibilityRole="text">
      <ShieldCheck size={16} color={colors.textMuted} style={styles.icon} />
      <Text style={styles.text}>
        Protected by reCAPTCHA. Google{" "}
        <Text style={styles.link} onPress={() => open("https://policies.google.com/privacy")} accessibilityRole="link">Privacy Policy</Text>
        {" "}and{" "}
        <Text style={styles.link} onPress={() => open("https://policies.google.com/terms")} accessibilityRole="link">Terms of Service</Text>
        {" "}apply.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "flex-start", justifyContent: "center", gap: spacing.sm, marginTop: spacing.lg, paddingHorizontal: spacing.base },
  icon: { marginTop: 0.5 },
  text: { flexShrink: 1, fontFamily: fonts.body.regular, fontSize: 12, lineHeight: 17, color: colors.textMuted, textAlign: "left" },
  link: { fontFamily: fonts.body.semiBold, textDecorationLine: "underline" },
});
