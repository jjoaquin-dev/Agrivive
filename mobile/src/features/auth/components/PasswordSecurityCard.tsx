import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Lock } from "lucide-react-native";
import { getPasswordStatus, PasswordStatus } from "../../../api/auth";
import { useAuth } from "../../../context/AuthContext";
import { colors, fonts, radii, spacing } from "../../../theme";
import { profileColors } from "../../profile/profileTokens";
import { PasswordForm } from "./PasswordForm";

export function PasswordSecurityCard() {
  const { refreshSetup } = useAuth();
  const [status, setStatus] = useState<PasswordStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getPasswordStatus()
      .then((next) => { if (!cancelled) setStatus(next); })
      .catch((err: any) => { if (!cancelled) setError(err?.message || "Could not load password settings."); });
    return () => { cancelled = true; };
  }, []);

  const isSet = Boolean(status?.hasPassword);
  const pill = !status ? null : isSet ? "Password is set" : status.passwordSetupRequired ? "No password yet" : null;

  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <Lock size={22} color={colors.primary} />
        <Text style={styles.title}>Password</Text>
        {pill ? (
          <View style={[styles.pill, !isSet && styles.pillWarn]}>
            <View style={[styles.dot, !isSet && styles.dotWarn]} />
            <Text style={[styles.pillText, !isSet && styles.pillTextWarn]}>{pill}</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.description}>
        {!status ? "Loading password settings..." : isSet ? "Change your password regularly to keep your stall secure."
          : status.passwordSetupRequired ? "Create a password so you can also sign in with email." : "A password is not configured for this account type."}
      </Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {status?.passwordSetupRequired || status?.hasPassword ? (
        <PasswordForm mode={status.hasPassword ? "change" : "set"} onSuccess={async () => { setStatus({ hasPassword: true, passwordSetupRequired: false }); await refreshSetup(); }} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radii.sheet, borderWidth: 1, borderColor: profileColors.border, padding: spacing.base, gap: spacing.md, marginBottom: spacing.base },
  head: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  title: { flex: 1, fontFamily: fonts.heading.bold, fontSize: 18, color: colors.text },
  pill: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: profileColors.mint, borderRadius: radii.full, paddingHorizontal: 10, paddingVertical: 4 },
  pillWarn: { backgroundColor: profileColors.amber },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: profileColors.mintText },
  dotWarn: { backgroundColor: profileColors.amberText },
  pillText: { fontFamily: fonts.body.semiBold, fontSize: 12, color: profileColors.mintText },
  pillTextWarn: { color: profileColors.amberText },
  description: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, color: colors.textMuted },
  error: { color: colors.error, fontSize: 14 },
});
