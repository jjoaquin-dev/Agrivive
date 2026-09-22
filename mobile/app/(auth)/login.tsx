import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { authClient } from "../../src/api/client";
import { useAuth } from "../../src/context/AuthContext";
import { colors, fonts, spacing } from "../../src/theme";
import { Mail, Lock, LogIn } from "lucide-react-native";
import { InputComponent } from "../../src/components/InputComponent";
import { ButtonComponent } from "../../src/components/ButtonComponent";

export default function LoginScreen() {
  const router = useRouter();
  const { refreshSetup, completeOnboarding } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      newErrors.email = "Please enter your email address.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        newErrors.email = "Please enter a valid email address.";
      }
    }
    if (!password) {
      newErrors.password = "Please enter your password.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await authClient.signIn.email({
        email: email.trim().toLowerCase(),
        password,
      });

      if (response.error) {
        const msg = response.error.message?.toLowerCase() || "";
        if (msg.includes("password") || msg.includes("credential") || msg.includes("user")) {
          setErrors({ password: "The email or password you entered is incorrect." });
        } else if (msg.includes("email")) {
          setErrors({ email: response.error.message });
        } else {
          setErrors({ general: response.error.message || "Failed to sign in. Please check your credentials." });
        }
        return;
      }

      // Check if user is redirected for two-factor authentication
      if ((response.data as any)?.twoFactorRedirect) {
        router.push({
          pathname: "/(auth)/two-factor",
          params: { email: email.trim().toLowerCase() },
        });
        return;
      }

      // Mark onboarding as completed so unauthenticated checks don't loop back to it
      await completeOnboarding();

      // Sync server state
      const setup = await refreshSetup();

      if (setup) {
        if (!setup.emailVerified || setup.nextStep === "verify-email") {
          const cleanEmail = email.trim().toLowerCase();
          let sent = false;
          try {
            const sendRes = await authClient.emailOtp.sendVerificationOtp({
              email: cleanEmail,
              type: "email-verification",
            });
            if (!sendRes?.error) {
              sent = true;
            }
          } catch (otpErr) {
            console.warn("Could not automatically send verification OTP on login", otpErr);
          }

          router.replace({
            pathname: "/(auth)/verify-email",
            params: { email: cleanEmail, sent: sent ? "true" : "false" },
          });
          return;
        }

        if (!setup.profileComplete || setup.nextStep === "profile") {
          router.replace("/(app)/profile/setup");
          return;
        }
      }

      router.replace("/(app)/(tabs)/home");
    } catch (err: any) {
      console.error("Login error", err);
      setErrors({
        general: err?.message || "Failed to sign in. Please check your connection.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      "Password Recovery",
      "Please contact your administrator or support at support@agrivive.com to reset your credentials.",
      [{ text: "OK" }],
    );
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
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>
            Sign in to manage your surplus produce and reservations.
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
            placeholder="Enter your password"
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

          <View style={styles.forgotPasswordRow}>
            <ButtonComponent
              title="Forgot password?"
              variant="ghost"
              onPress={handleForgotPassword}
              style={styles.forgotButton}
              textStyle={styles.forgotText}
            />
          </View>

          <ButtonComponent
            title="Sign In"
            icon={<LogIn size={18} color={colors.white} />}
            onPress={handleLogin}
            loading={loading}
            style={styles.submitButton}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerPrompt}>Don't have an account? </Text>
          <ButtonComponent
            title="Sign Up"
            variant="ghost"
            onPress={() => router.push("/(auth)/register")}
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
    paddingTop: spacing.xxl,
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
  forgotPasswordRow: {
    alignItems: "flex-end",
    marginBottom: spacing.base,
    marginTop: -spacing.xs,
  },
  forgotButton: {
    minHeight: 32,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  forgotText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: "500",
  },
  submitButton: {
    marginTop: spacing.xs,
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
