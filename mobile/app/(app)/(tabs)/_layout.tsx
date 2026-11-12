import React from "react";
import { Platform } from "react-native";
import { Tabs } from "expo-router";
import {
  Home,
  LayoutGrid,
  MessageCircle,
  MessageCircleMore,
  CalendarDays,
  Megaphone,
} from "lucide-react-native";
import { colors, fonts } from "../../../src/theme";
import { refreshAlerts, useAlertCounts, useAlertRefresh } from "../../../src/features/alerts/alertStore";

const badgeStyle = {
  backgroundColor: colors.error,
  fontSize: 10,
  fontFamily: fonts.body.semiBold,
  color: colors.white,
};
const badge = (n: number) => (n > 0 ? (n > 9 ? "9+" : n) : undefined);

export default function TabsLayout() {
  const { messages: unreadCount, orders: newOrders } = useAlertCounts();
  useAlertRefresh();

  return (
    <Tabs
      screenListeners={{ focus: () => void refreshAlerts() }}
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
          backgroundColor: colors.white,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: Platform.OS === "ios" ? 84 : 64,
          paddingBottom: Platform.OS === "ios" ? 22 : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.body.medium,
          fontSize: 11,
        },
      }}
    >
      {/* 1. Home */}
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ focused, color, size }) => (
            <Home
              color={color}
              fill={focused ? colors.primary : "transparent"}
              size={size || 22}
            />
          ),
        }}
      />

      {/* 2. Reservations (Orders) */}
      <Tabs.Screen
        name="orders"
        options={{
          headerShown: false,
          title: "Reservations",
          tabBarBadge: badge(newOrders),
          tabBarBadgeStyle: badgeStyle,
          tabBarIcon: ({ color, size }) => (
            <CalendarDays color={color} size={size || 22} />
          ),
        }}
      />

      {/* 3. Listings (Inventory) */}
      <Tabs.Screen
        name="inventory"
        options={{
          headerShown: false,
          title: "Listings",
          tabBarIcon: ({ color, size }) => (
            <LayoutGrid color={color} size={size || 22} />
          ),
        }}
      />

      {/* 4. Messages */}
      <Tabs.Screen
        name="messages"
        options={{
          headerShown: false,
          title: "Messages",
          tabBarBadge: badge(unreadCount),
          tabBarBadgeStyle: badgeStyle,
          tabBarIcon: ({ color, size }) =>
            unreadCount > 0 ? (
              <MessageCircleMore color={color} size={size || 22} />
            ) : (
              <MessageCircle color={color} size={size || 22} />
            ),
        }}
      />

      {/* 5. Boost (the profile opens from the picture on Home) */}
      <Tabs.Screen
        name="marketing"
        options={{
          title: "Boost",
          tabBarIcon: ({ color, size }) => (
            <Megaphone color={color} size={size || 22} />
          ),
        }}
      />
    </Tabs>
  );
}
