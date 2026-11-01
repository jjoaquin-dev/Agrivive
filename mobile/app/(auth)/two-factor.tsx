import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Clock, Key } from "lucide-react-native";
import { authClient } from "../../src/api/client";
import { ButtonComponent } from "../../src/components/ButtonComponent";
import { InputComponent } from "../../src/components/InputComponent";
import { OtpInputComponent } from "../../src/components/OtpInputComponent";
import { useAuth } from "../../src/context/AuthContext";
import { AuthScreenShell } from "../../src/features/auth/components/AuthScreenShell";
import { AuthTextLink } from "../../src/features/auth/components/AuthTextLink";
import { colors, fonts, spacing } from "../../src/theme";

export default function TwoFactorChallengeScreen() {
  const router = useRouter();
  const { refreshSetup } = useAuth();
  const [code, setCode] = useState("");
  const [isBackupCode, setIsBackupCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const routeAfterVerify = async () => {
    const setup = await refreshSetup();
    if (!setup) {
      router.replace("/");
      return;
    }
    if (!setup.emailVerified || setup.nextStep === "verify-email") router.replace("/(auth)/verify-email");
    else if (!setup.profileComplete || setup.nextStep === "profile") router.replace("/(app)/profile/setup");
    else if (setup.passwordSetupRequired) router.replace("/(auth)/password-setup");
    else router.replace("/(app)/(tabs)/home");
  };

  const handleVerify = async () => {
    const cleanCode = code.trim();
    if (!cleanCode) {
      setError(isBackupCode ? "Enter your backup code." : "Enter the 6-digit code from your authenticator app.");
      return;
    }
    if (!isBackupCode && cleanCode.length < 6) {
      setError("The code has 6 digits.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = isBackupCode
        ? await authClient.twoFactor.verifyBackupCode({ code: cleanCode })
        : await authClient.twoFactor.verifyTotp({ code: cleanCode });
      if (response?.error) {
        setError(isBackupCode ? "That backup code didn't work or was already used." : "That code didn't work. Check it and try again.");
        return;
      }
      await routeAfterVerify();
    } catch (err: any) {
      console.error("2FA verification error", err);
      setError(err?.message || "We could not check your code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsBackupCode((prev) => !prev);
    setCode("");
    setError(null);
  };

  const isFilled = isBackupCode ? code.trim().length > 0 : code.trim().length === 6;

  return (
    <AuthScreenShell
      title={isBackupCode ? "Use a Backup Code" : "Enter Your Sign-in Code"}
      subtitle={isBackupCode
        ? "Enter one of your emergency backup codes to regain access to your stall."
        : "Open your authenticator app (like Google Authenticator) and type the 6-digit code for Agrivive."}
      onBack={() => router.replace("/(auth)/login")}
    >
      {isBackupCode ? (
        <>
          <InputComponent
            label="Backup Code"
            placeholder="e.g. A1B2-C3D4"
            maxLength={30}
            autoCapitalize="none"
            autoCorrect={false}
            value={code}
            error={error}
            hint="Each backup code works only once."
            leftIcon={<Key size={20} color={error ? colors.error : colors.textMuted} />}
            onChangeText={(text) => { setCode(text); setError(null); }}
          />
          {error ? <Text style={styles.onceNote}>Each backup code works only once.</Text> : null}
        </>
      ) : (
        <>
          <OtpInputComponent fill length={6} value={code} error={error} disabled={loading} onChange={(value) => { setCode(value); setError(null); }} />
          <View style={styles.hintRow}>
            <Clock size={16} color={colors.textMuted} />
            <Text style={styles.hint}>Codes change every 30 seconds.</Text>
          </View>
        </>
      )}
      <ButtonComponent title="Sign In" onPress={() => void handleVerify()} loading={loading} disabled={!isFilled && !loading} style={styles.button} />
      <AuthTextLink label={isBackupCode ? "Use my authenticator app instead" : "Lost your phone? Use a backup code"} onPress={switchMode} />
    </AuthScreenShell>
  );
}

const styles = StyleSheet.create({
  hintRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: spacing.sm },
  hint: { fontFamily: fonts.body.regular, fontSize: 14, color: colors.textMuted },
  onceNote: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted, marginTop: -spacing.xs },
  button: { marginTop: spacing.lg },
});
