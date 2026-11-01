import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { KeyRound, Lock } from "lucide-react-native";
import { authClient } from "../../../api/client";
import { setPassword } from "../../../api/auth";
import { ButtonComponent } from "../../../components/ButtonComponent";
import { InputComponent } from "../../../components/InputComponent";
import { colors, spacing } from "../../../theme";
import { validateNewPassword } from "../passwordRules";
import { PasswordChecklist } from "./PasswordChecklist";

export type PasswordFormMode = "set" | "change";

type PasswordFormProps = {
  mode: PasswordFormMode;
  onSuccess?: () => void | Promise<void>;
};

export function PasswordForm({ mode, onSuccess }: PasswordFormProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPasswordError, setCurrentPasswordError] = useState<string | undefined>();
  const [newPasswordError, setNewPasswordError] = useState<string | undefined>();
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | undefined>();
  const [generalError, setGeneralError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    let hasError = false;
    if (mode === "change" && !currentPassword) {
      setCurrentPasswordError("Please enter your current password.");
      hasError = true;
    }
    const passwordProblem = validateNewPassword(newPassword);
    if (passwordProblem) {
      setNewPasswordError(passwordProblem);
      hasError = true;
    }
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      hasError = true;
    }
    if (hasError) return;

    setLoading(true);
    setCurrentPasswordError(undefined);
    setNewPasswordError(undefined);
    setConfirmPasswordError(undefined);
    setGeneralError(undefined);

    try {
      if (mode === "set") {
        await setPassword(newPassword, confirmPassword);
      } else {
        const response = await authClient.changePassword({
          currentPassword,
          newPassword,
          revokeOtherSessions: false,
        });
        if (response.error) {
          throw new Error(response.error.message || "Could not update your password.");
        }
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      await onSuccess?.();
    } catch (err: any) {
      setGeneralError(err?.message || "Could not update your password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.form}>
      {generalError ? <Text style={styles.generalError}>{generalError}</Text> : null}
      {mode === "change" ? (
        <InputComponent
          label="Current Password"
          placeholder="Enter your existing password"
          isPassword
          value={currentPassword}
          leftIcon={<Lock size={18} color={colors.textMuted} />}
          error={currentPasswordError}
          onChangeText={(value) => {
            setCurrentPassword(value);
            if (currentPasswordError) setCurrentPasswordError(undefined);
            if (generalError) setGeneralError(undefined);
          }}
        />
      ) : null}

      <InputComponent
        label="New Password"
        placeholder="Create a strong password"
        isPassword
        value={newPassword}
        leftIcon={<KeyRound size={18} color={colors.textMuted} />}
        error={newPasswordError}
        onChangeText={(value) => {
          setNewPassword(value);
          if (newPasswordError) setNewPasswordError(undefined);
          if (generalError) setGeneralError(undefined);
        }}
      />

      <InputComponent
        label="Confirm New Password"
        placeholder="Re-enter your new password"
        isPassword
        value={confirmPassword}
        leftIcon={<KeyRound size={18} color={colors.textMuted} />}
        error={confirmPasswordError}
        onChangeText={(value) => {
          setConfirmPassword(value);
          if (confirmPasswordError) setConfirmPasswordError(undefined);
          if (generalError) setGeneralError(undefined);
        }}
      />

      <PasswordChecklist password={newPassword} confirmPassword={confirmPassword} />

      <ButtonComponent
        title={mode === "set" ? "Set Password" : "Change Password"}
        onPress={() => void handleSubmit()}
        loading={loading}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.md,
  },
  generalError: {
    color: colors.error,
    fontSize: 13,
    lineHeight: 19,
  },
  button: {
    marginTop: spacing.xs,
    minHeight: 48,
  },
});
