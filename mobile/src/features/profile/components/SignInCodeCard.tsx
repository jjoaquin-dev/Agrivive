import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { AlertTriangle, Shield, ShieldCheck } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import { ButtonComponent } from "../../../components/ButtonComponent";
import { InputComponent } from "../../../components/InputComponent";
import { profileColors } from "../profileTokens";

interface Props {
  isOn: boolean;
  loading: boolean;
  disabling: boolean;
  disablePassword: string;
  disableError: string | null;
  onTurnOn: () => void;
  onAskTurnOff: () => void;
  onCancelTurnOff: () => void;
  onChangePassword: (value: string) => void;
  onTurnOff: () => void;
}

export function SignInCodeCard({ isOn, loading, disabling, disablePassword, disableError, onTurnOn, onAskTurnOff, onCancelTurnOff, onChangePassword, onTurnOff }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <Shield size={22} color={colors.primary} />
        <Text style={styles.title}>Sign-in Code</Text>
        <View style={[styles.pill, isOn && styles.pillOn]}>
          {isOn ? <ShieldCheck size={13} color={profileColors.mintText} /> : <View style={styles.dot} />}
          <Text style={[styles.pillText, isOn && styles.pillTextOn]}>{isOn ? "On" : "Off"}</Text>
        </View>
      </View>
      <Text style={styles.text}>
        {isOn ? "A 6-digit code is required whenever you sign in." : "Protect your account with a code from an authenticator app (like Google Authenticator) every time you sign in."}
      </Text>
      {!isOn ? <ButtonComponent title="Turn On" icon={<ShieldCheck size={18} color={colors.white} />} onPress={onTurnOn} style={styles.btn} /> : null}
      {isOn && !disabling ? <ButtonComponent title="Turn Off" variant="secondary" onPress={onAskTurnOff} style={styles.btn} /> : null}
      {isOn && disabling ? (
        <View style={styles.warn}>
          <View style={styles.warnHead}>
            <View style={styles.warnIcon}><AlertTriangle size={18} color={profileColors.red} /></View>
            <View style={styles.warnText}>
              <Text style={styles.warnTitle}>Turn off sign-in codes?</Text>
              <Text style={styles.warnBody}>This makes your account less safe. Enter your password to turn it off.</Text>
            </View>
          </View>
          <InputComponent label="Password" placeholder="Enter your password" isPassword value={disablePassword} error={disableError} onChangeText={onChangePassword} />
          <View style={styles.row}>
            <ButtonComponent title="Cancel" variant="secondary" onPress={onCancelTurnOff} style={styles.rowBtn} />
            <ButtonComponent title="Turn Off" variant="destructive" onPress={onTurnOff} loading={loading} style={styles.rowBtn} />
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radii.sheet, borderWidth: 1, borderColor: profileColors.border, padding: spacing.base, marginBottom: spacing.base },
  head: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  title: { flex: 1, fontFamily: fonts.heading.bold, fontSize: 18, color: colors.text },
  pill: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#F3F1EA", borderRadius: radii.full, paddingHorizontal: 10, paddingVertical: 4 },
  pillOn: { backgroundColor: profileColors.mint },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.textMuted },
  pillText: { fontFamily: fonts.body.semiBold, fontSize: 12, color: colors.textMuted },
  pillTextOn: { color: profileColors.mintText },
  text: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 21, color: colors.textMuted, marginTop: spacing.sm },
  btn: { marginTop: spacing.md },
  warn: { backgroundColor: "#FEF8F8", borderWidth: 1, borderColor: "#FECACA", borderRadius: radii.button, padding: spacing.md, marginTop: spacing.md },
  warnHead: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.md },
  warnIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: profileColors.redSoft, alignItems: "center", justifyContent: "center" },
  warnText: { flex: 1 },
  warnTitle: { fontFamily: fonts.heading.bold, fontSize: 16, color: colors.text },
  warnBody: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, color: colors.textMuted, marginTop: 2 },
  row: { flexDirection: "row", gap: spacing.sm },
  rowBtn: { flex: 1 },
});
