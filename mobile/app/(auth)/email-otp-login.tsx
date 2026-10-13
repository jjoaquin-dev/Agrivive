import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, KeyRound, Mail, Send } from "lucide-react-native";
import { authClient } from "../../src/api/client";
import { ButtonComponent } from "../../src/components/ButtonComponent";
import { InputComponent } from "../../src/components/InputComponent";
import { useAuth } from "../../src/context/AuthContext";
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
    const timer = setInterval(() => {
      setResendCountdown((value) => value - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCountdown]);

  const sendCode = async () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await authClient.emailOtp.sendVerificationOtp({
        email: cleanEmail,
        type: "sign-in",
      });
      if (response.error) {
        setError(
          response.error.message ||
            "Email sign-in is unavailable right now. Please use your password.",
        );
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
      router.replace({
        pathname: "/(auth)/verify-email",
        params: { email: email.trim().toLowerCase(), sent: "false" },
      });
      return;
    }
    if (!setup.profileComplete || setup.nextStep === "profile") {
      router.replace("/(app)/profile/setup");
      return;
    }
    router.replace("/(app)/(tabs)/home");
  };

  const verifyCode = async () => {
    const cleanOtp = otp.trim();
    if (!/^\d{6}$/.test(cleanOtp)) {
      setError("Please enter the 6-digit email code.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await authClient.signIn.emailOtp({
        email: email.trim().toLowerCase(),
        otp: cleanOtp,
      });
      if (response.error) {
        setError(response.error.message || "That code is invalid or expired.");
        return;
      }
      await finishSignIn();
    } catch {
      setError("We could not sign you in with that code. Please try again.");
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
          <Text style={styles.title}>Sign in with email code</Text>
          <Text style={styles.subtitle}>
            {step === "email"
              ? "We will send a one-time code to your Agrivive email."
              : `Enter the code sent to ${email}.`}
          </Text>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.form}>
          {step === "email" ? (
            <>
              <InputComponent
                label="Email Address"
                placeholder="seller@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                leftIcon={<Mail size={18} color={colors.textMuted} />}
                onChangeText={(value) => {
                  setEmail(value);
                  setError("");
                }}
              />
              <ButtonComponent
                title="Send email code"
                icon={<Send size={18} color={colors.white} />}
                onPress={() => void sendCode()}
                loading={loading}
                style={styles.primaryButton}
              />
            </>
          ) : (
            <>
              <InputComponent
                label="6-Digit Email Code"
                placeholder="123456"
                keyboardType="number-pad"
                maxLength={6}
                value={otp}
                leftIcon={<KeyRound size={18} color={colors.textMuted} />}
                onChangeText={(value) => {
                  setOtp(value);
                  setError("");
                }}
              />
              <ButtonComponent
                title="Sign in with code"
                onPress={() => void verifyCode()}
                loading={loading}
                style={styles.primaryButton}
              />
              <ButtonComponent
                title={resendCountdown > 0 ? `Resend in ${resendCountdown}s` : "Resend code"}
                variant="ghost"
                onPress={() => void sendCode()}
                disabled={resendCountdown > 0 || loading}
                style={styles.secondaryButton}
                textStyle={styles.secondaryText}
              />
            </>
          )}
        </View>

        <ButtonComponent
          title="Use password instead"
          variant="ghost"
          onPress={() => router.replace("/(auth)/login")}
          icon={<ArrowLeft size={16} color={colors.primary} />}
          style={styles.backButton}
          textStyle={styles.secondaryText}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: { flex: 1, backgroundColor: colors.background },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
  },
  header: { marginBottom: spacing.xl },
  title: {
    color: colors.text,
    fontFamily: fonts.heading.bold,
    fontSize: 28,
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.textMuted,
    fontFamily: fonts.body.regular,
    fontSize: 15,
    lineHeight: 22,
  },
  error: {
    color: colors.error,
    fontSize: 13,
    marginBottom: spacing.md,
  },
  form: { marginBottom: spacing.md },
  primaryButton: { marginTop: spacing.sm, minHeight: 48 },
  secondaryButton: { minHeight: 44, marginTop: spacing.sm },
  secondaryText: { color: colors.primary, fontSize: 14, fontWeight: "700" },
  backButton: { minHeight: 44 },
});
