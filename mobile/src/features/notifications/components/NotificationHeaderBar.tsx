import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ChevronLeft, CheckCheck, Settings } from "lucide-react-native";
import { useRouter } from "expo-router";
import { colors, fonts, radii, spacing } from "../../../theme";
import { safeBack } from "../../../utils/safeBack";

interface Props {
  unreadCount: number;
  onMarkAllRead: () => void;
  onOpenSettings: () => void;
}

export function NotificationHeaderBar({ unreadCount, onMarkAllRead, onOpenSettings }: Props) {
  const router = useRouter();
  const hasUnread = unreadCount > 0;
  return (
    <View style={styles.container}>
      <Pressable onPress={() => safeBack(router)} accessibilityRole="button" accessibilityLabel="Go back" style={[styles.button, styles.left]}>
        <ChevronLeft size={24} color={colors.text} />
      </Pressable>
      <Text style={styles.title} pointerEvents="none">Notifications</Text>
      <View style={styles.right}>
        <Pressable onPress={onOpenSettings} accessibilityRole="button" accessibilityLabel="Phone alert settings" style={styles.button}>
          <Settings size={20} color={colors.text} />
        </Pressable>
        <Pressable
          onPress={onMarkAllRead}
          disabled={!hasUnread}
          accessibilityRole="button"
          accessibilityLabel="Mark all notifications as read"
          accessibilityState={{ disabled: !hasUnread }}
          style={[styles.button, !hasUnread && styles.disabled]}
        >
          <CheckCheck size={20} color={colors.text} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: 56, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: spacing.base, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  button: { width: 44, height: 44, borderRadius: radii.full, alignItems: "center", justifyContent: "center" },
  left: { marginLeft: -spacing.sm },
  right: { flexDirection: "row", alignItems: "center", marginRight: -spacing.sm },
  title: { position: "absolute", left: 0, right: 0, textAlign: "center", fontFamily: fonts.heading.semiBold, fontSize: 17, color: colors.text },
  disabled: { opacity: 0.35 },
});
