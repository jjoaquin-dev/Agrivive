import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import { InputComponent } from "../../../components/InputComponent";
import { profileColors } from "../profileTokens";

interface Props {
  password: string;
  passwordError: string | null;
  onChangePassword: (text: string) => void;
}

export function TotpConfirmPasswordCard({ password, passwordError, onChangePassword }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Confirm your password</Text>
      <Text style={styles.text}>Please confirm your account password before setting up an authenticator app.</Text>
      <InputComponent label="Account Password" placeholder="Enter current password" isPassword value={password} error={passwordError} onChangeText={onChangePassword} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radii.sheet, borderWidth: 1, borderColor: profileColors.border, padding: spacing.lg },
  title: { fontFamily: fonts.heading.bold, fontSize: 20, color: colors.text },
  text: { fontFamily: fonts.body.regular, fontSize: 15, lineHeight: 22, color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.base },
});
