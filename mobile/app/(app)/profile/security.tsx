import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import * as Clipboard from "expo-clipboard";
import { authClient } from "../../../src/api/client";
import { useAuth } from "../../../src/context/AuthContext";
import { colors, fonts, spacing } from "../../../src/theme";
import {
  Shield,
  ShieldCheck,
  Key,
  Copy,
  Check,
  Lock,
} from "lucide-react-native";
import { CardComponent } from "../../../src/components/CardComponent";
import { InputComponent } from "../../../src/components/InputComponent";
import { ButtonComponent } from "../../../src/components/ButtonComponent";
import { BadgeComponent } from "../../../src/components/BadgeComponent";

export default function SecurityScreen() {
  const { setup, refreshSetup } = useAuth();
  const is2FAEnabled = !!setup?.twoFactorEnabled;

  // Enrollment state
  const [step, setStep] = useState<"idle" | "enable-password" | "scan-qr" | "backup-codes">("idle");
  const [password, setPassword] = useState("");
  const [totpURI, setTotpURI] = useState<string | null>(null);
  const [secretKey, setSecretKey] = useState<string | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [confirmCode, setConfirmCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmCodeError, setConfirmCodeError] = useState<string | null>(null);
  const [disablePasswordError, setDisablePasswordError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [copiedCodes, setCopiedCodes] = useState(false);

  // Disable state
  const [disablePassword, setDisablePassword] = useState("");
  const [showDisableModal, setShowDisableModal] = useState(false);

  // Step 1: Start enrollment by asking password to generate TOTP URI
  const handleRequestEnable = async () => {
    if (!password) {
      setPasswordError("Please enter your current password to continue.");
      return;
    }

    setLoading(true);
    setPasswordError(null);
    setGeneralError(null);

    try {
      const response = await authClient.twoFactor.enable({
        password,
      });

      if (response.error) {
        setPasswordError(
          response.error.message || "Incorrect password. Please verify and try again.",
        );
        return;
      }

      const data = response.data as any;
      if (data?.totpURI) {
        setTotpURI(data.totpURI);
        // Extract secret parameter from totpURI if possible
        const match = data.totpURI.match(/secret=([A-Z0-9]+)/i);
        setSecretKey(match ? match[1] : null);
      }
      if (Array.isArray(data?.backupCodes)) {
        setBackupCodes(data.backupCodes);
      }

      setStep("scan-qr");
      setPassword(""); // Clear sensitive password immediately
    } catch (err: any) {
      console.error("Failed to initiate 2FA enrollment", err);
      setGeneralError(err?.message || "Failed to initiate authenticator setup.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Confirm 6-digit TOTP code from user's authenticator app
  const handleVerifyTotp = async () => {
    const cleanCode = confirmCode.trim();
    if (!cleanCode) {
      setConfirmCodeError("Please enter the 6-digit code from your authenticator app.");
      return;
    }
    if (cleanCode.length < 6) {
      setConfirmCodeError("Authenticator code must be exactly 6 digits.");
      return;
    }

    setLoading(true);
    setConfirmCodeError(null);
    setGeneralError(null);

    try {
      const response = await authClient.twoFactor.verifyTotp({
        code: cleanCode,
      });

      if (response.error) {
        setConfirmCodeError(
          response.error.message || "Invalid code. Make sure your device clock is synchronized.",
        );
        return;
      }

      await refreshSetup();

      if (backupCodes.length > 0) {
        setStep("backup-codes");
      } else {
        setStep("idle");
        setSuccessMessage("Two-factor authentication is now active!");
      }
    } catch (err: any) {
      console.error("Failed to verify TOTP code", err);
      setGeneralError(err?.message || "Failed to verify authenticator code.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Copy backup codes to clipboard
  const handleCopyBackupCodes = async () => {
    if (backupCodes.length === 0) return;
    const formatted = backupCodes.join("\n");
    await Clipboard.setStringAsync(formatted);
    setCopiedCodes(true);
    Alert.alert("Copied", "Backup codes copied to clipboard. Store them in a secure place.", [{ text: "OK" }]);
  };

  // Step 4: Acknowledge backup codes and complete
  const handleFinishBackupCodes = () => {
    setStep("idle");
    setBackupCodes([]);
    setTotpURI(null);
    setSecretKey(null);
    setConfirmCode("");
    setSuccessMessage("Two-factor authentication enabled successfully!");
  };

  // Disable 2FA flow
  const handleDisable2FA = async () => {
    if (!disablePassword) {
      setDisablePasswordError("Please enter your current password to disable 2FA.");
      return;
    }

    setLoading(true);
    setDisablePasswordError(null);
    setGeneralError(null);

    try {
      const response = await authClient.twoFactor.disable({
        password: disablePassword,
      });

      if (response.error) {
        setDisablePasswordError(
          response.error.message || "Incorrect password. Could not disable 2FA.",
        );
        return;
      }

      await refreshSetup();
      setShowDisableModal(false);
      setDisablePassword("");
      setSuccessMessage("Two-factor authentication has been disabled.");
    } catch (err: any) {
      console.error("Failed to disable 2FA", err);
      setGeneralError(err?.message || "Failed to disable 2FA.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Account Security</Text>
          <Text style={styles.subtitle}>
            Manage two-factor authentication (TOTP) and backup recovery access.
          </Text>
        </View>

        {generalError ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorBoxText}>{generalError}</Text>
          </View>
        ) : null}

        {successMessage ? (
          <View style={styles.successBox}>
            <Text style={styles.successBoxText}>{successMessage}</Text>
          </View>
        ) : null}

        {/* Current 2FA Status Card */}
        <CardComponent style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={styles.statusTextWrapper}>
              <Text style={styles.statusTitle}>Authenticator App (TOTP)</Text>
              <Text style={styles.statusDesc}>
                {is2FAEnabled
                  ? "Active. You will be required to enter a 6-digit code when signing in."
                  : "Optional. Add a layer of security using Google Authenticator, Authy, or 1Password."}
              </Text>
            </View>
            <BadgeComponent
              label={is2FAEnabled ? "Enabled" : "Disabled"}
              variant={is2FAEnabled ? "success" : "neutral"}
            />
          </View>

          {!is2FAEnabled && step === "idle" ? (
            <ButtonComponent
              title="Enable Two-Factor Authentication"
              icon={<Shield size={16} color={colors.white} />}
              onPress={() => {
                setPasswordError(null);
                setConfirmCodeError(null);
                setGeneralError(null);
                setSuccessMessage(null);
                setStep("enable-password");
              }}
              style={styles.actionBtn}
            />
          ) : null}

          {is2FAEnabled && !showDisableModal ? (
            <ButtonComponent
              title="Disable 2FA"
              variant="destructive"
              onPress={() => {
                setDisablePasswordError(null);
                setGeneralError(null);
                setSuccessMessage(null);
                setShowDisableModal(true);
              }}
              style={styles.actionBtn}
            />
          ) : null}
        </CardComponent>

        {/* Step: Confirm Password to Enable 2FA */}
        {step === "enable-password" ? (
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
              onChangeText={(text) => {
                setPassword(text);
                if (passwordError) setPasswordError(null);
                if (generalError) setGeneralError(null);
              }}
            />

            <View style={styles.buttonRow}>
              <ButtonComponent
                title="Cancel"
                variant="secondary"
                onPress={() => {
                  setStep("idle");
                  setPassword("");
                }}
                style={styles.rowBtn}
              />
              <ButtonComponent
                title="Continue"
                onPress={handleRequestEnable}
                loading={loading}
                style={styles.rowBtn}
              />
            </View>
          </CardComponent>
        ) : null}

        {/* Step: Scan QR Code and Verify TOTP */}
        {step === "scan-qr" && totpURI ? (
          <CardComponent style={styles.card}>
            <Text style={styles.cardTitle}>Set Up Authenticator</Text>
            <Text style={styles.cardInstruction}>
              Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.):
            </Text>

            <View style={styles.qrContainer}>
              <QRCode
                value={totpURI}
                size={180}
                color={colors.primary}
                backgroundColor={colors.white}
              />
            </View>

            {secretKey ? (
              <View style={styles.secretBox}>
                <Text style={styles.secretLabel}>Manual Setup Key:</Text>
                <Text style={styles.secretCode} selectable>
                  {secretKey}
                </Text>
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
              onChangeText={(text) => {
                setConfirmCode(text);
                if (confirmCodeError) setConfirmCodeError(null);
                if (generalError) setGeneralError(null);
              }}
            />

            <ButtonComponent
              title="Verify & Activate"
              icon={<Check size={16} color={colors.white} />}
              onPress={handleVerifyTotp}
              loading={loading}
              style={styles.actionBtn}
            />

            <ButtonComponent
              title="Cancel"
              variant="ghost"
              onPress={() => {
                setStep("idle");
                setTotpURI(null);
                setSecretKey(null);
                setConfirmCode("");
              }}
              style={styles.cancelBtn}
            />
          </CardComponent>
        ) : null}

        {/* Step: Acknowledge Backup Codes */}
        {step === "backup-codes" ? (
          <CardComponent style={styles.card}>
            <Text style={styles.cardTitle}>Save Your Backup Codes</Text>
            <Text style={styles.cardInstruction}>
              If you lose access to your phone or authenticator app, you can use these one-time codes to sign in. Each code can be used only once.
            </Text>

            <View style={styles.backupCodesList}>
              {backupCodes.map((code, index) => (
                <View key={index} style={styles.codeItem}>
                  <Text style={styles.codeText} selectable>
                    {code}
                  </Text>
                </View>
              ))}
            </View>

            <ButtonComponent
              title={copiedCodes ? "Codes Copied" : "Copy All Codes"}
              icon={copiedCodes ? <Check size={16} color={colors.primary} /> : <Copy size={16} color={colors.primary} />}
              variant="secondary"
              onPress={handleCopyBackupCodes}
              style={styles.copyBtn}
            />

            <ButtonComponent
              title="I Have Saved My Backup Codes"
              onPress={handleFinishBackupCodes}
              style={styles.actionBtn}
            />
          </CardComponent>
        ) : null}

        {/* Disable 2FA Form */}
        {showDisableModal ? (
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
              onChangeText={(text) => {
                setDisablePassword(text);
                if (disablePasswordError) setDisablePasswordError(null);
                if (generalError) setGeneralError(null);
              }}
            />

            <View style={styles.buttonRow}>
              <ButtonComponent
                title="Cancel"
                variant="secondary"
                onPress={() => {
                  setShowDisableModal(false);
                  setDisablePassword("");
                }}
                style={styles.rowBtn}
              />
              <ButtonComponent
                title="Confirm Disable"
                variant="destructive"
                onPress={handleDisable2FA}
                loading={loading}
                style={styles.rowBtn}
              />
            </View>
          </CardComponent>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
    paddingBottom: spacing.xxxl,
  },
  header: {
    marginBottom: spacing.base,
  },
  title: {
    fontFamily: fonts.heading.bold,
    fontSize: 24,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontFamily: fonts.body.regular,
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
  },
  errorBox: {
    backgroundColor: "rgba(184, 84, 80, 0.1)",
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.base,
  },
  errorBoxText: {
    color: colors.error,
    fontSize: 13,
    fontWeight: "500",
  },
  successBox: {
    backgroundColor: "rgba(63, 125, 88, 0.1)",
    borderWidth: 1,
    borderColor: colors.success,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.base,
  },
  successBoxText: {
    color: colors.success,
    fontSize: 13,
    fontWeight: "500",
  },
  statusCard: {
    marginBottom: spacing.base,
  },
  statusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.base,
  },
  statusTextWrapper: {
    flex: 1,
    marginRight: spacing.sm,
  },
  statusTitle: {
    fontFamily: fonts.heading.semiBold,
    fontSize: 16,
    color: colors.text,
    marginBottom: 4,
  },
  statusDesc: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
  card: {
    marginBottom: spacing.base,
  },
  cardTitle: {
    fontFamily: fonts.heading.semiBold,
    fontSize: 17,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  cardInstruction: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.md,
    lineHeight: 18,
  },
  qrContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.base,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignSelf: "center",
    marginBottom: spacing.md,
  },
  secretBox: {
    backgroundColor: "rgba(31, 77, 58, 0.06)",
    padding: spacing.sm,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: spacing.base,
  },
  secretLabel: {
    fontSize: 11,
    color: colors.textMuted,
    textTransform: "uppercase",
    fontWeight: "600",
    marginBottom: 2,
  },
  secretCode: {
    fontSize: 15,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    color: colors.primary,
    fontWeight: "700",
  },
  backupCodesList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,0.02)",
    padding: spacing.sm,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  codeItem: {
    width: "48%",
    backgroundColor: colors.surface,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xs,
    alignItems: "center",
  },
  codeText: {
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontSize: 13,
    color: colors.text,
    fontWeight: "600",
  },
  actionBtn: {
    marginTop: spacing.xs,
  },
  copyBtn: {
    marginBottom: spacing.sm,
  },
  cancelBtn: {
    marginTop: spacing.xs,
  },
  buttonRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  rowBtn: {
    flex: 1,
  },
});
