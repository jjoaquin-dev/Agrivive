import React from "react";
import { Stack } from "expo-router";
import { colors, fonts } from "../../src/theme";

export default function AuthLayout() {
  return (
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
        options={{ title: "Sign In", headerBackVisible: true }}
      />
      <Stack.Screen
        name="register"
        options={{ title: "Create Seller Account" }}
      />
      <Stack.Screen
        name="verify-email"
        options={{ title: "Verify Email", headerBackVisible: false }}
      />
      <Stack.Screen
        name="two-factor"
        options={{ title: "Two-Factor Authentication" }}
      />
    </Stack>
  );
}
