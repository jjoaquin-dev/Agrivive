import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { authClient } from "../../src/api/client";
import { useAuth } from "../../src/context/AuthContext";
import { colors, fonts, spacing } from "../../src/theme";
import { ArrowLeft } from "lucide-react-native";
import { OtpInputComponent } from "../../src/components/OtpInputComponent";
import { ButtonComponent } from "../../src/components/ButtonComponent";

export default function VerifyEmailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string; sent?: string }>();
  const { session, refreshSetup } = useAuth();

  const targetEmail = (params.email || session?.user?.email || "").trim().toLowerCase();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(
    params.sent === "true" ? "A verification code has been sent to your email." : null,
  );
  const [countdown, setCountdown] = useState(params.sent === "true" ? 30 : 0);
  const autoSentRef = useRef(false);

  const sendOtp = async () => {
    if (!targetEmail) return;

    setResending(true);
    setOtpError(null);
    setGeneralError(null);
    setSuccessMessage(null);

    try {
      const response = await authClient.emailOtp.sendVerificationOtp({
        email: targetEmail,
        type: "email-verification",
      });

      if (response.error) {
        setGeneralError(
          response.error.message || "Failed to send code. Please try again in a moment.",
        );
        return;
      }

      setSuccessMessage("A fresh verification code has been sent to your email.");
      setCountdown(30);
    } catch (err: any) {
      console.error("Send OTP error", err);
      setGeneralError("Could not send verification code. Please try again.");
    } finally {
      setResending(false);
    }
  };

  useEffect(() => {
    if (params.sent === "true") return;

    if (targetEmail && !autoSentRef.current) {
      autoSentRef.current = true;
      sendOtp();
    }
  }, [params.sent, targetEmail]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleVerify = async () => {
    const cleanOtp = otp.trim();
    if (!cleanOtp) {
      setOtpError("Please enter your 6-digit verification code.");
      return;
    }
    if (cleanOtp.length < 6) {
      setOtpError("Verification code must be exactly 6 digits.");
      return;
    }

    if (!targetEmail) {
      setGeneralError("Missing email address. Please sign in again.");
      return;
    }

    setLoading(true);
    setOtpError(null);
    setGeneralError(null);
    setSuccessMessage(null);

    try {
      const response = await authClient.emailOtp.verifyEmail({
        email: targetEmail,
        otp: cleanOtp,
      });

      if (response.error) {
        setOtpError(
          response.error.message || "Incorrect code. Please try again.",
        );
        return;
      }

      const setup = await refreshSetup();

      if (!setup) {
        setGeneralError(
          "Your email was verified, but we could not load your account setup. Please try again.",
        );
        return;
      }

      if (!setup.emailVerified || setup.nextStep === "verify-email") {
        setGeneralError("Your email verification is still syncing. Please try again.");
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
    } catch (err: any) {
      console.error("Email verification error", err);
      setGeneralError(
        err?.message || "Failed to verify code. Please check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    await sendOtp();
  };

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const isFilled = otp.trim().length === 6;

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
          <Text style={styles.title}>Verification Code</Text>
          <Text style={styles.subtitle}>
            {"Enter The 6-Digit Code We Sent To\n" + (targetEmail || "your email")}
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

        <View style={styles.form}>
          <OtpInputComponent
            length={6}
            value={otp}
            onChange={(val) => {
              setOtp(val);
              if (otpError) setOtpError(null);
              if (generalError) setGeneralError(null);
            }}
            error={otpError}
            disabled={loading}
          />

          <View style={styles.resendRow}>
            {countdown > 0 ? (
              <Text style={styles.resendText}>
                Resend Code in {formatCountdown(countdown)}
              </Text>
            ) : (
              <Pressable
                onPress={handleResend}
                disabled={resending}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Resend code"
              >
                <Text style={styles.resendLinkText}>
                  {resending ? "Sending..." : "Resend Code"}
                </Text>
              </Pressable>
            )}
          </View>

          <ButtonComponent
            title="Verify Code"
            onPress={handleVerify}
            loading={loading}
            disabled={!isFilled && !loading}
            style={[styles.submitButton, !isFilled && styles.submitButtonDisabled]}
            textStyle={[styles.submitButtonText, !isFilled && styles.submitButtonTextDisabled]}
          />
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
    maxWidth: 280,
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
  successBox: {
    backgroundColor: "rgba(63, 125, 88, 0.08)",
    borderWidth: 1,
    borderColor: colors.success,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.base,
  },
  successBoxText: {
    color: colors.success,
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  resendRow: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 28,
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
  submitButton: {
    backgroundColor: "#0F920F",
    borderRadius: 999,
    minHeight: 50,
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
});
