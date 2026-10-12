import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { authClient } from "../../../api/client";
import { ButtonComponent } from "../../../components/ButtonComponent";
import { colors, spacing } from "../../../theme";

export function GoogleSignInButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (response.error) {
        setError(
          response.error.message ||
            "Google sign-in is not available right now.",
        );
        return;
      }

      router.replace("/");
    } catch {
      setError("We could not start Google sign-in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.dividerRow}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.divider} />
      </View>

      <ButtonComponent
        title="Continue with Google"
        variant="secondary"
        loading={loading}
        onPress={() => void handleGoogleSignIn()}
        icon={
          <Text style={styles.googleMark} accessibilityElementsHidden>
            G
          </Text>
        }
        style={styles.button}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.lg,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    color: colors.textMuted,
    fontSize: 13,
  },
  button: {
    minHeight: 48,
  },
  googleMark: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "700",
  },
  error: {
    color: colors.error,
    fontSize: 13,
    marginTop: spacing.sm,
    textAlign: "center",
  },
});
