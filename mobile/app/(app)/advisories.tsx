import React, { useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { ButtonComponent } from "../../src/components/ButtonComponent";
import { useAuth } from "../../src/context/AuthContext";
import { useSellerAdvisories } from "../../src/features/advisories/hooks/useSellerAdvisories";
import { AdvisoriesHeader } from "../../src/features/advisories/components/AdvisoriesHeader";
import { AdvisoriesAboutSheet } from "../../src/features/advisories/components/AdvisoriesAboutSheet";
import { AdvisoriesNoPinCard } from "../../src/features/advisories/components/AdvisoriesNoPinCard";
import { AdvisoriesWeatherDownCard } from "../../src/features/advisories/components/AdvisoriesWeatherDownCard";
import { WeatherHeroCard } from "../../src/features/advisories/components/WeatherHeroCard";
import { ContextualReminderCard } from "../../src/features/advisories/components/ContextualReminderCard";
import { WeatherForecastSection } from "../../src/features/advisories/components/WeatherForecastSection";
import { UpcomingHolidaysCard } from "../../src/features/advisories/components/UpcomingHolidaysCard";
import { colors, fonts, radii, spacing } from "../../src/theme";

export default function SellerAdvisoriesScreen() {
  const router = useRouter();
  const { advisories, loading, refreshing, error, refresh } = useSellerAdvisories();
  const { setup } = useAuth();
  const [showAbout, setShowAbout] = useState(false);

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.muted}>Loading weather and holidays...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const current = advisories?.weather?.current ?? null;
  const hasPin = Boolean(advisories?.location);
  const reminders = (advisories?.reminders ?? []).filter((reminder) => reminder.kind !== "location");

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <AdvisoriesHeader generatedAt={advisories?.generatedAt} onOpenInfo={() => setShowAbout(true)} />

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} colors={[colors.primary]} tintColor={colors.primary} />}
      >
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
            <ButtonComponent title="Try Again" onPress={refresh} variant="secondary" style={styles.retry} />
          </View>
        ) : null}

        {!advisories ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Weather and holidays aren't available</Text>
            <Text style={styles.muted}>Try again when your connection is back.</Text>
          </View>
        ) : (
          <>
            {!hasPin ? <AdvisoriesNoPinCard onAddPin={() => router.push("/(app)/profile/edit")} /> : null}

            {hasPin && current ? (
              <WeatherHeroCard
                temperatureC={current.temperatureC}
                precipitationProbability={current.precipitationProbability}
                weatherCode={current.weatherCode}
                shopName={setup?.profile?.shopName}
                address={setup?.profile?.detailAddress}
              />
            ) : null}
            {hasPin && !current ? <AdvisoriesWeatherDownCard onRetry={refresh} /> : null}

            <ContextualReminderCard reminders={reminders} />

            {hasPin ? <WeatherForecastSection forecast={advisories.weather?.forecast ?? []} /> : null}

            <UpcomingHolidaysCard holidays={advisories.holidays} sourceAvailable={advisories.sources.holidays === "available"} />

            <Text style={styles.footer}>For planning only. Always check your vegetables yourself.</Text>
          </>
        )}
      </ScrollView>

      <AdvisoriesAboutSheet visible={showAbout} onClose={() => setShowAbout(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.base, paddingTop: spacing.xs, paddingBottom: spacing.xxl },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  muted: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted, marginTop: spacing.xs },
  errorBox: { backgroundColor: "rgba(220, 38, 38, 0.08)", borderWidth: 1, borderColor: colors.error, borderRadius: radii.card, padding: spacing.md, marginBottom: spacing.base },
  errorText: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.error },
  retry: { marginTop: spacing.sm },
  empty: { alignItems: "center", paddingVertical: spacing.xxxl },
  emptyTitle: { fontFamily: fonts.heading.semiBold, fontSize: 16, color: colors.text, marginBottom: spacing.xs },
  footer: { fontFamily: fonts.body.regular, fontSize: 11, color: colors.textMuted, textAlign: "center", marginTop: spacing.base },
});
