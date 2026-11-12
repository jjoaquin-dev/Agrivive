import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Bell, CalendarClock, ChevronRight, FileText, History, Lock, Shield, ShieldCheck } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import { profileColors } from "../profileTokens";
import { openLegalPage } from "../../legal/legalLinks";

interface Props {
  twoFactorEnabled: boolean;
  onNotifications: () => void;
  onTrust: () => void;
  onStall: () => void;
  onSecurity: () => void;
  onActivity: () => void;
}

type Item = { title: string; hint: string; icon: typeof Bell; action: () => void; badge?: string };

/** Settings in three groups so each list is short: the store, the account, and the rules (Gestalt common region, Wertheimer, Koffka, Köhler). */
export function ProfileSettingsList({ twoFactorEnabled, onNotifications, onTrust, onStall, onSecurity, onActivity }: Props) {
  const groups: { label: string; items: Item[] }[] = [
    { label: "Your store", items: [
      { title: "Stall Hours", hint: "Opening hours and Closed today", icon: CalendarClock, action: onStall },
      { title: "Change History", hint: "Amount changes and past updates", icon: History, action: onActivity },
    ] },
    { label: "Account and safety", items: [
      { title: "Notification Preferences", hint: "Alerts, sound, and pickup reminders", icon: Bell, action: onNotifications },
      { title: "Privacy and Security", hint: "Password and sign-in code", icon: Lock, action: onSecurity, badge: twoFactorEnabled ? "On" : "Off" },
      { title: "Trust & Account Records", hint: "Verified events, ratings, and standing", icon: ShieldCheck, action: onTrust },
    ] },
    { label: "About", items: [
      { title: "Privacy Policy", hint: "What we collect and how we use it", icon: Shield, action: () => void openLegalPage("privacy") },
      { title: "Terms of Use", hint: "The rules for using Agrivive", icon: FileText, action: () => void openLegalPage("terms") },
    ] },
  ];

  return (
    <>
      {groups.map((group) => (
        <View key={group.label} style={styles.group}>
          <Text style={styles.groupLabel}>{group.label}</Text>
          <View style={styles.card}>
            {group.items.map((item, index) => (
              <Pressable key={item.title} onPress={item.action} accessibilityRole="button" accessibilityLabel={item.title}
                style={({ pressed }) => [styles.row, index > 0 && styles.rowDivider, pressed && styles.pressed]}>
                <View style={styles.icon}><item.icon size={20} color={colors.primary} /></View>
                <View style={styles.text}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.hint}>{item.hint}</Text>
                </View>
                {item.badge ? <View style={[styles.badge, item.badge === "On" && styles.badgeOn]}><Text style={[styles.badgeText, item.badge === "On" && styles.badgeTextOn]}>{item.badge}</Text></View> : null}
                <ChevronRight size={18} color={colors.textMuted} />
              </Pressable>
            ))}
          </View>
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  group: { marginBottom: spacing.base },
  groupLabel: { fontFamily: fonts.heading.bold, fontSize: 14, color: colors.textMuted, marginBottom: spacing.sm, marginLeft: spacing.xs },
  card: { backgroundColor: colors.white, borderRadius: radii.sheet, borderWidth: 1, borderColor: profileColors.border, overflow: "hidden" },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md, minHeight: 64, paddingHorizontal: spacing.base, paddingVertical: spacing.sm },
  rowDivider: { borderTopWidth: 1, borderTopColor: profileColors.border },
  pressed: { backgroundColor: "#FAF9F6" },
  icon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primaryLight, alignItems: "center", justifyContent: "center" },
  text: { flex: 1 },
  title: { fontFamily: fonts.heading.bold, fontSize: 15, color: colors.text },
  hint: { fontFamily: fonts.body.regular, fontSize: 13, lineHeight: 18, color: colors.textMuted, marginTop: 1 },
  badge: { backgroundColor: "#F6F5F1", borderRadius: radii.full, paddingHorizontal: 10, paddingVertical: 3 },
  badgeOn: { backgroundColor: profileColors.mint },
  badgeText: { fontFamily: fonts.body.semiBold, fontSize: 12, color: colors.textMuted },
  badgeTextOn: { color: profileColors.mintText },
});
