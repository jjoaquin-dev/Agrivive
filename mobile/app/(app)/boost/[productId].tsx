import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ButtonComponent } from "../../../src/components/ButtonComponent";
import { requestSellerVisibilityBoost } from "../../../src/features/boost/api/visibility-boosts";
import { colors, fonts, spacing } from "../../../src/theme";

export default function BoostVisibilityScreen() {
  const router = useRouter();
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const boost = async () => {
    if (!productId) return;
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await requestSellerVisibilityBoost(productId);
      setMessage("Your listing is queued for the Agrivive social workflow.");
    } catch (reason: any) {
      setError(reason?.message || "Could not queue the visibility boost.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <View style={styles.content}>
        <Text style={styles.title}>Boost Visibility</Text>
        <Text style={styles.subtitle}>
          Share the current listing price, stock, photo, and product link through Agrivive's social workflow.
        </Text>
        {loading ? <ActivityIndicator color={colors.primary} style={styles.loader} /> : null}
        {message ? <Text style={styles.message}>{message}</Text> : null}
        {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
        <ButtonComponent title="Boost this listing" onPress={() => void boost()} loading={loading} style={styles.action} />
        <ButtonComponent title="Back" variant="ghost" onPress={() => router.back()} style={styles.back} textStyle={styles.backText} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, padding: spacing.base, justifyContent: "center" },
  title: { fontFamily: fonts.heading.bold, fontSize: 28, color: colors.text },
  subtitle: { fontFamily: fonts.body.regular, fontSize: 15, lineHeight: 22, color: colors.textMuted, marginTop: spacing.sm },
  loader: { marginTop: spacing.lg },
  message: { fontFamily: fonts.body.medium, fontSize: 14, lineHeight: 20, color: colors.primary, marginTop: spacing.lg },
  error: { fontFamily: fonts.body.medium, fontSize: 14, lineHeight: 20, color: colors.error, marginTop: spacing.lg },
  action: { marginTop: spacing.xl, minHeight: 48 },
  back: { marginTop: spacing.sm, minHeight: 44 },
  backText: { color: colors.primary, fontSize: 14, fontWeight: "700" },
});
