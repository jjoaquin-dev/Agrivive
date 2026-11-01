import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { AlertTriangle, Check, Copy, Info } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import { profileColors } from "../profileTokens";

interface Props {
  backupCodes: string[];
  copiedCodes: boolean;
  onCopyCodes: () => void;
}

export function TotpBackupCodesCard({ backupCodes, copiedCodes, onCopyCodes }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Save your backup codes</Text>
      <Text style={styles.text}>If you lose your phone or code app, you can use these one-time codes to sign in.</Text>
      <View style={styles.warn}>
        <AlertTriangle size={18} color={profileColors.amberText} />
        <Text style={styles.warnText}>Each code works once. Keep them somewhere safe.</Text>
      </View>
      <View style={styles.grid}>
        {backupCodes.map((code) => <Text key={code} style={styles.code} selectable>{code}</Text>)}
      </View>
      <View style={styles.actions}>
        <Pressable onPress={onCopyCodes} accessibilityRole="button" style={styles.copy}>
          <Copy size={16} color={colors.primary} />
          <Text style={styles.copyText}>Copy All</Text>
        </Pressable>
        {copiedCodes ? <View style={styles.copied}><Check size={14} color={profileColors.mintText} /><Text style={styles.copiedText}>Copied!</Text></View> : null}
      </View>
      {copiedCodes ? (
        <View style={styles.note}>
          <Info size={16} color={colors.textMuted} />
          <Text style={styles.noteText}>Codes were copied to your clipboard. Store them in a password manager or notes.</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radii.sheet, borderWidth: 1, borderColor: profileColors.border, padding: spacing.lg },
  title: { fontFamily: fonts.heading.bold, fontSize: 20, color: colors.text },
  text: { fontFamily: fonts.body.regular, fontSize: 15, lineHeight: 22, color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.base },
  warn: { flexDirection: "row", gap: spacing.sm, alignItems: "center", backgroundColor: "#FFFBEB", borderWidth: 1, borderColor: profileColors.amberBorder, borderRadius: radii.button, padding: spacing.md },
  warnText: { flex: 1, fontFamily: fonts.body.medium, fontSize: 14, lineHeight: 20, color: "#92400E" },
  grid: { flexDirection: "row", flexWrap: "wrap", backgroundColor: "#F3F1EA", borderWidth: 1, borderColor: profileColors.border, borderRadius: radii.button, paddingVertical: spacing.sm, marginTop: spacing.base },
  code: { width: "50%", paddingVertical: spacing.sm, paddingHorizontal: spacing.base, fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace", fontSize: 15, fontWeight: "600", color: colors.text },
  actions: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: spacing.base },
  copy: { flexDirection: "row", alignItems: "center", gap: 6, minHeight: 44, paddingHorizontal: spacing.base, borderRadius: radii.button, borderWidth: 1.5, borderColor: colors.primary },
  copyText: { fontFamily: fonts.body.semiBold, fontSize: 14, color: colors.primary },
  copied: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: profileColors.mint, borderRadius: radii.full, paddingHorizontal: 12, paddingVertical: 6 },
  copiedText: { fontFamily: fonts.body.semiBold, fontSize: 13, color: profileColors.mintText },
  note: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.base, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: profileColors.border },
  noteText: { flex: 1, fontFamily: fonts.body.regular, fontSize: 13, lineHeight: 19, color: colors.textMuted },
});
