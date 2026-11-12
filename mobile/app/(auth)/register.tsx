import React, { useState } from "react";
import { View, Text, Image, ScrollView, KeyboardAvoidingView, Platform, Pressable } from "react-native";
import { useRouter } from "expo-router";

import { colors } from "../../src/theme";
import { Mail, Lock, ArrowLeft, ArrowRight, Info } from "lucide-react-native";
import { InputComponent } from "../../src/components/InputComponent";
import { ButtonComponent } from "../../src/components/ButtonComponent";
import { safeBack } from "../../src/utils/safeBack";
import { GoogleSignInButton } from "../../src/features/auth/components/GoogleSignInButton";
import { PasswordChecklist } from "../../src/features/auth/components/PasswordChecklist";
import { TermsConsent } from "../../src/features/auth/components/TermsConsent";
import { RecaptchaNotice } from "../../src/features/auth/components/RecaptchaNotice";
import { styles } from "../../src/features/auth/Register.styles";
import { useRegister } from "../../src/features/auth/hooks/useRegister";

export default function RegisterScreen() {
  const router = useRouter();
  const { email, setEmail, password, setPassword, confirmPassword, setConfirmPassword, loading, setLoading, acceptedTerms, setAcceptedTerms, accountNotice, setAccountNotice, errors, setErrors, checkEmailPreflight, handleEmailBlur, validate, handleRegister } = useRegister();

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
        <View style={styles.navBar}>
          <Pressable
            onPress={() => safeBack(router, "/(auth)/login")}
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
          <Text style={styles.title}>Create your seller account</Text>
          <Text style={styles.subtitle}>
            Set up your stall to start selling your extra vegetables.
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
            label="Email address"
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
            placeholder="Create a strong password"
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
            label="Confirm password"
            placeholder="Type your password again"
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

          <PasswordChecklist password={password} confirmPassword={confirmPassword} />

          <View style={styles.termsWrap}>
            <TermsConsent
              checked={acceptedTerms}
              error={errors.terms}
              onChange={(checked) => {
                setAcceptedTerms(checked);
                if (errors.terms) setErrors((prev) => ({ ...prev, terms: undefined }));
              }}
            />
          </View>

          <View style={styles.verificationNoteWrap}>
            <Text style={styles.verificationNoteText}>
              We'll email you a code to check it's really you.
            </Text>
          </View>

          <ButtonComponent
            title={accountNotice ? "Add Seller Profile" : "Create Account"}
            icon={<ArrowRight size={18} color={colors.white} />}
            onPress={handleRegister}
            loading={loading}
            style={styles.submitButton}
          />

          <GoogleSignInButton title="Sign Up with Google" showDivider />
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
        <RecaptchaNotice />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
