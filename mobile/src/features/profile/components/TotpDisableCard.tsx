import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, spacing } from "../../../theme";
import { CardComponent } from "../../../components/CardComponent";
import { InputComponent } from "../../../components/InputComponent";
import { ButtonComponent } from "../../../components/ButtonComponent";

interface Props {
  disablePassword: string;
  disablePasswordError: string | null;
  loading: boolean;
  onChangePassword: (text: string) => void;
  onCancel: () => void;
  onConfirmDisable: () => void;
}

export function TotpDisableCard({
  disablePassword,
  disablePasswordError,
  loading,
  onChangePassword,
  onCancel,
  onConfirmDisable,
}: Props) {
  return (
    <CardComponent style={styles.card}>
      <Text style={styles.cardTitle}>Disable Two-Factor Authentication</Text>
      <Text style={styles.cardInstruction}>
        Enter your password to confirm disabling 2FA. Your account will no longer require a security code at sign-in.
      </Text>

      <InputComponent
        label="Confirm Password"
        placeholder="Enter your password"
        isPassword
        value={disablePassword}
        error={disablePasswordError}
        onChangeText={onChangePassword}
      />

      <View style={styles.buttonRow}>
        <ButtonComponent
          title="Cancel"
          variant="secondary"
          onPress={onCancel}
          style={styles.rowBtn}
        />
        <ButtonComponent
          title="Confirm Disable"
          variant="destructive"
          onPress={onConfirmDisable}
          loading={loading}
          style={styles.rowBtn}
        />
      </View>
    </CardComponent>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing.base },
  cardTitle: { fontFamily: fonts.heading.semiBold, fontSize: 17, color: colors.text, marginBottom: spacing.xs },
  cardInstruction: { fontSize: 13, color: colors.textMuted, marginBottom: spacing.md, lineHeight: 18 },
  buttonRow: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.xs },
  rowBtn: { flex: 1 },
});
