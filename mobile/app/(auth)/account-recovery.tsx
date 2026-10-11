import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { KeyRound, Mail, ShieldCheck } from "lucide-react-native";
import { ButtonComponent } from "../../src/components/ButtonComponent";
import { InputComponent } from "../../src/components/InputComponent";
import { requestTrustRecovery, verifyTrustRecovery } from "../../src/features/trust/api/recovery";
import { styles } from "../../src/features/trust/components/account-recovery.styles";
import { colors } from "../../src/theme";

export default function AccountRecoveryScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const sendCode = async () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await requestTrustRecovery(cleanEmail);
      setStep("otp");
      setNotice("If this account needs recovery, a code was sent to the email above.");
    } catch (err: any) {
      setError(err?.message || "Could not request a recovery code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const restoreAccount = async () => {
    const cleanOtp = otp.trim();
    if (cleanOtp.length < 4) {
      setError("Enter the recovery code from your email.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await verifyTrustRecovery(email, cleanOtp);
      setNotice("Your account is restored. Sign in again to continue.");
      setStep("email");
      setOtp("");
    } catch (err: any) {
      setError(err?.message || "The code is invalid or expired. Request a new one and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <ShieldCheck size={28} color={colors.primary} />
          </View>
          <Text style={styles.title}>Restore your account</Text>
          <Text style={styles.subtitle}>
            Verify the email linked to your Agrivive account. Admins do not restore accounts manually.
          </Text>
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}
        {notice ? (
          <View style={styles.noticeBox}>
            <Text style={styles.noticeText}>{notice}</Text>
          </View>
        ) : null}

        <View style={styles.form}>
          <InputComponent
            label="Email Address"
            placeholder="seller@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={step === "email"}
            value={email}
            leftIcon={<Mail size={18} color={colors.textMuted} />}
            onChangeText={(text) => {
              setEmail(text);
              setError(null);
              setNotice(null);
            }}
          />

          {step === "otp" ? (
            <InputComponent
              label="Recovery Code"
              placeholder="123456"
              keyboardType="number-pad"
              maxLength={6}
              value={otp}
              leftIcon={<KeyRound size={18} color={colors.textMuted} />}
              onChangeText={(text) => {
                setOtp(text);
                setError(null);
              }}
              hint="The code expires and can only be used once."
            />
          ) : null}

          <ButtonComponent
            title={step === "email" ? "Send Recovery Code" : "Restore Account"}
            icon={<ShieldCheck size={18} color={colors.white} />}
            onPress={step === "email" ? sendCode : restoreAccount}
            loading={loading}
            style={styles.primaryButton}
          />
          {step === "otp" ? (
            <ButtonComponent
              title="Use a different email"
              variant="ghost"
              onPress={() => {
                setStep("email");
                setOtp("");
                setError(null);
                setNotice(null);
              }}
              style={styles.secondaryButton}
            />
          ) : null}
        </View>

        <ButtonComponent
          title="Back to Sign In"
          variant="ghost"
          onPress={() => router.replace("/(auth)/login")}
          style={styles.backButton}
          textStyle={styles.backText}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

