import React from "react";
import { Redirect, useRouter } from "expo-router";
import { useAuth } from "../src/context/AuthContext";
import { AppLoadingScreen } from "../src/features/app-start/AppLoadingScreen";
import { AppProblemScreen } from "../src/features/app-start/AppProblemScreen";
import { classifyStartProblem } from "../src/features/app-start/classifyStartProblem";

export default function Index() {
  const router = useRouter();
  const {
    isReady,
    isOnboardingCompleted,
    session,
    isSessionPending,
    setup,
    loadingSetup,
    setupError,
    setupErrorStatus,
    refreshSetup,
    signOut,
  } = useAuth();

  // 1. Wait for local storage, the saved session, and the account details
  if (!isReady || isSessionPending || (session?.user && loadingSetup)) {
    return <AppLoadingScreen onRetry={() => void refreshSetup()} />;
  }

  // 3. Unauthenticated entry point: check if onboarding was already completed
  if (!session?.user) {
    if (isOnboardingCompleted) {
      return <Redirect href="/(auth)/login" />;
    }
    return <Redirect href="/(auth)/onboarding" />;
  }

  // 4. The account could not be loaded: say why and offer the next step
  if (setupError && !setup) {
    return (
      <AppProblemScreen
        problem={classifyStartProblem(setupErrorStatus, setupError)}
        email={session?.user?.email}
        retrying={loadingSetup}
        onRetry={() => void refreshSetup()}
        onRestore={() => router.push({ pathname: "/(auth)/account-recovery", params: { email: session?.user?.email ?? "" } })}
        onLogOut={() => void signOut()}
      />
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

    if (setup.passwordSetupRequired || setup.nextStep === "password-setup") {
      return <Redirect href="/(auth)/password-setup" />;
    }

    if (setup.sellerVerified || setup.nextStep === "ready") {
      return <Redirect href="/(app)/(tabs)/home" />;
    }
  }

  // Never send an authenticated account without setup state to product screens.
  if (session?.user) {
    return <Redirect href="/(app)/profile/setup" />;
  }

  // Default to home tab only after setup has been confirmed.
  return <Redirect href="/(app)/(tabs)/home" />;
}
