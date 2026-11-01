import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Mail, ShieldCheck } from "lucide-react-native";
import { authClient } from "../../src/api/client";
import { ButtonComponent } from "../../src/components/ButtonComponent";
import { InputComponent } from "../../src/components/InputComponent";
import { OtpInputComponent } from "../../src/components/OtpInputComponent";
import { useAuth } from "../../src/context/AuthContext";
import { AuthScreenShell } from "../../src/features/auth/components/AuthScreenShell";
import { AuthTextLink } from "../../src/features/auth/components/AuthTextLink";
import { AuthResendTimer } from "../../src/features/auth/components/AuthResendTimer";
import { maskEmail } from "../../src/features/auth/maskEmail";
import { colors, fonts, spacing } from "../../src/theme";

export default function EmailOtpLoginScreen() {
  const router = useRouter();
  const { completeOnboarding, refreshSetup } = useAuth();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [loading, setLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setInterval(() => setResendCountdown((value) => value - 1), 1000);
    return () => clearInterval(timer);
  }, [resendCountdown]);

  const sendCode = async () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      setError("Enter a full email, like name@example.com.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await authClient.emailOtp.sendVerificationOtp({ email: cleanEmail, type: "sign-in" });
      if (response.error) {
        setError(response.error.message || "Email sign-in is unavailable right now. Please use your password.");
        return;
      }
      setEmail(cleanEmail);
      setStep("code");
      setResendCountdown(30);
    } catch {
      setError("We could not send the email code. Please try your password instead.");
    } finally {
      setLoading(false);
    }
  };

  const finishSignIn = async () => {
    await completeOnboarding();
    const setup = await refreshSetup();
    if (!setup) {
      setError("We could not load your account setup. Please try again.");
      return;
    }
    if (!setup.emailVerified || setup.nextStep === "verify-email") {
      router.replace({ pathname: "/(auth)/verify-email", params: { email, sent: "false" } });
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
  };

  const verifyCode = async () => {
    const cleanOtp = otp.trim();
    if (!/^\d{6}$/.test(cleanOtp)) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await authClient.signIn.emailOtp({ email, otp: cleanOtp });
      if (response.error) {
        setError(response.error.message || "That code didn't work. Check it or send a new one.");
        return;
      }
      await finishSignIn();
    } catch {
      setError("We could not sign you in with that code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const goBackToEmail = () => {
    setStep("email");
    setOtp("");
    setError("");
  };

  const usePassword = () => router.replace("/(auth)/login");
  const isCodeFilled = otp.trim().length === 6;

  return (
    <AuthScreenShell
      title={step === "email" ? "Sign In With Email Code" : "Check Your Email"}
      subtitle={step === "email" ? "We'll email you a 6-digit code. No password needed." : (
        <>Sent to {maskEmail(email)} · <Text style={styles.change} onPress={goBackToEmail} accessibilityRole="button">Change</Text></>
      )}
      onBack={step === "code" ? goBackToEmail : usePassword}
      footer={step === "email" ? (
        <View style={styles.footer}>
          <ShieldCheck size={14} color={colors.textMuted} />
          <Text style={styles.footerText}>Agrivive Davao • Safe & password-free login</Text>
        </View>
      ) : null}
    >
      {step === "email" ? (
        <>
          <InputComponent
            label="Email"
            placeholder="name@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            error={error || null}
            leftIcon={<Mail size={20} color={error ? colors.error : colors.textMuted} />}
            onChangeText={(value) => { setEmail(value); setError(""); }}
          />
          <ButtonComponent title="Send Code" onPress={() => void sendCode()} loading={loading} style={styles.button} />
        </>
      ) : (
        <>
          <OtpInputComponent fill length={6} value={otp} error={error || null} disabled={loading} onChange={(value) => { setOtp(value); setError(""); }} />
          <AuthResendTimer seconds={resendCountdown} sending={loading} onResend={() => void sendCode()} />
          <ButtonComponent title="Sign In" onPress={() => void verifyCode()} loading={loading} disabled={!isCodeFilled && !loading} style={styles.button} />
        </>
      )}
      <AuthTextLink label="Use my password instead" onPress={usePassword} />
    </AuthScreenShell>
  );
}

const styles = StyleSheet.create({
  change: { fontFamily: fonts.body.semiBold, color: colors.primary },
  button: { marginTop: spacing.lg },
  footer: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: spacing.md },
  footerText: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted },
});
