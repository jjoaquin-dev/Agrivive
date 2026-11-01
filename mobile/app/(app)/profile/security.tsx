import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { ArrowRight, ShieldCheck } from "lucide-react-native";
import { ButtonComponent } from "../../../src/components/ButtonComponent";
import { PasswordSecurityCard } from "../../../src/features/auth/components/PasswordSecurityCard";
import { useSellerTwoFactor } from "../../../src/features/profile/hooks/useSellerTwoFactor";
import { ProfileScreenHeader } from "../../../src/features/profile/components/ProfileScreenHeader";
import { SignInCodeCard } from "../../../src/features/profile/components/SignInCodeCard";
import { TotpStepper } from "../../../src/features/profile/components/TotpStepper";
import { TotpConfirmPasswordCard } from "../../../src/features/profile/components/TotpConfirmPasswordCard";
import { TotpScanQrCard } from "../../../src/features/profile/components/TotpScanQrCard";
import { TotpVerifyCard } from "../../../src/features/profile/components/TotpVerifyCard";
import { TotpBackupCodesCard } from "../../../src/features/profile/components/TotpBackupCodesCard";
import { profileColors } from "../../../src/features/profile/profileTokens";
import { colors, fonts, radii, spacing } from "../../../src/theme";

const STEP_NUMBER = { idle: 0, password: 1, scan: 2, verify: 3, backup: 4 } as const;

export default function SecurityScreen() {
  const tf = useSellerTwoFactor();
  const insets = useSafeAreaInsets();
  const inFlow = tf.step !== "idle";
  const action = {
    password: { title: "Continue", run: tf.requestEnable },
    scan: { title: "Next: Type Code", run: tf.toVerify },
    verify: { title: "Check Code", run: tf.verifyCode },
    backup: { title: "I Saved Them", run: tf.finishBackup },
  }[tf.step as "password" | "scan" | "verify" | "backup"];

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <ProfileScreenHeader title={inFlow ? "Turn On Sign-in Code" : "Sign-in Safety"} onBack={inFlow ? (tf.step === "backup" ? () => {} : tf.back) : undefined} />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {tf.generalError ? <View style={styles.error}><Text style={styles.errorText}>{tf.generalError}</Text></View> : null}
          {tf.successMessage && !inFlow ? <View style={styles.success}><Text style={styles.successText}>{tf.successMessage}</Text></View> : null}
          {inFlow ? <TotpStepper current={STEP_NUMBER[tf.step]} /> : null}
          {tf.step === "idle" ? (
            <>
              <PasswordSecurityCard />
              <SignInCodeCard isOn={tf.isOn} loading={tf.loading} disabling={tf.disabling} disablePassword={tf.disablePassword} disableError={tf.disableError}
                onTurnOn={tf.startEnable} onAskTurnOff={tf.startDisable} onCancelTurnOff={tf.cancelDisable} onChangePassword={tf.onDisablePassword} onTurnOff={tf.disable} />
              <View style={styles.note}>
                <ShieldCheck size={20} color={colors.primary} />
                <Text style={styles.noteText}><Text style={styles.noteBold}>Agrivive Stall Protection: </Text>A sign-in code keeps your vegetable listings and buyer reservations safe from anyone who should not be signing in.</Text>
              </View>
            </>
          ) : null}
          {tf.step === "password" ? <TotpConfirmPasswordCard password={tf.password} passwordError={tf.passwordError} onChangePassword={tf.onPassword} /> : null}
          {tf.step === "scan" && tf.totpURI ? <TotpScanQrCard totpURI={tf.totpURI} secretKey={tf.secretKey} /> : null}
          {tf.step === "verify" ? <TotpVerifyCard code={tf.confirmCode} error={tf.codeError} loading={tf.loading} onChange={tf.onCode} onRescan={tf.toScan} /> : null}
          {tf.step === "backup" ? <TotpBackupCodesCard backupCodes={tf.backupCodes} copiedCodes={tf.copiedCodes} onCopyCodes={tf.copyCodes} /> : null}
        </ScrollView>
        {inFlow && action ? (
          <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
            <ButtonComponent title={action.title} icon={<ArrowRight size={18} color={colors.white} />} onPress={() => void action.run()} loading={tf.loading && tf.step !== "scan"} />
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: profileColors.cream },
  flex: { flex: 1 },
  content: { paddingHorizontal: spacing.base, paddingTop: spacing.md, paddingBottom: spacing.xl },
  error: { backgroundColor: profileColors.redSoft, borderWidth: 1, borderColor: colors.error, borderRadius: 10, padding: spacing.md, marginBottom: spacing.base },
  errorText: { color: colors.error, fontFamily: fonts.body.medium, fontSize: 13 },
  success: { backgroundColor: profileColors.mint, borderWidth: 1, borderColor: colors.success, borderRadius: 10, padding: spacing.md, marginBottom: spacing.base },
  successText: { color: profileColors.mintText, fontFamily: fonts.body.medium, fontSize: 13 },
  note: { flexDirection: "row", gap: spacing.sm, backgroundColor: "#F0FDF4", borderWidth: 1, borderColor: "#BBF7D0", borderRadius: radii.sheet, padding: spacing.base },
  noteText: { flex: 1, fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 21, color: colors.text },
  noteBold: { fontFamily: fonts.body.semiBold, color: colors.primary },
  bar: { paddingHorizontal: spacing.base, paddingTop: spacing.md, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: profileColors.border },
});
