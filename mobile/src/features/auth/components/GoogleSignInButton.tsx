import React, { useState } from "react";
import { StyleSheet, Text, View, Pressable, ActivityIndicator } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useRouter } from "expo-router";
import { authClient } from "../../../api/client";
import { useAuth } from "../../../context/AuthContext";
import { ButtonComponent } from "../../../components/ButtonComponent";
import { colors, spacing } from "../../../theme";

function GoogleIcon({ size = 24 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <Path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <Path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <Path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </Svg>
  );
}

export function GoogleSignInButton({ variant = "full" }: { variant?: "full" | "circle" }) {
  const router = useRouter();
  const { refreshSetup, completeOnboarding } = useAuth();
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

      await completeOnboarding();
      const setup = await refreshSetup();

      if (setup) {
        if (!setup.profileComplete || setup.nextStep === "profile") {
          router.replace("/(app)/profile/setup");
          return;
        }

        if (setup.passwordSetupRequired || setup.nextStep === "password-setup") {
          router.replace("/(auth)/password-setup");
          return;
        }

        if (setup.sellerVerified || setup.nextStep === "ready") {
          router.replace("/(app)/(tabs)/home");
          return;
        }
      }

      router.replace("/(app)/profile/setup");
    } catch {
      setError("We could not start Google sign-in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (variant === "circle") {
    return (
      <View style={styles.circleContainer}>
        <Pressable
          onPress={() => void handleGoogleSignIn()}
          style={({ pressed }) => [
            styles.circleButton,
            pressed && styles.circlePressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Sign in with Google"
        >
          {loading ? (
            <ActivityIndicator size="small" color="#4285F4" />
          ) : (
            <GoogleIcon size={24} />
          )}
        </Pressable>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
    );
  }

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
        icon={<GoogleIcon size={20} />}
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
  circleContainer: {
    alignItems: "center",
  },
  circleButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  circlePressed: {
    backgroundColor: "#F9FAFB",
    transform: [{ scale: 0.96 }],
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
  error: {
    color: colors.error,
    fontSize: 13,
    marginTop: spacing.sm,
    textAlign: "center",
  },
});
