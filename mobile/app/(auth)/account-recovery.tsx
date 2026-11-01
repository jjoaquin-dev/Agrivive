import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CheckCircle2, Mail } from "lucide-react-native";
import { ApiError } from "../../src/api/client";
import { ButtonComponent } from "../../src/components/ButtonComponent";
import { InputComponent } from "../../src/components/InputComponent";
import { OtpInputComponent } from "../../src/components/OtpInputComponent";
import { useAuth } from "../../src/context/AuthContext";
import { AuthScreenShell } from "../../src/features/auth/components/AuthScreenShell";
import { AuthTextLink } from "../../src/features/auth/components/AuthTextLink";
import { AuthResendTimer } from "../../src/features/auth/components/AuthResendTimer";
import { maskEmail } from "../../src/features/auth/maskEmail";
import { requestTrustRecovery, verifyTrustRecovery } from "../../src/features/trust/api/recovery";
import { colors, fonts, spacing } from "../../src/theme";

type Step = "email" | "code" | "done";

/** Turns the backend's recovery errors into one plain line that sits under the code boxes. */
function codeErrorMessage(err: unknown) {
  if (err instanceof ApiError && err.statusCode === 400) {
    return err.message.includes("does not need recovery")
      ? "This account isn't blocked, so there's nothing to restore. Sign in as usual."
      : "That code didn't work. Check it or send a new one.";
  }
  return "We could not restore your account. Check your connection and try again.";
}

export default function AccountRecoveryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();
  const { session, refreshSetup, signOut } = useAuth();
  const signedIn = Boolean(session?.user);
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState((params.email ?? "").trim().toLowerCase());
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState("");

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
      await requestTrustRecovery(cleanEmail);
      setEmail(cleanEmail);
      setStep("code");
      setCountdown(30);
    } catch {
      setError("We could not send the code. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const restoreAccount = async () => {
    if (!/^\d{6}$/.test(otp.trim())) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await verifyTrustRecovery(email, otp.trim());
      setStep("done");
    } catch (err) {
      setError(codeErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const backToEmail = () => {
    setStep("email");
    setOtp("");
    setError("");
  };

  const leave = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/(auth)/login");
  };

  // A signed-in seller goes back through app start, which re-reads the account; everyone else signs in again.
  const finish = async () => {
    if (!signedIn) {
      router.replace("/(auth)/login");
      return;
    }
    setLoading(true);
    await refreshSetup();
    setLoading(false);
    router.replace("/");
  };

  const logOut = async () => {
    await signOut();
    router.replace("/(auth)/login");
  };

  if (step === "done") {
    return (
      <AuthScreenShell
        header={<View style={styles.doneIcon}><CheckCircle2 size={32} color={colors.success} /></View>}
        title="Your Account Is Back"
        subtitle={signedIn ? "You can sell on Agrivive again." : "Sign in again to keep selling."}
      >
        <ButtonComponent title={signedIn ? "Continue" : "Sign In"} onPress={() => void finish()} loading={loading} />
      </AuthScreenShell>
    );
  }

  return (
    <AuthScreenShell
      title={step === "email" ? "Restore Your Account" : "Check Your Email"}
      subtitle={step === "email" ? "For accounts that were blocked or paused. We'll email you a 6-digit code to prove it's you." : (
        <>If this account is blocked or paused, we sent a code to {maskEmail(email)} · <Text style={styles.change} onPress={backToEmail} accessibilityRole="button">Change</Text></>
      )}
      onBack={step === "code" ? backToEmail : leave}
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
          <ButtonComponent
            title="Restore Account"
            onPress={() => void restoreAccount()}
            loading={loading}
            disabled={otp.trim().length !== 6 && !loading}
            style={styles.button}
          />
        </>
      )}
      {signedIn ? (
        <AuthTextLink label="Log out instead" onPress={() => void logOut()} disabled={loading} />
      ) : (
        <AuthTextLink label="Back to sign in" onPress={() => router.replace("/(auth)/login")} />
      )}
    </AuthScreenShell>
  );
}

const styles = StyleSheet.create({
  change: { fontFamily: fonts.body.semiBold, color: colors.primary },
  button: { marginTop: spacing.lg },
  doneIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.xxl,
    marginBottom: spacing.base,
  },
});
