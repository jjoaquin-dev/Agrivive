import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Camera, ChevronLeft } from "lucide-react-native";
import { ButtonComponent } from "../../../components/ButtonComponent";
import { colors, fonts, spacing, touchTargets } from "../../../theme";

interface OrderScanPermissionProps {
  onAllow: () => void;
  onDismiss: () => void;
}

export function OrderScanPermission({ onAllow, onDismiss }: OrderScanPermissionProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.screen, { paddingTop: insets.top, paddingBottom: Math.max(insets.bottom, spacing.base) }]}>
      <Pressable onPress={onDismiss} accessibilityRole="button" accessibilityLabel="Go back" style={styles.back}>
        <ChevronLeft size={26} color={colors.text} />
      </Pressable>
      <View style={styles.body}>
        <View style={styles.iconWrap}><Camera size={36} color={colors.primary} /></View>
        <Text style={styles.title}>Camera access needed</Text>
        <Text style={styles.text}>Allow the camera so you can scan the buyer's pickup code.</Text>
      </View>
      <ButtonComponent title="Allow Camera" onPress={onAllow} style={styles.allow} />
      <ButtonComponent title="Not Now" variant="ghost" onPress={onDismiss} textStyle={styles.notNow} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.base },
  back: { width: touchTargets.min, height: touchTargets.min, justifyContent: "center" },
  body: { flex: 1, alignItems: "center", justifyContent: "center" },
  iconWrap: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primaryLight, alignItems: "center", justifyContent: "center" },
  title: { fontFamily: fonts.heading.bold, fontSize: 22, color: colors.text, marginTop: spacing.lg, textAlign: "center" },
  text: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 22, color: colors.textMuted, textAlign: "center", marginTop: spacing.sm, maxWidth: 300 },
  allow: { minHeight: touchTargets.min },
  notNow: { color: colors.textMuted },
});
