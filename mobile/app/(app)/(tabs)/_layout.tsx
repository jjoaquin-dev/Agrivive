import React from "react";
import { Tabs } from "expo-router";
import { Home, Package, ArrowLeftRight, User, ClipboardList } from "lucide-react-native";
import { colors, fonts } from "../../../src/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerShadowVisible: false,
        headerTintColor: colors.primary,
        headerTitleStyle: {
          fontFamily: fonts.heading.bold,
          fontSize: 18,
          color: colors.text,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.body.medium,
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size || 22} />,
        }}
      />
      <Tabs.Screen
        name="inventory"
        options={{
          title: "Inventory",
          tabBarIcon: ({ color, size }) => <Package color={color} size={size || 22} />,
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: "Activity",
          tabBarIcon: ({ color, size }) => <ArrowLeftRight color={color} size={size || 22} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Reservations",
          tabBarIcon: ({ color, size }) => <ClipboardList color={color} size={size || 22} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <User color={color} size={size || 22} />,
        }}
      />
    </Tabs>
  );
}
