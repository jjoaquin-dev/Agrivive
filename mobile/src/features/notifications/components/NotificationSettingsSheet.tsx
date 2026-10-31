import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Modal, Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { X } from "lucide-react-native";
import { colors, fonts, spacing } from "../../../theme";
import {
  fetchSellerNotificationSettings,
  updateSellerNotificationSettings,
} from "../api/seller-notification-settings";
import type { SellerNotificationSettings } from "../types";

interface Props {
  visible: boolean;
  onClose: () => void;
}

const rows: { key: keyof SellerNotificationSettings; label: string; hint: string }[] = [
  { key: "stockPrice", label: "Stock and Price", hint: "Running low, sold out, price lowered" },
  { key: "boost", label: "Boost", hint: "Boost posted or not posted" },
  { key: "account", label: "Account", hint: "Warnings and limits on your account" },
  { key: "nightMode", label: "Night Mode (9 PM – 6 AM)", hint: "Messages and reminders arrive quietly at night" },
];

export function NotificationSettingsSheet({ visible, onClose }: Props) {
  const [settings, setSettings] = useState<SellerNotificationSettings | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    setError(null);
    fetchSellerNotificationSettings()
      .then(setSettings)
      .catch(() => setError("Could not load your alert settings. Please try again."));
  }, [visible]);

  const toggle = useCallback(async (key: keyof SellerNotificationSettings, value: boolean) => {
    const previous = settings;
    setSettings((current) => (current ? { ...current, [key]: value } : current));
    setError(null);
    try {
      setSettings(await updateSellerNotificationSettings({ [key]: value }));
    } catch {
      setSettings(previous);
      setError("Could not save that change. Please try again.");
    }
  }, [settings]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.title}>Phone Alerts</Text>
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close phone alert settings"
              style={styles.closeBtn}
            >
              <X size={18} color={colors.textMuted} />
            </Pressable>
          </View>
          <Text style={styles.caption}>Your list always shows everything. These only change phone alerts.</Text>

          {settings ? rows.map((row) => (
            <View key={row.key} style={styles.row}>
              <View style={styles.rowText}>
                <Text style={styles.label}>{row.label}</Text>
                <Text style={styles.hint}>{row.hint}</Text>
              </View>
              <Switch
                value={settings[row.key]}
                onValueChange={(value) => void toggle(row.key, value)}
                trackColor={{ true: colors.primary, false: colors.border }}
                accessibilityLabel={row.label}
              />
            </View>
          )) : error ? null : <ActivityIndicator color={colors.primary} style={styles.loader} />}

          {error ? <Text style={styles.error}>{error}</Text> : null}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "flex-end" },
  sheet: { backgroundColor: colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontFamily: fonts.heading.bold, fontSize: 17, color: colors.text },
  closeBtn: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  caption: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted, marginBottom: spacing.md },
  row: {
    minHeight: 56, flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    borderTopWidth: 1, borderTopColor: colors.border, paddingVertical: spacing.sm,
  },
  rowText: { flex: 1, paddingRight: spacing.md },
  label: { fontFamily: fonts.body.semiBold, fontSize: 14, color: colors.text },
  hint: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted, marginTop: 2 },
  loader: { marginVertical: spacing.lg },
  error: { fontFamily: fonts.body.medium, fontSize: 13, color: colors.error, marginTop: spacing.sm },
});
