import React from "react";
import { Stack } from "expo-router";
import { colors, fonts } from "../../src/theme";

export default function AppLayout() {
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
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="inventory/create"
        options={{
          title: "Add Product",
        }}
      />
      <Stack.Screen
        name="inventory/[id]/index"
        options={{
          title: "Product Details",
        }}
      />
      <Stack.Screen
        name="inventory/[id]/edit"
        options={{
          title: "Edit Product",
        }}
      />
      <Stack.Screen
        name="inventory/[id]/stock"
        options={{
          title: "Change Amount",
        }}
      />
      <Stack.Screen
        name="orders/[id]"
        options={{
          title: "Order Details",
        }}
      />
      <Stack.Screen
        name="orders/scan"
        options={{
          title: "Scan Buyer QR",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          title: "Notifications",
        }}
      />
      <Stack.Screen
        name="messages"
        options={{
          title: "Messages",
        }}
      />
      <Stack.Screen
        name="trust"
        options={{
          title: "Trust history",
        }}
      />
      <Stack.Screen
        name="profile/index"
        options={{
          title: "Seller Profile",
        }}
      />
      <Stack.Screen
        name="profile/setup"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="profile/edit"
        options={{
          title: "Edit Profile",
        }}
      />
      <Stack.Screen
        name="profile/security"
        options={{
          title: "Security & 2FA",
        }}
      />
    </Stack>
  );
}
