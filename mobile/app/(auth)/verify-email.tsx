import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { LogOut, Mail } from "lucide-react-native";
import { authClient } from "../../src/api/client";
import { ButtonComponent } from "../../src/components/ButtonComponent";
import { ConfirmDialogComponent } from "../../src/components/ConfirmDialogComponent";
import { OtpInputComponent } from "../../src/components/OtpInputComponent";
import { useAuth } from "../../src/context/AuthContext";
import { AuthScreenShell } from "../../src/features/auth/components/AuthScreenShell";
import { AuthStepBar } from "../../src/features/auth/components/AuthStepBar";
import { AuthResendTimer } from "../../src/features/auth/components/AuthResendTimer";
import { maskEmail } from "../../src/features/auth/maskEmail";
import { colors, fonts, radii, spacing } from "../../src/theme";

type LeaveAction = "logout" | "change" | null;

export default function VerifyEmailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string; sent?: string }>();
  const { session, refreshSetup, signOut } = useAuth();
  const targetEmail = (params.email || session?.user?.email || "").trim().toLowerCase();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(params.sent === "true" ? 30 : 0);
  const [leaveAction, setLeaveAction] = useState<LeaveAction>(null);
  const autoSentRef = useRef(false);

  const sendOtp = async () => {
    if (!targetEmail) return;
    setResending(true);
    setError(null);
    try {
      const response = await authClient.emailOtp.sendVerificationOtp({ email: targetEmail, type: "email-verification" });
      if (response.error) {
        setError(response.error.message || "We could not send the code. Try again in a moment.");
        return;
      }
      setCountdown(30);
    } catch (err) {
      console.error("Send OTP error", err);
      setError("We could not send the code. Please try again.");
    } finally {
      setResending(false);
    }
  };

  useEffect(() => {
    if (params.sent === "true" || !targetEmail || autoSentRef.current) return;
    autoSentRef.current = true;
    void sendOtp();
  }, [params.sent, targetEmail]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleVerify = async () => {
    const cleanOtp = otp.trim();
    if (cleanOtp.length < 6) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    if (!targetEmail) {
      setError("We are missing your email. Please sign in again.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await authClient.emailOtp.verifyEmail({ email: targetEmail, otp: cleanOtp });
      if (response.error) {
        setError("That code didn't work. Check it or send a new one.");
        return;
      }
      const setup = await refreshSetup();
      if (!setup) {
        setError("Your email is verified, but we could not load your account. Please try again.");
        return;
      }
      if (!setup.emailVerified || setup.nextStep === "verify-email") {
        setError("Your email is still being checked. Please try again.");
        return;
      }
      if (!setup.profileComplete || setup.nextStep === "profile") router.replace("/(app)/profile/setup");
      else if (setup.passwordSetupRequired) router.replace("/(auth)/password-setup");
      else router.replace("/(app)/(tabs)/home");
    } catch (err: any) {
      console.error("Email verification error", err);
      setError(err?.message || "We could not check the code. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const confirmLeave = async () => {
    const action = leaveAction;
    setLeaveAction(null);
    await signOut();
    router.replace(action === "change" ? "/(auth)/register" : "/(auth)/login");
  };

  return (
    <>
      <AuthScreenShell
        title="Verify Your Email"
        header={<AuthStepBar step={1} name="Email" />}
        topRight={
          <Pressable onPress={() => setLeaveAction("logout")} accessibilityRole="button" hitSlop={8} style={styles.logOut}>
            <Text style={styles.logOutText}>Log out</Text>
          </Pressable>
        }
        subtitle={<>We sent a code to <Text style={styles.email}>{maskEmail(targetEmail || "your email")}</Text> · <Text style={styles.change} onPress={() => setLeaveAction("change")} accessibilityRole="button">Change</Text></>}
      >
        <OtpInputComponent fill length={6} value={otp} error={error} disabled={loading} onChange={(value) => { setOtp(value); setError(null); }} />
        <AuthResendTimer seconds={countdown} sending={resending} onResend={() => void sendOtp()} />
        <ButtonComponent title="Verify" onPress={() => void handleVerify()} loading={loading} disabled={otp.trim().length < 6 && !loading} style={styles.button} />
        <View style={styles.helpCard}>
          <View style={styles.helpIcon}><Mail size={16} color={colors.primary} /></View>
          <View style={styles.helpText}>
            <Text style={styles.helpTitle}>Can't find the email?</Text>
            <Text style={styles.helpBody}>Check your spam or junk folder, or wait for the timer to ask for another code.</Text>
          </View>
        </View>
      </AuthScreenShell>
      <ConfirmDialogComponent
        visible={leaveAction !== null}
        icon={<LogOut size={22} color={colors.error} />}
        title={leaveAction === "change" ? "Use a different email?" : "Log out of Agrivive?"}
        message={leaveAction === "change" ? "We'll log you out so you can sign up with another email." : "You can sign in again any time to finish setting up."}
        cancelLabel="Cancel"
        confirmLabel="Log Out"
        onCancel={() => setLeaveAction(null)}
        onConfirm={() => void confirmLeave()}
      />
    </>
  );
}

const styles = StyleSheet.create({
  logOut: { minHeight: 44, justifyContent: "center", marginLeft: "auto" },
  logOutText: { fontFamily: fonts.body.medium, fontSize: 16, color: colors.textMuted },
  email: { fontFamily: fonts.body.medium, color: colors.text },
  change: { fontFamily: fonts.body.semiBold, color: colors.primary },
  button: { marginTop: spacing.lg },
  helpCard: { flexDirection: "row", gap: spacing.md, marginTop: spacing.lg, padding: spacing.base, borderRadius: radii.card, backgroundColor: colors.surfaceMuted, borderWidth: 1, borderColor: colors.border },
  helpIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primaryLight, alignItems: "center", justifyContent: "center" },
  helpText: { flex: 1 },
  helpTitle: { fontFamily: fonts.heading.semiBold, fontSize: 15, color: colors.text },
  helpBody: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 21, color: colors.textMuted, marginTop: 2 },
});
