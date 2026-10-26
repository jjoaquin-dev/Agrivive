import React from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { MapPin } from "lucide-react-native";
import { ButtonComponent } from "../../src/components/ButtonComponent";
import { useAuth } from "../../src/context/AuthContext";
import { useSellerAdvisories } from "../../src/features/advisories/hooks/useSellerAdvisories";
import { AdvisoriesHeader } from "../../src/features/advisories/components/AdvisoriesHeader";
import { WeatherHeroCard } from "../../src/features/advisories/components/WeatherHeroCard";
import { ContextualReminderCard } from "../../src/features/advisories/components/ContextualReminderCard";
import { WeatherForecastSection } from "../../src/features/advisories/components/WeatherForecastSection";
import { UpcomingHolidaysCard } from "../../src/features/advisories/components/UpcomingHolidaysCard";
import { AdvisoriesLimitationsFooter } from "../../src/features/advisories/components/AdvisoriesLimitationsFooter";
import { colors, fonts, radii, spacing } from "../../src/theme";

export default function SellerAdvisoriesScreen() {
  const { advisories, loading, refreshing, error, refresh } = useSellerAdvisories();
  const { setup } = useAuth();
  const shopName = setup?.profile?.shopName || "Bankerohan Public Market, Davao City";

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#16A34A" />
          <Text style={styles.muted}>Loading advisories...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <AdvisoriesHeader
        generatedAt={advisories?.generatedAt}
        refreshing={refreshing}
        onRefresh={refresh}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            colors={["#16A34A"]}
            tintColor="#16A34A"
          />
        }
      >
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
            <ButtonComponent
              title="Try Again"
              onPress={refresh}
              variant="secondary"
              style={styles.retry}
            />
          </View>
        ) : null}

        {!advisories ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Advisories unavailable</Text>
            <Text style={styles.muted}>Try again when your connection is available.</Text>
          </View>
        ) : (
          <>
            {/* Location Missing Card */}
            {!advisories.location && (
              <View style={styles.locationCard}>
                <View style={styles.locationCardHeader}>
                  <MapPin size={18} color="#D97706" />
                  <Text style={styles.locationCardTitle}>Add your stall location</Text>
                </View>
                <Text style={styles.locationCardText}>
                  Add a market stall location in your profile to receive localized Open-Meteo weather forecasts.
                </Text>
              </View>
            )}

            {/* Outdoor Weather Hero Card */}
            {advisories.weather?.current && (
              <WeatherHeroCard
                temperatureC={advisories.weather.current.temperatureC}
                precipitationProbability={advisories.weather.current.precipitationProbability}
                weatherCode={advisories.weather.current.weatherCode}
                locationName={shopName}
                generatedAt={advisories.generatedAt}
              />
            )}

            {/* Contextual Reminders */}
            <ContextualReminderCard reminders={advisories.reminders} />

            {/* 3-Day Forecast */}
            {advisories.weather?.forecast && (
              <WeatherForecastSection forecast={advisories.weather.forecast} />
            )}

            {/* Upcoming Holidays */}
            <UpcomingHolidaysCard holidays={advisories.holidays} />

            {/* External source notices */}
            {(advisories.sources.weather === "unavailable" ||
              advisories.sources.holidays === "unavailable") && (
              <Text style={styles.sourceNote}>
                Some external advisory data is currently unavailable. Your stored listings and orders remain fully operational.
              </Text>
            )}

            {/* Important Limitations */}
            <AdvisoriesLimitationsFooter />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.base, paddingTop: spacing.xs, paddingBottom: spacing.xxl },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  muted: { fontFamily: fonts.body.regular, fontSize: 13, color: "#64748B", marginTop: spacing.xs },
  locationCard: { backgroundColor: "#FFFBEB", borderColor: "#FDE68A", borderWidth: 1, borderRadius: radii.card || 14, padding: spacing.base, marginBottom: spacing.sm },
  locationCardHeader: { flexDirection: "row", alignItems: "center", gap: spacing.xs, marginBottom: 4 },
  locationCardTitle: { fontFamily: fonts.heading.bold, fontSize: 14, color: "#B45309" },
  locationCardText: { fontFamily: fonts.body.regular, fontSize: 12, lineHeight: 18, color: "#78350F" },
  errorBox: { backgroundColor: "rgba(184, 84, 80, 0.1)", borderWidth: 1, borderColor: colors.error, borderRadius: radii.card, padding: spacing.md, marginBottom: spacing.base },
  errorText: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.error },
  retry: { marginTop: spacing.sm },
  empty: { alignItems: "center", paddingVertical: spacing.xxxl },
  emptyTitle: { fontFamily: fonts.heading.semiBold, fontSize: 16, color: colors.text, marginBottom: spacing.xs },
  sourceNote: { fontFamily: fonts.body.regular, fontSize: 11, lineHeight: 16, color: "#64748B", marginBottom: spacing.md, textAlign: "center" },
});
