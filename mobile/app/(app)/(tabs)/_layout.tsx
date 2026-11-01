import React, { useCallback, useEffect, useState } from "react";
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
import { fetchConversationUnreadCount } from "../../../src/features/conversations/api";
import { useRefreshOnSignal } from "../../../src/hooks/useRefreshOnSignal";

export default function TabsLayout() {
  const [unreadCount, setUnreadCount] = useState(0);

  const checkUnread = useCallback(async () => {
    try {
      const res = await fetchConversationUnreadCount();
      setUnreadCount(res.unreadMessages ?? 0);
    } catch {}
  }, []);

  // No timer: refresh on open, on app foreground, and when a message push arrives.
  useEffect(() => { void checkUnread(); }, [checkUnread]);
  useRefreshOnSignal(checkUnread, { pushTypes: ["seller_message"] });

  return (
    <Tabs
      screenListeners={{ focus: () => void checkUnread() }}
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
        tabBarInactiveTintColor: "#636B63",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E5E2DA",
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
          tabBarBadge:
            unreadCount > 0 ? (unreadCount > 9 ? "9+" : unreadCount) : undefined,
          tabBarBadgeStyle: {
            backgroundColor: "#EF4444",
            fontSize: 10,
            fontFamily: fonts.body.semiBold,
            color: "#FFFFFF",
          },
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
