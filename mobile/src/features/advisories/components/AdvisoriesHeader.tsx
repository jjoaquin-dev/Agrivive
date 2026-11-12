import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, Info } from "lucide-react-native";
import { colors, fonts, spacing, typography } from "../../../theme";
import { safeBack } from "../../../utils/safeBack";
import { surface } from "../../../theme/surface";

interface AdvisoriesHeaderProps {
  generatedAt?: string;
  onOpenInfo: () => void;
}

function formatUpdated(timestamp?: string) {
  if (!timestamp) return "Pull down to refresh";
  const time = new Date(timestamp).toLocaleTimeString("en-US", { timeZone: "Asia/Manila", hour: "numeric", minute: "2-digit" });
  return `Updated ${time} · Pull down to refresh`;
}

/** Back on the left, info on the right: the layout people already know from other apps (Jakob's Law, Nielsen). */
export const AdvisoriesHeader: React.FC<AdvisoriesHeaderProps> = ({ generatedAt, onOpenInfo }) => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Pressable onPress={() => safeBack(router)} accessibilityRole="button" accessibilityLabel="Go back" style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
          <ArrowLeft size={20} color={colors.text} />
        </Pressable>
        <Text style={styles.title} numberOfLines={1}>Weather & Holidays</Text>
        <Pressable onPress={onOpenInfo} accessibilityRole="button" accessibilityLabel="About this page" style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
          <Info size={20} color={colors.text} />
        </Pressable>
      </View>
      <Text style={styles.caption}>{formatUpdated(generatedAt)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: spacing.base, paddingTop: spacing.sm, paddingBottom: spacing.sm, backgroundColor: surface.page },
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  iconButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: surface.card, borderWidth: 1, borderColor: surface.border, alignItems: "center", justifyContent: "center" },
  pressed: { opacity: 0.7, transform: [{ scale: 0.96 }] },
  title: { ...typography.screenTitle, flex: 1, textAlign: "center", marginHorizontal: spacing.sm, color: colors.text, letterSpacing: -0.3 },
  caption: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted, textAlign: "center", marginTop: spacing.xs },
});
