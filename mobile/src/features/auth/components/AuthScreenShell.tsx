import React from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fonts, spacing, typography } from "../../../theme";

interface AuthScreenShellProps {
  title: string;
  subtitle?: React.ReactNode;
  onBack?: () => void;
  topRight?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

/** One left-aligned layout for every code and sign-in screen, so they all feel like the same app (Law of Similarity, Gestalt). */
export const AuthScreenShell: React.FC<AuthScreenShellProps> = ({ title, subtitle, onBack, topRight, header, footer, children }) => (
  <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {onBack || topRight ? (
          <View style={styles.topRow}>
            {onBack ? (
              <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel="Go back" hitSlop={8} style={styles.backButton}>
                <ArrowLeft size={24} color={colors.primary} />
              </Pressable>
            ) : <View />}
            {topRight}
          </View>
        ) : null}
        {header}
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        <View style={styles.body}>{children}</View>
      </ScrollView>
      {footer}
    </KeyboardAvoidingView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.xl },
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", minHeight: 44, marginBottom: spacing.base },
  backButton: { width: 44, height: 44, justifyContent: "center" },
  title: { ...typography.screenTitle, color: colors.text, letterSpacing: -0.3 },
  subtitle: { fontFamily: fonts.body.regular, fontSize: 15, lineHeight: 22, color: colors.textMuted, marginTop: spacing.xs },
  body: { marginTop: spacing.lg },
});
