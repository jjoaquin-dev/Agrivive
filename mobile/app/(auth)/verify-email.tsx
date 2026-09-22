import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { authClient } from "../../src/api/client";
import { useAuth } from "../../src/context/AuthContext";
import { colors, fonts, spacing } from "../../src/theme";
import { KeyRound, CheckCircle2, RotateCcw, ArrowLeft } from "lucide-react-native";
import { InputComponent } from "../../src/components/InputComponent";
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

  // Auto-send verification code if not already sent by signup or login
  useEffect(() => {
    if (params.sent === "true") return;

    if (targetEmail && !autoSentRef.current) {
      autoSentRef.current = true;
      sendOtp();
    }
  }, [params.sent, targetEmail]);

  // Countdown timer for OTP resend cooldown
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
          response.error.message || "Invalid or expired verification code. Please request a new one.",
        );
        return;
      }

      // Sync updated account state
      const setup = await refreshSetup();

      if (setup && !setup.profileComplete) {
        router.replace("/(app)/profile/setup");
      } else {
        router.replace("/(app)/(tabs)/inventory");
      }
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
          <Text style={styles.title}>Verify your email</Text>
          <Text style={styles.subtitle}>
            We sent a 6-digit confirmation code to:
          </Text>
          <Text style={styles.emailBadge}>{targetEmail || "your email"}</Text>
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
          <InputComponent
            label="6-Digit Verification Code"
            placeholder="123456"
            keyboardType="number-pad"
            maxLength={6}
            leftIcon={<KeyRound size={18} color={colors.textMuted} />}
            value={otp}
            error={otpError}
            onChangeText={(text) => {
              setOtp(text);
              if (otpError) setOtpError(null);
              if (generalError) setGeneralError(null);
            }}
          />

          <ButtonComponent
            title="Verify & Continue"
            icon={<CheckCircle2 size={18} color={colors.white} />}
            onPress={handleVerify}
            loading={loading}
            style={styles.submitButton}
          />

          <View style={styles.resendRow}>
            <Text style={styles.resendPrompt}>Didn't receive the code? </Text>
            <ButtonComponent
              title={countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
              variant="ghost"
              onPress={handleResend}
              disabled={countdown > 0 || resending}
              loading={resending}
              style={styles.resendButton}
              textStyle={styles.resendButtonText}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <ButtonComponent
            title="Back to Sign In"
            icon={<ArrowLeft size={16} color={colors.primary} />}
            variant="ghost"
            onPress={() => router.replace("/(auth)/login")}
            textStyle={styles.backLinkText}
          />
        </View>
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
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl,
    justifyContent: "center",
  },
  header: {
    marginBottom: spacing.xl,
    alignItems: "center",
  },
  title: {
    fontFamily: fonts.heading.bold,
    fontSize: 28,
    color: colors.text,
    marginBottom: spacing.xs,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: fonts.body.regular,
    fontSize: 15,
    color: colors.textMuted,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  emailBadge: {
    fontFamily: fonts.body.semiBold,
    fontSize: 15,
    color: colors.primary,
    backgroundColor: "rgba(31, 77, 58, 0.08)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 8,
    textAlign: "center",
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
  form: {
    marginBottom: spacing.xl,
  },
  submitButton: {
    marginTop: spacing.sm,
  },
  resendRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.lg,
  },
  resendPrompt: {
    fontSize: 14,
    color: colors.textMuted,
  },
  resendButton: {
    minHeight: 36,
    paddingHorizontal: spacing.xs,
    paddingVertical: 0,
  },
  resendButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
  },
  footer: {
    alignItems: "center",
    marginTop: spacing.base,
  },
  backLinkText: {
    color: colors.textMuted,
    fontSize: 14,
  },
});
