import React, { useState } from "react";
import { View, Text, Image, ScrollView, KeyboardAvoidingView, Platform, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../../src/theme";
import { Mail, Lock, ArrowLeft } from "lucide-react-native";
import { InputComponent } from "../../src/components/InputComponent";
import { ButtonComponent } from "../../src/components/ButtonComponent";
import { safeBack } from "../../src/utils/safeBack";
import { GoogleSignInButton } from "../../src/features/auth/components/GoogleSignInButton";
import { RecaptchaNotice } from "../../src/features/auth/components/RecaptchaNotice";
import { styles } from "../../src/features/auth/Login.styles";
import { useLogin } from "../../src/features/auth/hooks/useLogin";

export default function LoginScreen() {
  const router = useRouter();
  const { email, setEmail, password, setPassword, loading, setLoading, errors, setErrors, validate, handleLogin, handleForgotPassword } = useLogin();

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
            source={require("../../assets/brand/agrivive-logo-full.png")}
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
            placeholderTextColor={colors.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            leftIcon={<Mail size={20} color={colors.textMuted} strokeWidth={1.5} />}
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
            placeholderTextColor={colors.textMuted}
            isPassword
            autoCapitalize="none"
            value={password}
            leftIcon={<Lock size={20} color={colors.textMuted} strokeWidth={1.5} />}
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
            title="Sign In with Email Code"
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
        <RecaptchaNotice />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
