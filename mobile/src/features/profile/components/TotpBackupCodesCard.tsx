import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Check, Copy } from "lucide-react-native";
import { colors, fonts, spacing } from "../../../theme";
import { CardComponent } from "../../../components/CardComponent";
import { ButtonComponent } from "../../../components/ButtonComponent";

interface Props {
  backupCodes: string[];
  copiedCodes: boolean;
  onCopyCodes: () => void;
  onFinish: () => void;
}

export function TotpBackupCodesCard({
  backupCodes,
  copiedCodes,
  onCopyCodes,
  onFinish,
}: Props) {
  return (
    <CardComponent style={styles.card}>
      <Text style={styles.cardTitle}>Save Your Backup Codes</Text>
      <Text style={styles.cardInstruction}>
        If you lose access to your phone or authenticator app, you can use these one-time codes to sign in. Each code can be used only once.
      </Text>

      <View style={styles.backupCodesList}>
        {backupCodes.map((code, index) => (
          <View key={index} style={styles.codeItem}>
            <Text style={styles.codeText} selectable>{code}</Text>
          </View>
        ))}
      </View>

      <ButtonComponent
        title={copiedCodes ? "Codes Copied" : "Copy All Codes"}
        icon={copiedCodes ? <Check size={16} color={colors.primary} /> : <Copy size={16} color={colors.primary} />}
        variant="secondary"
        onPress={onCopyCodes}
        style={styles.copyBtn}
      />

      <ButtonComponent
        title="I Have Saved My Backup Codes"
        onPress={onFinish}
        style={styles.actionBtn}
      />
    </CardComponent>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing.base },
  cardTitle: { fontFamily: fonts.heading.semiBold, fontSize: 17, color: colors.text, marginBottom: spacing.xs },
  cardInstruction: { fontSize: 13, color: colors.textMuted, marginBottom: spacing.md, lineHeight: 18 },
  backupCodesList: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", backgroundColor: "rgba(0,0,0,0.02)", padding: spacing.sm, borderRadius: 8, marginBottom: spacing.md },
  codeItem: { width: "48%", backgroundColor: colors.surface, paddingVertical: spacing.xs, paddingHorizontal: spacing.sm, borderRadius: 6, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.xs, alignItems: "center" },
  codeText: { fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace", fontSize: 13, color: colors.text, fontWeight: "600" },
  actionBtn: { marginTop: spacing.xs },
  copyBtn: { marginBottom: spacing.sm },
});
