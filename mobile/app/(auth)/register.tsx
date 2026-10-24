import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { authClient, apiFetch } from "../../src/api/client";

import { colors, fonts, spacing } from "../../src/theme";
import { Mail, Lock, ArrowRight, Info } from "lucide-react-native";
import { InputComponent } from "../../src/components/InputComponent";
import { ButtonComponent } from "../../src/components/ButtonComponent";
import { GoogleSignInButton } from "../../src/features/auth/components/GoogleSignInButton";

interface EmailCheckResult {
  exists: boolean;
  roleCount: number;
  currentRoles: string[];
  canUseEmail: boolean;
  hasTargetRole: boolean;
  message: string;
}

export default function RegisterScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [accountNotice, setAccountNotice] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  const checkEmailPreflight = async (cleanEmail: string): Promise<EmailCheckResult | null> => {
    try {
      return await apiFetch<EmailCheckResult>("/auth/check-email", {
        method: "POST",
        body: JSON.stringify({ email: cleanEmail, targetRole: "seller" }),
      });
    } catch {
      return null;
    }
  };

  const handleEmailBlur = async () => {
    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) return;

    const check = await checkEmailPreflight(cleanEmail);
    if (!check) return;

    if (check.roleCount >= 2) {
      setErrors((prev) => ({
        ...prev,
        email: "This email already has both Buyer and Seller profiles (maximum 2 roles reached). Please sign in instead.",
      }));
      setAccountNotice(null);
    } else if (check.hasTargetRole) {
      setErrors((prev) => ({
        ...prev,
        email: "An account with this email is already registered as a Seller. Please sign in instead.",
      }));
      setAccountNotice(null);
    } else if (check.exists && check.canUseEmail) {
      setErrors((prev) => ({ ...prev, email: undefined }));
      setAccountNotice("Existing Buyer account found. Enter your password to add the Seller profile.");
    } else {
      setErrors((prev) => ({ ...prev, email: undefined }));
      setAccountNotice(null);
    }
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      newErrors.email = "Please enter an email address.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        newErrors.email = "Please enter a valid email address.";
      }
    }

    if (!password) {
      newErrors.password = "Please enter a password.";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match. Please re-check.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    const cleanEmail = email.trim().toLowerCase();

    try {
      // 1. Mandatory Preflight Duplicate Filtering
      const check = await checkEmailPreflight(cleanEmail);

      if (!check) {
        setErrors({
          general: "Could not connect to verify your email. Please try again.",
        });
        setLoading(false);
        return;
      }

      // Max 2 roles rule: if 2 roles already exist, email cannot be used
      if (check.roleCount >= 2) {
        setErrors({
          email: "This email already has both Buyer and Seller profiles (maximum 2 roles reached). Please sign in instead.",
        });
        setLoading(false);
        return; // HARD STOP: Never redirect!
      }

      // If already a Seller: cannot register duplicate Seller role
      if (check.hasTargetRole) {
        setErrors({
          email: "An account with this email is already registered as a Seller. Please sign in instead.",
        });
        setLoading(false);
        return; // HARD STOP: Never redirect!
      }

      // If account has 1 role (e.g. Buyer): expand role using account password
      if (check.exists && check.canUseEmail) {
        try {
          await apiFetch<any>("/auth/register-role", {
            method: "POST",
            body: JSON.stringify({
              email: cleanEmail,
              password,
              targetRole: "seller",
            }),
          });

          await authClient.signIn.email({
            email: cleanEmail,
            password,
          });

          router.replace("/(app)/profile/setup");
          return;
        } catch (expandErr: any) {
          const errMsg = expandErr?.message || "";
          if (errMsg.toLowerCase().includes("password") || expandErr?.statusCode === 401) {
            setErrors({
              password: "Incorrect password for your existing account. Enter your password to add the Seller profile.",
            });
          } else {
            setErrors({
              general: errMsg || "Failed to link Seller profile to your account.",
            });
          }
          setLoading(false);
          return; // HARD STOP: Never redirect!
        }
      }

      // Brand new account (0 roles): register with targetRole seller and verify OTP
      try {
        await apiFetch<any>("/auth/register-role", {
          method: "POST",
          body: JSON.stringify({
            email: cleanEmail,
            password,
            name: "Seller",
            targetRole: "seller",
          }),
        });

        router.replace({
          pathname: "/(auth)/verify-email",
          params: { email: cleanEmail, sent: "true" },
        });
      } catch (regErr: any) {
        setErrors({
          general: regErr?.message || "Failed to register account. Please try again.",
        });
        setLoading(false);
        return;
      }
    } catch (err: any) {
      console.error("Registration error", err);
      setErrors({
        general: err?.message || "Failed to register. Please check your network connection.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>
            Register your stall to list surplus produce and start receiving verified reservations.
          </Text>
        </View>

        {errors.general ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorBoxText}>{errors.general}</Text>
          </View>
        ) : null}

        {accountNotice ? (
          <View style={styles.noticeBox}>
            <Info size={16} color={colors.primary} />
            <Text style={styles.noticeBoxText}>{accountNotice}</Text>
          </View>
        ) : null}

        <View style={styles.form}>
          <InputComponent
            label="Email Address"
            placeholder="seller@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            leftIcon={<Mail size={18} color={colors.textMuted} />}
            error={errors.email}
            onBlur={handleEmailBlur}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              if (errors.general) setErrors((prev) => ({ ...prev, general: undefined }));
              if (accountNotice) setAccountNotice(null);
            }}
          />

          <InputComponent
            label="Password"
            placeholder="At least 8 characters"
            isPassword
            autoCapitalize="none"
            value={password}
            leftIcon={<Lock size={18} color={colors.textMuted} />}
            error={errors.password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              if (errors.general) setErrors((prev) => ({ ...prev, general: undefined }));
            }}
          />

          <InputComponent
            label="Confirm Password"
            placeholder="Re-enter your password"
            isPassword
            autoCapitalize="none"
            value={confirmPassword}
            leftIcon={<Lock size={18} color={colors.textMuted} />}
            error={errors.confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
              if (errors.general) setErrors((prev) => ({ ...prev, general: undefined }));
            }}
          />

          <ButtonComponent
            title={accountNotice ? "Add Seller Profile" : "Continue to Email Verification"}
            icon={<ArrowRight size={18} color={colors.white} />}
            onPress={handleRegister}
            loading={loading}
            style={styles.submitButton}
          />

          <GoogleSignInButton />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerPrompt}>Already have an account? </Text>
          <ButtonComponent
            title="Sign In"
            variant="ghost"
            onPress={() => router.push("/(auth)/login")}
            style={styles.inlineButton}
            textStyle={styles.inlineButtonText}
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
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    justifyContent: "center",
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontFamily: fonts.heading.bold,
    fontSize: 26,
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
  noticeBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.base,
  },
  noticeBoxText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
  },
  form: {
    marginBottom: spacing.xl,
  },
  submitButton: {
    marginTop: spacing.sm,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.base,
  },
  footerPrompt: {
    fontSize: 14,
    color: colors.textMuted,
  },
  inlineButton: {
    minHeight: 36,
    paddingHorizontal: spacing.xs,
    paddingVertical: 0,
  },
  inlineButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
  },
});
