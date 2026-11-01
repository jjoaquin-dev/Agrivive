import React, { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
import { KeyRound, Mail } from "lucide-react-native";
import { authClient } from "../../src/api/client";
import { ButtonComponent } from "../../src/components/ButtonComponent";
import { InputComponent } from "../../src/components/InputComponent";
import { OtpInputComponent } from "../../src/components/OtpInputComponent";
import { AuthScreenShell } from "../../src/features/auth/components/AuthScreenShell";
import { AuthTextLink } from "../../src/features/auth/components/AuthTextLink";
import { AuthResendTimer } from "../../src/features/auth/components/AuthResendTimer";
import { PasswordChecklist } from "../../src/features/auth/components/PasswordChecklist";
import { maskEmail } from "../../src/features/auth/maskEmail";
import { validateNewPassword } from "../../src/features/auth/passwordRules";
import { colors, fonts, spacing } from "../../src/theme";

type Step = "email" | "reset" | "done";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((value) => value - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const sendCode = async () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      setError("Enter a full email, like name@example.com.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await authClient.emailOtp.sendVerificationOtp({ email: cleanEmail, type: "forget-password" });
      if (response.error) {
        setError(response.error.message || "We could not send the code. Please try again.");
        return;
      }
      setEmail(cleanEmail);
      setStep("reset");
      setCountdown(30);
    } catch {
      setError("We could not send the code. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async () => {
    if (otp.trim().length < 6) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    const problem = validateNewPassword(password) ?? (password !== confirmPassword ? "Passwords do not match." : undefined);
    if (problem) {
      setPasswordError(problem);
      return;
    }
    setLoading(true);
    setError("");
    setPasswordError("");
    try {
      const response = await authClient.emailOtp.resetPassword({ email, otp: otp.trim(), password });
      if (response.error) {
        setError("That code didn't work. Check it or send a new one.");
        return;
      }
      setStep("done");
    } catch {
      setError("We could not change your password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const backToEmail = () => {
    setStep("email");
    setOtp("");
    setError("");
    setPasswordError("");
  };

  const signIn = () => router.replace("/(auth)/login");

  if (step === "done") {
    return (
      <AuthScreenShell title="Password Changed" subtitle="Sign in with your new password.">
        <ButtonComponent title="Sign In" onPress={signIn} />
      </AuthScreenShell>
    );
  }

  return (
    <AuthScreenShell
      title={step === "email" ? "Reset Your Password" : "Check Your Email"}
      subtitle={step === "email" ? "Enter your email and we'll send you a 6-digit code." : (
        <>Sent to {maskEmail(email)} · <Text style={styles.change} onPress={backToEmail} accessibilityRole="button">Change</Text></>
      )}
      onBack={step === "reset" ? backToEmail : signIn}
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
          <AuthResendTimer seconds={countdown} sending={loading} onResend={() => void sendCode()} />
          <InputComponent
            label="New Password"
            placeholder="Create a strong password"
            isPassword
            autoCapitalize="none"
            value={password}
            error={passwordError || null}
            containerStyle={styles.field}
            leftIcon={<KeyRound size={18} color={colors.textMuted} />}
            onChangeText={(value) => { setPassword(value); setPasswordError(""); }}
          />
          <InputComponent
            label="Confirm New Password"
            placeholder="Type your password again"
            isPassword
            autoCapitalize="none"
            value={confirmPassword}
            leftIcon={<KeyRound size={18} color={colors.textMuted} />}
            onChangeText={(value) => { setConfirmPassword(value); setPasswordError(""); }}
          />
          <PasswordChecklist password={password} confirmPassword={confirmPassword} />
          <ButtonComponent title="Change Password" onPress={() => void changePassword()} loading={loading} style={styles.button} />
        </>
      )}
      <AuthTextLink label="Back to sign in" onPress={signIn} />
    </AuthScreenShell>
  );
}

const styles = StyleSheet.create({
  change: { fontFamily: fonts.body.semiBold, color: colors.primary },
  button: { marginTop: spacing.lg },
  field: { marginTop: spacing.lg },
});
