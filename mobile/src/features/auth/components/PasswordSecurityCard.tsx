import React, { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";
import { getPasswordStatus, PasswordStatus } from "../../../api/auth";
import { useAuth } from "../../../context/AuthContext";
import { CardComponent } from "../../../components/CardComponent";
import { colors, fonts, spacing } from "../../../theme";
import { PasswordForm } from "./PasswordForm";

export function PasswordSecurityCard() {
  const { refreshSetup } = useAuth();
  const [status, setStatus] = useState<PasswordStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getPasswordStatus()
      .then((nextStatus) => {
        if (!cancelled) setStatus(nextStatus);
      })
      .catch((err: any) => {
        if (!cancelled) setError(err?.message || "Could not load password settings.");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <CardComponent style={styles.card}>
      <Text style={styles.title}>Password</Text>
      <Text style={styles.description}>
        {!status
          ? "Loading password settings..."
          : status.hasPassword
          ? "Update the password you use to sign in with email."
          : status.passwordSetupRequired
            ? "Create a password so you can also sign in with email."
            : "A password is not configured for this account type."}
      </Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!status && !error ? <Text style={styles.loading}>Loading password settings...</Text> : null}
      {status?.passwordSetupRequired || status?.hasPassword ? (
        <PasswordForm
          mode={status.hasPassword ? "change" : "set"}
          onSuccess={async () => {
            setStatus({ hasPassword: true, passwordSetupRequired: false });
            await refreshSetup();
          }}
        />
      ) : null}
    </CardComponent>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
  },
  title: {
    color: colors.text,
    fontFamily: fonts.heading.bold,
    fontSize: 18,
  },
  description: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  loading: {
    color: colors.textMuted,
    fontSize: 14,
  },
  error: {
    color: colors.error,
    fontSize: 14,
  },
});
