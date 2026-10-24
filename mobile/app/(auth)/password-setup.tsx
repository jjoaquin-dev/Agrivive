import React, { useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";
import { PasswordForm } from "../../src/features/auth/components/PasswordForm";
import { colors, fonts, spacing } from "../../src/theme";

export default function PasswordSetupScreen() {
  const router = useRouter();
  const { session, isSessionPending, refreshSetup } = useAuth();

  useEffect(() => {
    if (!isSessionPending && !session?.user) router.replace("/(auth)/login");
  }, [isSessionPending, router, session?.user]);

  const handleSuccess = async () => {
    await refreshSetup();
    router.replace("/");
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Set your Agrivive password</Text>
          <Text style={styles.subtitle}>
            Your Google account is connected. Create a password to secure your account and continue.
          </Text>
        </View>

        <PasswordForm mode="set" onSuccess={handleSuccess} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    color: colors.text,
    fontFamily: fonts.heading.bold,
    fontSize: 26,
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.textMuted,
    fontFamily: fonts.body.regular,
    fontSize: 14,
    lineHeight: 20,
  },
});
