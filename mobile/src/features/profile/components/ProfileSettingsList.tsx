import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { Bell, ShieldCheck, Lock, History, ChevronRight, LogOut } from "lucide-react-native";
import { fonts, radii, spacing } from "../../../theme";

interface ProfileSettingsListProps {
  onNotifications: () => void;
  onTrust: () => void;
  onSecurity: () => void;
  onActivity: () => void;
  onSignOut: () => void;
}

export const ProfileSettingsList: React.FC<ProfileSettingsListProps> = ({
  onNotifications,
  onTrust,
  onSecurity,
  onActivity,
  onSignOut,
}) => {
  const items = [
    {
      title: "Notification Preferences",
      subtitle: "Manage alerts, sound, and pickup reminders",
      icon: <Bell size={18} color="#D97706" />,
      action: onNotifications,
    },
    {
      title: "Trust & Account Records",
      subtitle: "Verified events, ratings, and standing",
      icon: <ShieldCheck size={18} color="#16A34A" />,
      action: onTrust,
    },
    {
      title: "Security & Account",
      subtitle: "Password, Two-Factor Authenticator (2FA)",
      icon: <Lock size={18} color="#2563EB" />,
      action: onSecurity,
    },
    {
      title: "Change History & Ledger",
      subtitle: "Surplus stock adjustments and audit history",
      icon: <History size={18} color="#7C3AED" />,
      action: onActivity,
    },
  ];

  return (
    <View style={styles.container}>
      {items.map((item) => (
        <Pressable
          key={item.title}
          onPress={item.action}
          accessibilityRole="button"
          accessibilityLabel={item.title}
          style={({ pressed }) => [styles.navItem, pressed && styles.itemPressed]}
        >
          <View style={styles.iconCircle}>{item.icon}</View>
          <View style={styles.textWrap}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
          </View>
          <ChevronRight size={18} color="#94A3B8" />
        </Pressable>
      ))}

      {/* Log Out Button */}
      <Pressable
        onPress={onSignOut}
        accessibilityRole="button"
        accessibilityLabel="Sign out of account"
        style={({ pressed }) => [styles.logoutBtn, pressed && styles.logoutBtnPressed]}
      >
        <LogOut size={16} color="#DC2626" />
        <Text style={styles.logoutText}>Log Out</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
    marginBottom: spacing.xxl,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: radii.card || 14,
    borderWidth: 1,
    borderColor: "#E5E2DA",
    padding: spacing.base,
  },
  itemPressed: {
    backgroundColor: "#F8FAFC",
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  textWrap: {
    flex: 1,
  },
  itemTitle: {
    fontFamily: fonts.heading.bold,
    fontSize: 14,
    color: "#0F172A",
  },
  itemSubtitle: {
    fontFamily: fonts.body.regular,
    fontSize: 11,
    color: "#64748B",
    marginTop: 1,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#FCA5A5",
    borderRadius: radii.card || 14,
    paddingVertical: 14,
    marginTop: spacing.xs,
  },
  logoutBtnPressed: {
    backgroundColor: "#FEF2F2",
  },
  logoutText: {
    fontFamily: fonts.heading.bold,
    fontSize: 14,
    color: "#DC2626",
  },
});
