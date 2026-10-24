import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Platform } from "react-native";
import { Tabs, useRouter } from "expo-router";
import {
  Home,
  LayoutGrid,
  Plus,
  MessageCircle,
  MessageCircleMore,
  CalendarDays,
} from "lucide-react-native";
import { colors, fonts } from "../../../src/theme";
import { fetchSellerMessages } from "../../../src/features/messages/api/seller-messages";

export default function TabsLayout() {
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let mounted = true;
    const checkUnread = async () => {
      try {
        const res = await fetchSellerMessages({ status: "open", limit: 1 });
        if (mounted) setUnreadCount(res.openCount || 0);
      } catch {}
    };
    void checkUnread();
    const interval = setInterval(checkUnread, 30000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

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
        tabBarActiveTintColor: "#16A34A",
        tabBarInactiveTintColor: "#6B7280",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E5E7EB",
          borderTopWidth: 1,
          height: Platform.OS === "ios" ? 84 : 64,
          paddingBottom: Platform.OS === "ios" ? 22 : 8,
          paddingTop: 8,
          overflow: "visible",
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
              fill={focused ? "#16A34A" : "transparent"}
              size={size || 22}
            />
          ),
        }}
      />

      {/* 2. Listings (Inventory) */}
      <Tabs.Screen
        name="inventory"
        options={{
          title: "Listings",
          tabBarIcon: ({ color, size }) => (
            <LayoutGrid color={color} size={size || 22} />
          ),
        }}
      />

      {/* 3. Center Elevated Floating Add Button */}
      <Tabs.Screen
        name="create"
        options={{
          title: "Add",
          tabBarLabel: () => <Text style={styles.addLabel}>Add</Text>,
          tabBarIcon: () => (
            <View style={styles.floatingButton}>
              <Plus size={24} color="#FFFFFF" strokeWidth={2.8} />
            </View>
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push("/(app)/inventory/create");
          },
        }}
      />

      {/* 4. Messages */}
      <Tabs.Screen
        name="messages"
        options={{
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

      {/* 5. Reservations (Orders) */}
      <Tabs.Screen
        name="orders"
        options={{
          title: "Reservations",
          tabBarIcon: ({ color, size }) => (
            <CalendarDays color={color} size={size || 22} />
          ),
        }}
      />

      {/* Profile: Hidden from dock, accessed via top header avatar */}
      <Tabs.Screen
        name="profile"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#16A34A",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -22,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 6,
  },
  addLabel: {
    fontFamily: fonts.body.medium,
    fontSize: 11,
    color: "#16A34A",
    marginTop: 2,
  },
});
