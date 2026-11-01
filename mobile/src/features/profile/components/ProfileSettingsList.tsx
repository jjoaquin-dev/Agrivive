import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Bell, ChevronRight, History, Lock, LogOut, ShieldCheck, Star } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import { profileColors } from "../profileTokens";

interface Props {
  twoFactorEnabled: boolean;
  onNotifications: () => void;
  onReviews: () => void;
  onTrust: () => void;
  onSecurity: () => void;
  onActivity: () => void;
  onSignOut: () => void;
}

export function ProfileSettingsList({ twoFactorEnabled, onNotifications, onReviews, onTrust, onSecurity, onActivity, onSignOut }: Props) {
  const items = [
    { title: "Ratings & Reviews", hint: "See customer feedback and reply to reviews", icon: Star, action: onReviews },
    { title: "Notification Preferences", hint: "Manage alerts, sound, and pickup reminders", icon: Bell, action: onNotifications },
    { title: "Trust & Account Records", hint: "Verified events, ratings, and standing", icon: ShieldCheck, action: onTrust },
    { title: "Sign-in Safety", hint: "Password and sign-in code", icon: Lock, action: onSecurity, badge: twoFactorEnabled ? "On" : "Off" },
    { title: "Change History", hint: "Amount changes and past updates", icon: History, action: onActivity },
  ];

  return (
    <View style={styles.card}>
      {items.map((item) => (
        <Pressable key={item.title} onPress={item.action} accessibilityRole="button" accessibilityLabel={item.title} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
          <View style={styles.icon}><item.icon size={20} color={colors.primary} /></View>
          <View style={styles.text}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.hint}>{item.hint}</Text>
          </View>
          {item.badge ? <View style={[styles.badge, item.badge === "On" && styles.badgeOn]}><Text style={[styles.badgeText, item.badge === "On" && styles.badgeTextOn]}>{item.badge}</Text></View> : null}
          <ChevronRight size={18} color={colors.textMuted} />
        </Pressable>
      ))}
      <Pressable onPress={onSignOut} accessibilityRole="button" accessibilityLabel="Log out" style={({ pressed }) => [styles.row, styles.logout, pressed && styles.logoutPressed]}>
        <View style={[styles.icon, styles.logoutIcon]}><LogOut size={20} color={profileColors.red} /></View>
        <Text style={styles.logoutText}>Log Out</Text>
        <ChevronRight size={18} color={profileColors.red} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radii.sheet, borderWidth: 1, borderColor: profileColors.border, overflow: "hidden", marginBottom: spacing.base },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md, minHeight: 64, paddingHorizontal: spacing.base, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: profileColors.border },
  pressed: { backgroundColor: "#F3F1EA" },
  icon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primaryLight, alignItems: "center", justifyContent: "center" },
  text: { flex: 1 },
  title: { fontFamily: fonts.heading.bold, fontSize: 15, color: colors.text },
  hint: { fontFamily: fonts.body.regular, fontSize: 12, lineHeight: 17, color: colors.textMuted, marginTop: 1 },
  badge: { backgroundColor: "#F3F1EA", borderRadius: radii.full, paddingHorizontal: 10, paddingVertical: 3 },
  badgeOn: { backgroundColor: profileColors.mint },
  badgeText: { fontFamily: fonts.body.semiBold, fontSize: 12, color: colors.textMuted },
  badgeTextOn: { color: profileColors.mintText },
  logout: { borderBottomWidth: 0, backgroundColor: "#FEF2F2" },
  logoutPressed: { backgroundColor: profileColors.redSoft },
  logoutIcon: { backgroundColor: profileColors.redSoft },
  logoutText: { flex: 1, fontFamily: fonts.heading.bold, fontSize: 15, color: profileColors.red },
});
