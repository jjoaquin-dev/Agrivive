import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import * as SecureStore from "expo-secure-store";
import { authClient, setAccountClosedHandler } from "../api/client";
import { fetchSellerSetup, SellerSetupResponse } from "../api/seller";

const ONBOARDING_KEY = "agrivive_onboarding_completed";

interface AuthContextType {
  isOnboardingCompleted: boolean;
  completeOnboarding: () => Promise<void>;
  resetOnboarding: () => Promise<void>;
  session: ReturnType<typeof authClient.useSession>["data"];
  isSessionPending: boolean;
  setup: SellerSetupResponse | null;
  loadingSetup: boolean;
  setupError: string | null;
  /** HTTP status of the failed account load. 0 means no answer at all. */
  setupErrorStatus: number;
  refreshSetup: () => Promise<SellerSetupResponse | null>;
  signOut: () => Promise<void>;
  isReady: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [setup, setSetup] = useState<SellerSetupResponse | null>(null);
  const [loadingSetup, setLoadingSetup] = useState<boolean>(false);
  const [setupError, setSetupError] = useState<string | null>(null);
  const [setupErrorStatus, setSetupErrorStatus] = useState<number>(0);

  const { data: session, isPending: isSessionPendingRaw } = authClient.useSession();
  const [sessionTimedOut, setSessionTimedOut] = useState<boolean>(false);

  // Safety timer: avoid hanging on initial session check if network or API hangs
  useEffect(() => {
    const timer = setTimeout(() => {
      setSessionTimedOut(true);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const isSessionPending = isSessionPendingRaw && !sessionTimedOut;

  // Load onboarding state from SecureStore
  useEffect(() => {
    async function loadInitialState() {
      try {
        const completed = await SecureStore.getItemAsync(ONBOARDING_KEY);
        setIsOnboardingCompleted(completed === "true");
      } catch (err) {
        console.error("Failed to load onboarding status", err);
      } finally {
        setIsReady(true);
      }
    }
    loadInitialState();
  }, []);

  const refreshSetup = useCallback(async (): Promise<SellerSetupResponse | null> => {
    setLoadingSetup(true);
    setSetupError(null);
    setSetupErrorStatus(0);
    try {
      const data = await fetchSellerSetup();
      setSetup(data);
      return data;
    } catch (err: any) {
      if (err?.statusCode === 401) {
        setSetup(null);
        return null;
      }
      // A paused or blocked account is an expected answer, so it gets a quiet log instead of a red error screen.
      if (err?.statusCode === 403) console.warn("Account is not open:", err?.message);
      else console.error("Failed to fetch seller setup", err);
      setSetupError(err?.message || "Failed to load seller setup status");
      setSetupErrorStatus(typeof err?.statusCode === "number" ? err.statusCode : 0);
      return null;
    } finally {
      setLoadingSetup(false);
    }
  }, []);

  // Any screen that gets "account paused or blocked" from the server sends the app back to the problem screen.
  useEffect(() => {
    setAccountClosedHandler((message) => {
      setSetup(null);
      setSetupError(message);
      setSetupErrorStatus(403);
    });
    return () => setAccountClosedHandler(null);
  }, []);

  // Sync setup state whenever user logs in or user changes
  useEffect(() => {
    if (session?.user) {
      refreshSetup();
    } else {
      setSetup(null);
    }
  }, [session?.user?.id, refreshSetup]);

  const completeOnboarding = async () => {
    try {
      await SecureStore.setItemAsync(ONBOARDING_KEY, "true");
      setIsOnboardingCompleted(true);
    } catch (err) {
      console.error("Failed to persist onboarding state", err);
    }
  };

  const resetOnboarding = async () => {
    try {
      await SecureStore.deleteItemAsync(ONBOARDING_KEY);
      setIsOnboardingCompleted(false);
    } catch (err) {
      console.error("Failed to reset onboarding state", err);
    }
  };

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      setSetup(null);
    } catch (err) {
      console.error("Sign out error", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isOnboardingCompleted,
        completeOnboarding,
        resetOnboarding,
        session,
        isSessionPending,
        setup,
        loadingSetup,
        setupError,
        setupErrorStatus,
        refreshSetup,
        signOut: handleSignOut,
        isReady,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
