import React from "react";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
import { Redirect } from "expo-router";
import { useAuth } from "../src/context/AuthContext";
import { colors, spacing } from "../src/theme";
import { ButtonComponent } from "../src/components/ButtonComponent";

export default function Index() {
  const {
    isReady,
    isOnboardingCompleted,
    session,
    isSessionPending,
    setup,
    loadingSetup,
    setupError,
    refreshSetup,
  } = useAuth();

  // 1. Wait for local storage initialization
  if (!isReady) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // 2. Check session status
  if (isSessionPending) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // 3. Unauthenticated entry point: check if onboarding was already completed
  if (!session?.user) {
    if (isOnboardingCompleted) {
      return <Redirect href="/(auth)/login" />;
    }
    return <Redirect href="/(auth)/onboarding" />;
  }

  // 3. Loading setup state
  if (loadingSetup) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Connecting to Agrivive...</Text>
      </View>
    );
  }

  // 4. If error loading setup, provide retry option
  if (setupError && !setup) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>Connection Error</Text>
        <Text style={styles.errorMessage}>{setupError}</Text>
        <ButtonComponent
          title="Retry"
          onPress={() => refreshSetup()}
          style={styles.retryButton}
        />
      </View>
    );
  }

  // 5. Server-driven routing based on setup state
  if (setup) {
    if (!setup.emailVerified || setup.nextStep === "verify-email") {
      return <Redirect href="/(auth)/verify-email" />;
    }

    if (!setup.profileComplete || setup.nextStep === "profile") {
      return <Redirect href="/(app)/profile/setup" />;
    }

    if (setup.sellerVerified || setup.nextStep === "ready") {
      return <Redirect href="/(app)/(tabs)/home" />;
    }
  }

  // Default to home tab if authenticated
  return <Redirect href="/(app)/(tabs)/home" />;
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.textMuted,
    fontSize: 14,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  errorMessage: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  retryButton: {
    minWidth: 140,
  },
});
