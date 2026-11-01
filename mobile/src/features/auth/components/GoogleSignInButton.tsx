import React, { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import * as Linking from "expo-linking";
import { usePathname, useRouter } from "expo-router";
import { authClient } from "../../../api/client";
import { useAuth } from "../../../context/AuthContext";
import { colors, fonts, radii, spacing } from "../../../theme";

function GoogleIcon({ size = 20 }: { size?: number }) {
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

export interface GoogleSignInButtonProps {
  title?: string;
  showDivider?: boolean;
}

export function GoogleSignInButton({
  title = "Log In with Google",
  showDivider = false,
}: GoogleSignInButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { refreshSetup, completeOnboarding } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    if (loading) return;
    setLoading(true);
    setError("");

    try {
      // Return to the screen we started on so the app does not bounce through the index redirect.
      const callbackURL = Linking.createURL(pathname);
      const response = await authClient.signIn.social({
        provider: "google",
        callbackURL,
      });

      if (response.error) {
        setError(response.error.message || "Google sign-in is not available right now.");
        return;
      }

      // Closing the Google window returns without an error and without a session.
      const current = await authClient.getSession();
      if (!current.data?.user) return;

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

      router.replace("/");
    } catch (err: any) {
      console.error("[Google Sign-In Error]", err);
      const msg = err?.message || "";
      if (msg.includes("Network") || msg.includes("Failed to connect")) {
        setError("Could not connect to authentication server. Check your network.");
      } else {
        setError(msg || "We could not start Google sign-in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {showDivider ? (
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>
      ) : null}

      <Pressable
        onPress={() => void handleGoogleSignIn()}
        disabled={loading}
        style={({ pressed }) => [
          styles.pillButton,
          pressed && styles.pillPressed,
          loading && styles.pillDisabled,
        ]}
        accessibilityRole="button"
        accessibilityLabel={title}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#4285F4" style={styles.spinner} />
        ) : (
          <GoogleIcon size={20} />
        )}
        <Text style={styles.pillText}>{title}</Text>
      </Pressable>

      {error ? <Text style={styles.error} accessibilityRole="alert">{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  pillButton: {
    width: "100%",
    height: 52,
    borderRadius: radii.button,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  pillPressed: {
    backgroundColor: "#F9FAFB",
    transform: [{ scale: 0.985 }],
  },
  pillDisabled: {
    opacity: 0.7,
  },
  spinner: {
    marginRight: 2,
  },
  pillText: {
    fontFamily: fonts.body.semiBold,
    fontSize: 15,
    color: "#374151",
    fontWeight: "600",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    color: colors.textMuted,
    fontSize: 13,
  },
  error: {
    color: colors.error,
    fontSize: 13,
    marginTop: spacing.sm,
    textAlign: "center",
    fontFamily: fonts.body.medium,
  },
});
