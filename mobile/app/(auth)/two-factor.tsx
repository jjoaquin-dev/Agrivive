import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { authClient } from "../../src/api/client";
import { useAuth } from "../../src/context/AuthContext";
import { colors, fonts, spacing } from "../../src/theme";
import { KeyRound, Key, ArrowLeft } from "lucide-react-native";
import { InputComponent } from "../../src/components/InputComponent";
import { OtpInputComponent } from "../../src/components/OtpInputComponent";
import { ButtonComponent } from "../../src/components/ButtonComponent";

export default function TwoFactorChallengeScreen() {
  const router = useRouter();
  const { refreshSetup } = useAuth();

  const [code, setCode] = useState("");
  const [isBackupCode, setIsBackupCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleVerify = async () => {
    const cleanCode = code.trim();
    if (!cleanCode) {
      setCodeError(
        isBackupCode
          ? "Please enter your backup code."
          : "Please enter the 6-digit code from your authenticator app.",
      );
      return;
    }

    if (!isBackupCode && cleanCode.length < 6) {
      setCodeError("Authenticator code must be exactly 6 digits.");
      return;
    }

    setLoading(true);
    setCodeError(null);
    setGeneralError(null);

    try {
      let response;
      if (isBackupCode) {
        response = await authClient.twoFactor.verifyBackupCode({
          code: cleanCode,
        });
      } else {
        response = await authClient.twoFactor.verifyTotp({
          code: cleanCode,
        });
      }

      if (response?.error) {
        setCodeError(
          response.error.message ||
            (isBackupCode
              ? "Invalid backup code. Please verify and try again."
              : "Incorrect code. Please try again."),
        );
        return;
      }

      const setup = await refreshSetup();

      if (setup) {
        if (!setup.emailVerified || setup.nextStep === "verify-email") {
          router.replace("/(auth)/verify-email");
          return;
        }

        if (!setup.profileComplete || setup.nextStep === "profile") {
          router.replace("/(app)/profile/setup");
          return;
        }

        if (setup.passwordSetupRequired) {
          router.replace("/(auth)/password-setup");
          return;
        }

        router.replace("/(app)/(tabs)/home");
      } else {
        router.replace("/");
      }
    } catch (err: any) {
      console.error("2FA verification error", err);
      setGeneralError(
        err?.message || "Failed to verify security challenge. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const isFilled = isBackupCode ? code.trim().length > 0 : code.trim().length === 6;

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topNav}>
          <Pressable
            onPress={() => router.replace("/(auth)/login")}
            style={styles.backButton}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Go back to login"
          >
            <ArrowLeft size={22} color="#1E1E1E" />
          </Pressable>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>
            {isBackupCode ? "Backup Recovery" : "Security Verification"}
          </Text>
          <Text style={styles.subtitle}>
            {isBackupCode
              ? "Enter one of your emergency recovery backup codes to regain account access."
              : "Enter The 6-Digit Code From Your\nAuthenticator App"}
          </Text>
        </View>

        {generalError ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorBoxText}>{generalError}</Text>
          </View>
        ) : null}

        <View style={styles.form}>
          {isBackupCode ? (
            <InputComponent
              label="Backup Recovery Code"
              placeholder="e.g. A1B2-C3D4"
              keyboardType="default"
              maxLength={30}
              autoCapitalize="characters"
              value={code}
              leftIcon={<KeyRound size={18} color="#6B7280" />}
              error={codeError}
              inputWrapperStyle={styles.backupInput}
              onChangeText={(text) => {
                setCode(text);
                if (codeError) setCodeError(null);
                if (generalError) setGeneralError(null);
              }}
            />
          ) : (
            <OtpInputComponent
              length={6}
              value={code}
              onChange={(val) => {
                setCode(val);
                if (codeError) setCodeError(null);
                if (generalError) setGeneralError(null);
              }}
              error={codeError}
              disabled={loading}
            />
          )}

          <ButtonComponent
            title="Verify Code"
            onPress={handleVerify}
            loading={loading}
            disabled={!isFilled && !loading}
            style={[styles.submitButton, !isFilled && styles.submitButtonDisabled]}
            textStyle={[styles.submitButtonText, !isFilled && styles.submitButtonTextDisabled]}
          />

          <Pressable
            onPress={() => {
              setIsBackupCode((prev) => !prev);
              setCode("");
              setCodeError(null);
              setGeneralError(null);
            }}
            style={styles.toggleRow}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={
              isBackupCode
                ? "Use Authenticator App TOTP instead"
                : "Cannot access authenticator? Use a backup code"
            }
          >
            <Key size={15} color="#0F920F" style={styles.toggleIcon} />
            <Text style={styles.toggleText}>
              {isBackupCode
                ? "Use Authenticator App (TOTP) instead"
                : "Cannot access authenticator? Use a backup code"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: spacing.xxl,
  },
  topNav: {
    marginBottom: 48,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontFamily: fonts.heading.bold,
    fontSize: 24,
    color: "#1E1E1E",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: fonts.body.regular,
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
    textAlign: "center",
    maxWidth: 290,
  },
  errorBox: {
    backgroundColor: "rgba(184, 84, 80, 0.08)",
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.base,
  },
  errorBoxText: {
    color: colors.error,
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  backupInput: {
    borderRadius: 12,
    borderColor: "#E5E7EB",
    borderWidth: 1,
    minHeight: 50,
    backgroundColor: "#FFFFFF",
  },
  submitButton: {
    backgroundColor: "#0F920F",
    borderRadius: 999,
    minHeight: 50,
    marginTop: 20,
    shadowColor: "#0F920F",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 3,
  },
  submitButtonDisabled: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderWidth: 1,
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  submitButtonTextDisabled: {
    color: "#9CA3AF",
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    paddingVertical: 6,
  },
  toggleIcon: {
    marginRight: 6,
  },
  toggleText: {
    fontSize: 13,
    color: "#0F920F",
    fontFamily: fonts.body.semiBold,
    fontWeight: "600",
  },
});
