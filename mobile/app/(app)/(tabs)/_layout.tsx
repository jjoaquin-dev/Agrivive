import React from "react";
import { ColorValue, Text, useWindowDimensions } from "react-native";
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
import { surface } from "../../../src/theme/surface";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const badgeStyle = {
  backgroundColor: colors.error,
  fontSize: 10,
  fontFamily: fonts.body.semiBold,
  color: colors.white,
};
const badge = (n: number) => (n > 0 ? (n > 9 ? "9+" : n) : undefined);

/** Tab names grow with the phone's text size, but only up to a point so five tabs still fit on one row. */
const LABEL_SCALE_CAP = 1.3;
const LABEL_SIZE = 11;

function TabLabel({ color, children }: { color: ColorValue; children: string }) {
  return (
    <Text
      numberOfLines={1}
      adjustsFontSizeToFit
      minimumFontScale={0.8}
      maxFontSizeMultiplier={LABEL_SCALE_CAP}
      style={{ color, fontFamily: fonts.body.medium, fontSize: LABEL_SIZE, textAlign: "center" }}
    >
      {children}
    </Text>
  );
}

export default function TabsLayout() {
  const { messages: unreadCount, orders: newOrders } = useAlertCounts();
  // Keep the bar clear of the phone's gesture line or Back/Home/Recent buttons.
  const bottomPad = Math.max(useSafeAreaInsets().bottom, 8);
  // Make the bar taller when text is large, so the icon and name are never cut off.
  const labelScale = Math.min(useWindowDimensions().fontScale, LABEL_SCALE_CAP);
  const barHeight = 8 + 26 + 4 + Math.ceil(LABEL_SIZE * 1.4 * labelScale) + 8 + bottomPad;
  useAlertRefresh();

  return (
    <Tabs
      screenListeners={{ focus: () => void refreshAlerts() }}
      screenOptions={{
        headerStyle: {
          backgroundColor: surface.page,
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
          backgroundColor: "#FFFFFF",
          borderTopColor: "#EEECE6",
          borderTopWidth: 1,
          height: barHeight,
          paddingBottom: bottomPad,
          paddingTop: 8,
        },
        tabBarLabel: ({ color, children }) => <TabLabel color={color}>{children}</TabLabel>,
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
