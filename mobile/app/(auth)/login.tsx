import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { authClient } from "../../src/api/client";
import { useAuth } from "../../src/context/AuthContext";
import { colors, fonts, spacing } from "../../src/theme";
import { Mail, Lock } from "lucide-react-native";
import { InputComponent } from "../../src/components/InputComponent";
import { ButtonComponent } from "../../src/components/ButtonComponent";
import { GoogleSignInButton } from "../../src/features/auth/components/GoogleSignInButton";
import { FacebookSignInButton } from "../../src/features/auth/components/FacebookSignInButton";

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
          setErrors({ general: response.error.message || "Failed to sign in. Please check your credentials." });
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
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>
            {"Enter Your Credentials To Access Your\nAccount"}
          </Text>
        </View>

        {errors.general ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorBoxText}>{errors.general}</Text>
          </View>
        ) : null}

        <View style={styles.form}>
          <InputComponent
            label="Email"
            placeholder="Email"
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
            placeholder="Password"
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
              accessibilityLabel="Forget Password"
            >
              <Text style={styles.forgotText}>Forget Password?</Text>
            </Pressable>
          </View>

          <ButtonComponent
            title="Login"
            onPress={handleLogin}
            loading={loading}
            style={styles.submitButton}
            textStyle={styles.submitButtonText}
          />

          <View style={styles.footerRow}>
            <Text style={styles.footerPrompt}>Don’t Have An Account? </Text>
            <Pressable
              onPress={() => router.push("/(auth)/register")}
              hitSlop={6}
              accessibilityRole="button"
              accessibilityLabel="Sign up"
            >
              <Text style={styles.signUpText}>Sign up</Text>
            </Pressable>
          </View>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialRow}>
            <GoogleSignInButton variant="circle" />
            <FacebookSignInButton />
          </View>

          <Pressable
            onPress={() => router.push("/(auth)/email-otp-login")}
            style={styles.emailOtpLink}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Sign in with Email Code"
          >
            <Text style={styles.emailOtpLinkText}>Sign in with Email Code</Text>
          </Pressable>
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
    paddingTop: 50,
    paddingBottom: spacing.xxl,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontFamily: fonts.heading.bold,
    fontSize: 26,
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
    maxWidth: 300,
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
  forgotPasswordRow: {
    alignItems: "flex-end",
    marginTop: 6,
    marginBottom: 28,
  },
  forgotText: {
    fontFamily: fonts.body.semiBold,
    fontSize: 13,
    color: "#11A94D",
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
  submitButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 36,
  },
  footerPrompt: {
    fontSize: 14,
    color: "#374151",
    fontFamily: fonts.body.regular,
  },
  signUpText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#11A94D",
    fontFamily: fonts.body.semiBold,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 36,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dividerText: {
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "500",
    paddingHorizontal: 16,
  },
  socialRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  emailOtpLink: {
    alignItems: "center",
    marginTop: 20,
    paddingVertical: 8,
  },
  emailOtpLinkText: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
});
