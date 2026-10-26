import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { Check, Key } from "lucide-react-native";
import { colors, fonts, spacing } from "../../../theme";
import { CardComponent } from "../../../components/CardComponent";
import { InputComponent } from "../../../components/InputComponent";
import { ButtonComponent } from "../../../components/ButtonComponent";

interface Props {
  totpURI: string;
  secretKey: string | null;
  confirmCode: string;
  confirmCodeError: string | null;
  loading: boolean;
  onChangeCode: (text: string) => void;
  onVerify: () => void;
  onCancel: () => void;
}

export function TotpScanQrCard({
  totpURI,
  secretKey,
  confirmCode,
  confirmCodeError,
  loading,
  onChangeCode,
  onVerify,
  onCancel,
}: Props) {
  return (
    <CardComponent style={styles.card}>
      <Text style={styles.cardTitle}>Set Up Authenticator</Text>
      <Text style={styles.cardInstruction}>
        Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.):
      </Text>

      <View style={styles.qrContainer}>
        <QRCode value={totpURI} size={180} color={colors.primary} backgroundColor={colors.white} />
      </View>

      {secretKey ? (
        <View style={styles.secretBox}>
          <Text style={styles.secretLabel}>Manual Setup Key:</Text>
          <Text style={styles.secretCode} selectable>{secretKey}</Text>
        </View>
      ) : null}

      <Text style={styles.cardInstruction}>
        Enter the 6-digit verification code from your authenticator app:
      </Text>

      <InputComponent
        label="6-Digit Verification Code"
        placeholder="123456"
        keyboardType="number-pad"
        maxLength={6}
        leftIcon={<Key size={18} color={colors.textMuted} />}
        value={confirmCode}
        error={confirmCodeError}
        onChangeText={onChangeCode}
      />

      <ButtonComponent
        title="Verify & Activate"
        icon={<Check size={16} color={colors.white} />}
        onPress={onVerify}
        loading={loading}
        style={styles.actionBtn}
      />

      <ButtonComponent title="Cancel" variant="ghost" onPress={onCancel} style={styles.cancelBtn} />
    </CardComponent>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing.base },
  cardTitle: { fontFamily: fonts.heading.semiBold, fontSize: 17, color: colors.text, marginBottom: spacing.xs },
  cardInstruction: { fontSize: 13, color: colors.textMuted, marginBottom: spacing.md, lineHeight: 18 },
  qrContainer: { alignItems: "center", justifyContent: "center", padding: spacing.base, backgroundColor: colors.white, borderRadius: 12, borderWidth: 1, borderColor: colors.border, alignSelf: "center", marginBottom: spacing.md },
  secretBox: { backgroundColor: colors.primarySurface, padding: spacing.sm, borderRadius: 8, alignItems: "center", marginBottom: spacing.base },
  secretLabel: { fontSize: 11, color: colors.textMuted, textTransform: "uppercase", fontWeight: "600", marginBottom: 2 },
  secretCode: { fontSize: 15, fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace", color: colors.primary, fontWeight: "700" },
  actionBtn: { marginTop: spacing.xs },
  cancelBtn: { marginTop: spacing.xs },
});
