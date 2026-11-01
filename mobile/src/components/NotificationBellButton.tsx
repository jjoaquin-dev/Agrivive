import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Bell } from "lucide-react-native";
import { colors, radii, touchTargets } from "../theme";

interface NotificationBellButtonProps {
  unreadCount?: number;
  onPress: () => void;
}

/** One bell for every screen header, so the alert dot and tap size look the same everywhere (Jakob's Law, Nielsen; Law of Similarity, Gestalt). */
export const NotificationBellButton: React.FC<NotificationBellButtonProps> = ({ unreadCount = 0, onPress }) => {
  const hasUnread = unreadCount > 0;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={hasUnread ? `${unreadCount} unread notifications` : "Notifications"}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Bell size={20} color={colors.text} />
      {hasUnread ? <View style={styles.dot} /> : null}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: { width: touchTargets.min, height: touchTargets.min, borderRadius: radii.full, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" },
  pressed: { opacity: 0.7, transform: [{ scale: 0.96 }] },
  dot: { position: "absolute", top: 11, right: 12, width: 9, height: 9, borderRadius: 5, backgroundColor: colors.error, borderWidth: 1.5, borderColor: colors.surface },
});
