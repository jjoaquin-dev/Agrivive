import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import * as SecureStore from "expo-secure-store";
import { authClient } from "../api/client";
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

  const { data: session, isPending: isSessionPendingRaw } = authClient.useSession();
  const [sessionTimedOut, setSessionTimedOut] = useState<boolean>(false);

  // Safety timer: avoid hanging on initial session check if network or API hangs
  useEffect(() => {
    const timer = setTimeout(() => {
      setSessionTimedOut(true);
    }, 2000);
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
    try {
      const data = await fetchSellerSetup();
      setSetup(data);
      return data;
    } catch (err: any) {
      if (err?.statusCode === 401) {
        setSetup(null);
        return null;
      }
      console.error("Failed to fetch seller setup", err);
      setSetupError(err?.message || "Failed to load seller setup status");
      return null;
    } finally {
      setLoadingSetup(false);
    }
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
