import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, Mail } from "lucide-react-native";
import { authClient } from "../../src/api/client";
import { ButtonComponent } from "../../src/components/ButtonComponent";
import { InputComponent } from "../../src/components/InputComponent";
import { OtpInputComponent } from "../../src/components/OtpInputComponent";
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
    if (setup.passwordSetupRequired) {
      router.replace("/(auth)/password-setup");
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

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const isCodeFilled = otp.trim().length === 6;

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
            onPress={() => {
              if (step === "code") {
                setStep("email");
                setOtp("");
                setError("");
              } else {
                router.replace("/(auth)/login");
              }
            }}
            style={styles.backButton}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={22} color="#1E1E1E" />
          </Pressable>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>
            {step === "email" ? "Sign In With Code" : "Verification Code"}
          </Text>
          <Text style={styles.subtitle}>
            {step === "email"
              ? "We will send a 6-digit one-time code to your Agrivive email address."
              : `Enter The 6-Digit Code We Sent To\n${email}`}
          </Text>
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorBoxText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.form}>
          {step === "email" ? (
            <>
              <InputComponent
                label="Email"
                placeholder="seller@example.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                leftIcon={<Mail size={20} color="#4B5563" strokeWidth={1.5} />}
                inputWrapperStyle={styles.inputRounded}
                labelStyle={styles.inputLabel}
                onChangeText={(value) => {
                  setEmail(value);
                  setError("");
                }}
              />
              <ButtonComponent
                title="Send Code"
                onPress={() => void sendCode()}
                loading={loading}
                style={styles.primaryButton}
                textStyle={styles.primaryButtonText}
              />
            </>
          ) : (
            <>
              <OtpInputComponent
                length={6}
                value={otp}
                onChange={(value) => {
                  setOtp(value);
                  setError("");
                }}
                disabled={loading}
              />

              <View style={styles.resendRow}>
                {resendCountdown > 0 ? (
                  <Text style={styles.resendText}>
                    Resend Code in {formatCountdown(resendCountdown)}
                  </Text>
                ) : (
                  <Pressable
                    onPress={() => void sendCode()}
                    disabled={loading}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel="Resend code"
                  >
                    <Text style={styles.resendLinkText}>Resend Code</Text>
                  </Pressable>
                )}
              </View>

              <ButtonComponent
                title="Verify Code"
                onPress={() => void verifyCode()}
                loading={loading}
                disabled={!isCodeFilled && !loading}
                style={[styles.primaryButton, !isCodeFilled && styles.primaryButtonDisabled]}
                textStyle={[styles.primaryButtonText, !isCodeFilled && styles.primaryButtonTextDisabled]}
              />
            </>
          )}
        </View>

        <Pressable
          onPress={() => router.replace("/(auth)/login")}
          style={styles.bottomLink}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Sign in with password instead"
        >
          <Text style={styles.bottomLinkText}>Sign in with password instead</Text>
        </Pressable>
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
  inputLabel: {
    color: "#4B5563",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  inputRounded: {
    borderRadius: 12,
    borderColor: "#E5E7EB",
    borderWidth: 1,
    minHeight: 50,
    backgroundColor: "#FFFFFF",
  },
  primaryButton: {
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
  primaryButtonDisabled: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderWidth: 1,
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  primaryButtonTextDisabled: {
    color: "#9CA3AF",
  },
  resendRow: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 8,
  },
  resendText: {
    fontSize: 13,
    color: "#6B7280",
    fontFamily: fonts.body.regular,
  },
  resendLinkText: {
    fontSize: 13,
    color: "#0F920F",
    fontFamily: fonts.body.semiBold,
    fontWeight: "600",
  },
  bottomLink: {
    alignItems: "center",
    marginTop: 28,
    paddingVertical: 8,
  },
  bottomLinkText: {
    fontSize: 14,
    color: "#0F920F",
    fontWeight: "600",
  },
});
