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
import { Mail, Lock, ArrowRight } from "lucide-react-native";
import { InputComponent } from "../../src/components/InputComponent";
import { ButtonComponent } from "../../src/components/ButtonComponent";
import { GoogleSignInButton } from "../../src/features/auth/components/GoogleSignInButton";

export default function RegisterScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

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
      // Better Auth requires a name at signup; submit neutral provisional name "Seller"
      // to be replaced with the person's real name during profile setup
      const response = await authClient.signUp.email({
        email: cleanEmail,
        password,
        name: "Seller",
      });

      if (response.error) {
        const msg = response.error.message?.toLowerCase() || "";
        if (
          msg.includes("already") ||
          msg.includes("exist")
        ) {
          try {
            const check = await apiFetch<any>("/auth/check-email", {
              method: "POST",
              body: JSON.stringify({ email: cleanEmail, targetRole: "seller" }),
            });
            if (check.roleCount >= 2) {
              setErrors({
                email: "This email already has both Buyer and Seller profiles. Please sign in instead.",
              });
              return;
            }
            if (check.hasTargetRole) {
              setErrors({
                email: "An account with this email is already registered as a Seller. Please sign in instead.",
              });
              return;
            }
            if (check.canUseEmail) {
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
            }
          } catch (checkErr: any) {
            setErrors({
              email: checkErr?.message || "An account with this email already exists. Please sign in instead.",
            });
            return;
          }
        } else if (msg.includes("password")) {
          setErrors({ password: response.error.message });
        } else {
          setErrors({
            general: response.error.message || "Could not complete registration. Please try again.",
          });
        }
        return;
      }

      // Signup sends the verification code, then starts the seller profile onboarding.
      router.replace("/(app)/profile/setup");
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
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              if (errors.general) setErrors((prev) => ({ ...prev, general: undefined }));
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
            title="Continue to Email Verification"
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
    fontSize: 28,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontFamily: fonts.body.regular,
    fontSize: 15,
    color: colors.textMuted,
    lineHeight: 22,
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
