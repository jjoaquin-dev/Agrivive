import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { fonts, spacing, colors } from "../../../theme";
import { CardComponent } from "../../../components/CardComponent";
import { InputComponent } from "../../../components/InputComponent";
import { ButtonComponent } from "../../../components/ButtonComponent";

interface Props {
  password: string;
  passwordError: string | null;
  loading: boolean;
  onChangePassword: (text: string) => void;
  onCancel: () => void;
  onContinue: () => void;
}

export function TotpConfirmPasswordCard({
  password,
  passwordError,
  loading,
  onChangePassword,
  onCancel,
  onContinue,
}: Props) {
  return (
    <CardComponent style={styles.card}>
      <Text style={styles.cardTitle}>Confirm Password</Text>
      <Text style={styles.cardInstruction}>
        Please confirm your account password before configuring an authenticator app.
      </Text>

      <InputComponent
        label="Account Password"
        placeholder="Enter current password"
        isPassword
        value={password}
        error={passwordError}
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
          title="Continue"
          onPress={onContinue}
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
