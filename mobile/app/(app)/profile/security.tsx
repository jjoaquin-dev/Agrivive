import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import * as Clipboard from "expo-clipboard";
import { authClient } from "../../../src/api/client";
import { useAuth } from "../../../src/context/AuthContext";
import { colors, fonts, spacing } from "../../../src/theme";
import { TotpStatusCard } from "../../../src/features/profile/components/TotpStatusCard";
import { TotpConfirmPasswordCard } from "../../../src/features/profile/components/TotpConfirmPasswordCard";
import { TotpScanQrCard } from "../../../src/features/profile/components/TotpScanQrCard";
import { TotpBackupCodesCard } from "../../../src/features/profile/components/TotpBackupCodesCard";
import { TotpDisableCard } from "../../../src/features/profile/components/TotpDisableCard";
import { PasswordSecurityCard } from "../../../src/features/auth/components/PasswordSecurityCard";

export default function SecurityScreen() {
  const { setup, refreshSetup } = useAuth();
  const is2FAEnabled = !!setup?.twoFactorEnabled;

  const [step, setStep] = useState<"idle" | "enable-password" | "scan-qr" | "backup-codes">("idle");
  const [password, setPassword] = useState("");
  const [totpURI, setTotpURI] = useState<string | null>(null), [secretKey, setSecretKey] = useState<string | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[]>([]), [confirmCode, setConfirmCode] = useState("");
  const [loading, setLoading] = useState(false), [copiedCodes, setCopiedCodes] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null), [confirmCodeError, setConfirmCodeError] = useState<string | null>(null);
  const [disablePasswordError, setDisablePasswordError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null), [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [disablePassword, setDisablePassword] = useState(""), [showDisableModal, setShowDisableModal] = useState(false);

  const handleRequestEnable = async () => {
    if (!password) {
      setPasswordError("Please enter your current password to continue.");
      return;
    }
    setLoading(true);
    setPasswordError(null);
    setGeneralError(null);
    try {
      const response = await authClient.twoFactor.enable({ password });
      if (response.error) {
        setPasswordError(response.error.message || "Incorrect password. Please verify and try again.");
        return;
      }
      const data = response.data as any;
      if (data?.totpURI) {
        setTotpURI(data.totpURI);
        const match = data.totpURI.match(/secret=([A-Z0-9]+)/i);
        setSecretKey(match ? match[1] : null);
      }
      if (Array.isArray(data?.backupCodes)) setBackupCodes(data.backupCodes);
      setStep("scan-qr");
      setPassword("");
    } catch (err: any) {
      setGeneralError(err?.message || "Failed to initiate authenticator setup.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyTotp = async () => {
    const cleanCode = confirmCode.trim();
    if (!cleanCode) { setConfirmCodeError("Please enter the 6-digit code from your app."); return; }
    if (cleanCode.length !== 6 || !/^\d+$/.test(cleanCode)) { setConfirmCodeError("Code must be exactly 6 digits."); return; }
    setLoading(true);
    setConfirmCodeError(null);
    setGeneralError(null);
    try {
      const response = await authClient.twoFactor.verifyTotp({ code: cleanCode });
      if (response.error) { setConfirmCodeError(response.error.message || "Invalid or expired code. Please try again."); return; }
      await refreshSetup();
      setConfirmCode("");
      setTotpURI(null);
      setSecretKey(null);
      if (backupCodes.length > 0) setStep("backup-codes");
      else { setStep("idle"); setSuccessMessage("Two-factor authentication has been successfully enabled."); }
    } catch (err: any) {
      setGeneralError(err?.message || "Failed to verify authenticator code.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyBackupCodes = async () => {
    await Clipboard.setStringAsync(backupCodes.join("\n"));
    setCopiedCodes(true);
    setTimeout(() => setCopiedCodes(false), 3000);
  };

  const handleFinishBackupCodes = () => {
    setStep("idle");
    setBackupCodes([]);
    setSuccessMessage("Two-factor authentication has been successfully enabled.");
  };

  const handleDisable2FA = async () => {
    if (!disablePassword) { setDisablePasswordError("Please enter your password to disable 2FA."); return; }
    setLoading(true);
    setDisablePasswordError(null);
    setGeneralError(null);
    try {
      const response = await authClient.twoFactor.disable({ password: disablePassword });
      if (response.error) { setDisablePasswordError(response.error.message || "Incorrect password. Could not disable 2FA."); return; }
      await refreshSetup();
      setShowDisableModal(false);
      setDisablePassword("");
      setSuccessMessage("Two-factor authentication has been disabled.");
    } catch (err: any) {
      setGeneralError(err?.message || "Failed to disable two-factor authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.keyboardContainer} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Account Security</Text>
          <Text style={styles.subtitle}>Manage two-factor authentication (TOTP) and backup recovery access.</Text>
        </View>

        {generalError ? <View style={styles.errorBox}><Text style={styles.errorBoxText}>{generalError}</Text></View> : null}
        {successMessage ? <View style={styles.successBox}><Text style={styles.successBoxText}>{successMessage}</Text></View> : null}

        {/* 1. Authenticator App (TOTP) Card */}
        <TotpStatusCard
          is2FAEnabled={is2FAEnabled}
          isIdle={step === "idle"}
          showDisableModal={showDisableModal}
          onEnablePress={() => { setPasswordError(null); setConfirmCodeError(null); setGeneralError(null); setSuccessMessage(null); setStep("enable-password"); }}
          onDisablePress={() => { setDisablePasswordError(null); setGeneralError(null); setSuccessMessage(null); setShowDisableModal(true); }}
        />

        {/* 2. TOTP Confirm Password Card: Placed directly BELOW TOTP auth app & ABOVE Password card */}
        {step === "enable-password" && (
          <TotpConfirmPasswordCard
            password={password}
            passwordError={passwordError}
            loading={loading}
            onChangePassword={(text) => { setPassword(text); if (passwordError) setPasswordError(null); if (generalError) setGeneralError(null); }}
            onCancel={() => { setStep("idle"); setPassword(""); }}
            onContinue={handleRequestEnable}
          />
        )}

        {/* 3. TOTP Scan QR Card */}
        {step === "scan-qr" && totpURI && (
          <TotpScanQrCard
            totpURI={totpURI}
            secretKey={secretKey}
            confirmCode={confirmCode}
            confirmCodeError={confirmCodeError}
            loading={loading}
            onChangeCode={(text) => { setConfirmCode(text); if (confirmCodeError) setConfirmCodeError(null); if (generalError) setGeneralError(null); }}
            onVerify={handleVerifyTotp}
            onCancel={() => { setStep("idle"); setTotpURI(null); setSecretKey(null); setConfirmCode(""); }}
          />
        )}

        {/* 4. TOTP Backup Codes Card */}
        {step === "backup-codes" && (
          <TotpBackupCodesCard
            backupCodes={backupCodes}
            copiedCodes={copiedCodes}
            onCopyCodes={handleCopyBackupCodes}
            onFinish={handleFinishBackupCodes}
          />
        )}

        {/* 5. TOTP Disable Card */}
        {showDisableModal && (
          <TotpDisableCard
            disablePassword={disablePassword}
            disablePasswordError={disablePasswordError}
            loading={loading}
            onChangePassword={(text) => { setDisablePassword(text); if (disablePasswordError) setDisablePasswordError(null); if (generalError) setGeneralError(null); }}
            onCancel={() => { setShowDisableModal(false); setDisablePassword(""); }}
            onConfirmDisable={handleDisable2FA}
          />
        )}

        {/* 6. Password Security Card: Positioned below the TOTP flow */}
        <PasswordSecurityCard />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: { flex: 1, backgroundColor: colors.background },
  scrollContent: { flexGrow: 1, paddingHorizontal: spacing.base, paddingTop: spacing.base, paddingBottom: spacing.xxxl },
  header: { marginBottom: spacing.base },
  title: { fontFamily: fonts.heading.bold, fontSize: 22, color: colors.text, marginBottom: spacing.xs },
  subtitle: { fontFamily: fonts.body.regular, fontSize: 14, color: colors.textMuted, lineHeight: 20 },
  errorBox: { backgroundColor: "rgba(184, 84, 80, 0.1)", borderWidth: 1, borderColor: colors.error, borderRadius: 8, padding: spacing.md, marginBottom: spacing.base },
  errorBoxText: { color: colors.error, fontSize: 13, fontWeight: "500" },
  successBox: { backgroundColor: "rgba(63, 125, 88, 0.1)", borderWidth: 1, borderColor: colors.success, borderRadius: 8, padding: spacing.md, marginBottom: spacing.base },
  successBoxText: { color: colors.success, fontSize: 13, fontWeight: "500" },
});
