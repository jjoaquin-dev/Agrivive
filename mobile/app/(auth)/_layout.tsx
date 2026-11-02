import React from "react";
import { Stack } from "expo-router";
import { colors, fonts } from "../../src/theme";
import { RecaptchaHost } from "../../src/features/auth/components/RecaptchaHost";

export default function AuthLayout() {
  return (
    <>
    <RecaptchaHost />
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.primary,
        headerTitleStyle: {
          fontFamily: fonts.heading.bold,
          fontSize: 18,
          color: colors.text,
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen
        name="onboarding"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="login"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="email-otp-login"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="register"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="verify-email"
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="two-factor"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="forgot-password"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="account-recovery"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="password-setup"
        options={{ title: "Set Password", headerBackVisible: false }}
      />
    </Stack>
    </>
  );
}
