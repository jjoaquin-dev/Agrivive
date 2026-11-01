import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Clock, RefreshCw } from "lucide-react-native";
import { OtpInputComponent } from "../../../components/OtpInputComponent";
import { colors, fonts, radii, spacing } from "../../../theme";
import { profileColors } from "../profileTokens";

interface Props {
  code: string;
  error: string | null;
  loading: boolean;
  onChange: (value: string) => void;
  onRescan: () => void;
}

export function TotpVerifyCard({ code, error, loading, onChange, onRescan }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Type the 6-digit code</Text>
      <Text style={styles.text}>Enter the 6-digit code shown in your authenticator app.</Text>
      <OtpInputComponent value={code} onChange={onChange} error={error} disabled={loading} />
      <View style={styles.tip}>
        <Clock size={18} color={colors.textMuted} />
        <Text style={styles.tipText}><Text style={styles.tipBold}>Tip: </Text>Enter the latest code before the 30-second timer resets in your app.</Text>
      </View>
      <View style={styles.rule} />
      <Text style={styles.fine}>Codes refresh every 30 seconds. Make sure your phone's time is set automatically.</Text>
      <Pressable onPress={onRescan} accessibilityRole="button" style={styles.rescan}>
        <RefreshCw size={14} color={colors.primary} />
        <Text style={styles.rescanText}>Rescan QR code instead</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radii.sheet, borderWidth: 1, borderColor: profileColors.border, padding: spacing.lg },
  title: { fontFamily: fonts.heading.bold, fontSize: 20, color: colors.text },
  text: { fontFamily: fonts.body.regular, fontSize: 15, lineHeight: 22, color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.lg },
  tip: { flexDirection: "row", gap: spacing.sm, backgroundColor: "#F3F1EA", borderRadius: radii.button, borderWidth: 1, borderColor: profileColors.border, padding: spacing.md, marginTop: spacing.base },
  tipText: { flex: 1, fontFamily: fonts.body.regular, fontSize: 13, lineHeight: 19, color: colors.textMuted },
  tipBold: { fontFamily: fonts.body.semiBold, color: colors.text },
  rule: { height: 1, backgroundColor: profileColors.border, marginVertical: spacing.base },
  fine: { textAlign: "center", fontFamily: fonts.body.regular, fontSize: 13, lineHeight: 19, color: colors.textMuted },
  rescan: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, minHeight: 44, marginTop: spacing.xs },
  rescanText: { fontFamily: fonts.body.semiBold, fontSize: 14, color: colors.primary },
});
