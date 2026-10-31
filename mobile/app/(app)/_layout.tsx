import React from "react";
import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";
import { colors, fonts } from "../../src/theme";

export default function AppLayout() {
  const { session, setup, isSessionPending, loadingSetup } = useAuth();

  if (!isSessionPending && !loadingSetup && session?.user && setup?.profileComplete && setup.passwordSetupRequired) {
    return <Redirect href="/(auth)/password-setup" />;
  }

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
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Ephemeral Modals */}
      <Stack.Screen
        name="orders/scan"
        options={{
          presentation: "fullScreenModal",
          animation: "slide_from_bottom",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="inventory/create"
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
          title: "Add Produce",
        }}
      />
      <Stack.Screen
        name="inventory/[id]/stock"
        options={{
          presentation: "formSheet",
          animation: "slide_from_bottom",
          title: "Change Amount",
        }}
      />

      {/* Hierarchical Detail Pages */}
      <Stack.Screen name="inventory/[id]/index" options={{ title: "Product Details" }} />
      <Stack.Screen name="inventory/[id]/edit" options={{ title: "Edit Product" }} />
      <Stack.Screen name="orders/[id]" options={{ title: "Order Details" }} />
      <Stack.Screen name="notifications" options={{ title: "Notifications" }} />
      <Stack.Screen name="conversations/[id]" options={{ title: "Conversation" }} />
      <Stack.Screen name="activity" options={{ title: "Change History" }} />
      <Stack.Screen name="analytics" options={{ title: "Analytics" }} />
      <Stack.Screen name="marketing/index" options={{ title: "Marketing" }} />
      <Stack.Screen name="marketing/[productId]" options={{ title: "Preview Boost" }} />
      <Stack.Screen name="marketing/started" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="advisories" options={{ title: "Advisories" }} />
      <Stack.Screen name="trust" options={{ title: "Trust History" }} />
      <Stack.Screen name="reviews" options={{ title: "Ratings & Reviews" }} />
      <Stack.Screen name="profile/index" options={{ title: "Seller Profile" }} />
      <Stack.Screen name="profile/setup" options={{ headerShown: false }} />
      <Stack.Screen name="profile/edit" options={{ title: "Edit Profile" }} />
      <Stack.Screen name="profile/security" options={{ title: "Security & 2FA" }} />
    </Stack>
  );
}
