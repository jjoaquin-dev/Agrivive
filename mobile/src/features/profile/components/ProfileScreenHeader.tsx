import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { colors, fonts, spacing } from "../../../theme";
import { safeBack } from "../../../utils/safeBack";
import { profileColors } from "../profileTokens";

interface Props {
  title: string;
  /** Big page title, used on the Profile page itself. */
  large?: boolean;
  onBack?: () => void;
}

export function ProfileScreenHeader({ title, large, onBack }: Props) {
  const router = useRouter();
  return (
    <View style={[styles.row, large && styles.rowLarge]}>
      <Pressable onPress={onBack ?? (() => safeBack(router))} accessibilityRole="button" accessibilityLabel="Go back" style={styles.back}>
        <ArrowLeft size={20} color={colors.text} />
      </Pressable>
      <Text style={[styles.title, large && styles.titleLarge]} numberOfLines={1}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md, paddingHorizontal: spacing.base, paddingVertical: spacing.sm, backgroundColor: profileColors.cream },
  rowLarge: { paddingBottom: spacing.xs },
  back: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.white, borderWidth: 1, borderColor: profileColors.border, alignItems: "center", justifyContent: "center" },
  title: { flex: 1, fontFamily: fonts.heading.bold, fontSize: 22, color: colors.text },
  titleLarge: { fontSize: 28 },
});
