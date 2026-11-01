import React, { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import QRCode from "react-native-qrcode-svg";
import { Check, Copy, HelpCircle } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import { profileColors } from "../profileTokens";

interface Props {
  totpURI: string;
  secretKey: string | null;
}

export function TotpScanQrCard({ totpURI, secretKey }: Props) {
  const [copied, setCopied] = useState(false);
  const copyKey = async () => {
    if (!secretKey) return;
    await Clipboard.setStringAsync(secretKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };
  return (
    <>
      <View style={styles.card}>
        <Text style={styles.title}>Scan this code in your app</Text>
        <Text style={styles.text}>Open Google Authenticator or your favorite code app and scan this QR code.</Text>
        <View style={styles.qr}><QRCode value={totpURI} size={180} color={colors.text} backgroundColor={colors.white} /></View>
        {secretKey ? (
          <>
            <View style={styles.rule} />
            <Text style={styles.manual}>Or enter this key manually:</Text>
            <View style={styles.keyBox}>
              <Text style={styles.key} selectable>{secretKey}</Text>
              <Pressable onPress={() => void copyKey()} accessibilityRole="button" accessibilityLabel="Copy key" style={styles.copy}>
                {copied ? <Check size={16} color={colors.primary} /> : <Copy size={16} color={colors.primary} />}
                <Text style={styles.copyText}>{copied ? "Copied" : "Copy Key"}</Text>
              </Pressable>
            </View>
            <Text style={styles.fine}>Key is case-insensitive. Spaces are ignored by authenticator apps.</Text>
          </>
        ) : null}
      </View>
      <View style={styles.help}>
        <HelpCircle size={18} color={colors.primary} />
        <Text style={styles.helpText}>Don't have an app yet? Install Google Authenticator or Authy from your phone's app store, then come back and scan.</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radii.sheet, borderWidth: 1, borderColor: profileColors.border, padding: spacing.lg },
  title: { fontFamily: fonts.heading.bold, fontSize: 20, color: colors.text },
  text: { fontFamily: fonts.body.regular, fontSize: 15, lineHeight: 22, color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.base },
  qr: { alignSelf: "center", padding: spacing.base, borderRadius: radii.sheet, borderWidth: 1, borderColor: profileColors.border, backgroundColor: colors.white },
  rule: { height: 1, backgroundColor: profileColors.border, marginVertical: spacing.base },
  manual: { fontFamily: fonts.body.medium, fontSize: 15, color: colors.text, marginBottom: spacing.sm },
  keyBox: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.sm, backgroundColor: "#F3F1EA", borderWidth: 1, borderColor: profileColors.border, borderRadius: radii.button, padding: spacing.sm, paddingLeft: spacing.md },
  key: { flex: 1, fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace", fontSize: 14, fontWeight: "700", color: colors.text },
  copy: { flexDirection: "row", alignItems: "center", gap: 6, minHeight: 44, paddingHorizontal: spacing.md, borderRadius: radii.button, borderWidth: 1.5, borderColor: colors.primary, backgroundColor: colors.white },
  copyText: { fontFamily: fonts.body.semiBold, fontSize: 14, color: colors.primary },
  fine: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted, marginTop: spacing.xs },
  help: { flexDirection: "row", gap: spacing.sm, alignItems: "flex-start", backgroundColor: "#FAFAF7", borderWidth: 1, borderColor: profileColors.border, borderRadius: radii.button, padding: spacing.md, marginTop: spacing.base },
  helpText: { flex: 1, fontFamily: fonts.body.regular, fontSize: 13, lineHeight: 19, color: colors.textMuted },
});
