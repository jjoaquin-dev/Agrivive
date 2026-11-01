import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { authClient } from "../../src/api/client";
import { useAuth } from "../../src/context/AuthContext";
import { colors, fonts, spacing, radii, touchTargets } from "../../src/theme";
import { Mail, Lock, ArrowLeft } from "lucide-react-native";
import { InputComponent } from "../../src/components/InputComponent";
import { ButtonComponent } from "../../src/components/ButtonComponent";
import { safeBack } from "../../src/utils/safeBack";
import { GoogleSignInButton } from "../../src/features/auth/components/GoogleSignInButton";

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
        const errorCode = (response.error as { code?: string }).code;
        const msg = response.error.message?.toLowerCase() || "";
        const isEmailNotVerified =
          errorCode === "EMAIL_NOT_VERIFIED" || msg.includes("email not verified");

        if (isEmailNotVerified) {
          const cleanEmail = email.trim().toLowerCase();
          let sent = false;
          try {
            const sendRes = await authClient.emailOtp.sendVerificationOtp({
              email: cleanEmail,
              type: "email-verification",
            });
            if (!sendRes?.error) sent = true;
          } catch (otpError) {
            console.warn("Could not send verification OTP after login", otpError);
          }

          router.replace({
            pathname: "/(auth)/verify-email",
            params: { email: cleanEmail, sent: sent ? "true" : "false" },
          });
          return;
        }

        if (msg.includes("password") || msg.includes("credential") || msg.includes("user")) {
          setErrors({ password: "The email or password you entered is incorrect." });
        } else if (msg.includes("email")) {
          setErrors({ email: response.error.message });
        } else {
          setErrors({
            general: response.error.message || "Failed to sign in. Please check your credentials.",
          });
        }
        return;
      }

      if ((response.data as any)?.twoFactorRedirect) {
        router.push({
          pathname: "/(auth)/two-factor",
          params: { email: email.trim().toLowerCase() },
        });
        return;
      }

      await completeOnboarding();
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
            if (!sendRes?.error) sent = true;
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

        if (setup.passwordSetupRequired) {
          router.replace("/(auth)/password-setup");
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

  const handleForgotPassword = () => router.push("/(auth)/account-recovery");

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
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.navBar}>
          <Pressable
            onPress={() => safeBack(router, "/(auth)/onboarding")}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Back"
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={colors.primary} />
          </Pressable>
        </View>

        <View style={styles.header}>
          <Image
            source={require("../../assets/brand/agrivive-logo-icon.png")}
            style={styles.logoIcon}
            resizeMode="contain"
            accessibilityLabel="Agrivive"
          />
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to manage your stall.</Text>
        </View>

        {errors.general ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorBoxText}>{errors.general}</Text>
          </View>
        ) : null}

        <View style={styles.form}>
          <InputComponent
            label="Email"
            placeholder="you@example.com"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            leftIcon={<Mail size={20} color="#4B5563" strokeWidth={1.5} />}
            error={errors.email}
            labelStyle={styles.inputLabel}
            inputWrapperStyle={styles.inputRounded}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              if (errors.general) setErrors((prev) => ({ ...prev, general: undefined }));
            }}
          />

          <InputComponent
            label="Password"
            placeholder="Your password"
            placeholderTextColor="#9CA3AF"
            isPassword
            autoCapitalize="none"
            value={password}
            leftIcon={<Lock size={20} color="#4B5563" strokeWidth={1.5} />}
            error={errors.password}
            labelStyle={styles.inputLabel}
            inputWrapperStyle={styles.inputRounded}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              if (errors.general) setErrors((prev) => ({ ...prev, general: undefined }));
            }}
          />

          <View style={styles.forgotPasswordRow}>
            <Pressable
              onPress={handleForgotPassword}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Forgot password"
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </Pressable>
          </View>

          <ButtonComponent
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            style={styles.submitButton}
            textStyle={styles.submitButtonText}
          />

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <GoogleSignInButton title="Continue with Google" />

          <ButtonComponent
            title="Sign in with email code"
            variant="secondary"
            icon={<Mail size={20} color={colors.primary} strokeWidth={1.5} />}
            onPress={() => router.push("/(auth)/email-otp-login")}
            style={styles.emailOtpButton}
          />

          <View style={styles.footerRow}>
            <Text style={styles.footerPrompt}>Don’t have an account? </Text>
            <Pressable
              onPress={() => router.push("/(auth)/register")}
              hitSlop={6}
              accessibilityRole="button"
              accessibilityLabel="Create one"
            >
              <Text style={styles.signUpText}>Create one</Text>
            </Pressable>
          </View>
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
    paddingTop: spacing.base,
    paddingBottom: spacing.xxl,
    justifyContent: "center",
  },
  navBar: {
    height: 48,
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
  },
  logoIcon: {
    width: 40,
    height: 40,
    marginBottom: spacing.base,
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
    backgroundColor: "rgba(184, 84, 80, 0.08)",
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: radii.card,
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
    color: colors.text,
    fontSize: 14,
    fontWeight: "500",
    marginBottom: spacing.xs,
  },
  inputRounded: {
    borderRadius: radii.input,
    borderColor: colors.border,
    borderWidth: 1.5,
    minHeight: touchTargets.min,
    backgroundColor: colors.surface,
  },
  forgotPasswordRow: {
    alignItems: "flex-end",
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  forgotText: {
    fontFamily: fonts.body.semiBold,
    fontSize: 13,
    color: colors.primary,
    fontWeight: "600",
  },
  submitButton: {
    borderRadius: radii.button,
    minHeight: touchTargets.min,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 3,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.white,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.xl,
  },
  footerPrompt: {
    fontSize: 14,
    color: colors.textMuted,
    fontFamily: fonts.body.regular,
  },
  signUpText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
    fontFamily: fonts.body.semiBold,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "500",
    paddingHorizontal: spacing.md,
  },
  emailOtpButton: {
    marginTop: spacing.md,
    borderRadius: radii.button,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
