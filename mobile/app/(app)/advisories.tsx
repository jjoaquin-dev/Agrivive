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
import { AlertTriangle, CalendarDays, CloudRain, MapPin, Sun } from "lucide-react-native";
import { ButtonComponent } from "../../src/components/ButtonComponent";
import { useSellerAdvisories } from "../../src/features/advisories/hooks/useSellerAdvisories";
import type { SellerAdvisoryWeatherDay } from "../../src/features/advisories/types";
import { colors, fonts, radii, spacing } from "../../src/theme";

function dateLabel(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString([], { month: "short", day: "numeric" });
}

function weatherLabel(code: number) {
  if (code === 0) return "Clear";
  if (code === 1) return "Mostly clear";
  if (code === 2) return "Partly cloudy";
  if (code === 3) return "Overcast";
  if (code === 45 || code === 48) return "Foggy";
  if (code >= 51 && code <= 57) return "Light drizzle";
  if (code >= 61 && code <= 67) return "Rain";
  if (code >= 71 && code <= 77) return "Snow";
  if (code >= 80 && code <= 82) return "Rain showers";
  if (code >= 85 && code <= 86) return "Snow showers";
  if (code >= 95 && code <= 99) return "Thunderstorm";
  return "Weather conditions unavailable";
}

function forecastLabel(day: SellerAdvisoryWeatherDay) {
  const minimum = Math.round(day.temperatureMinC);
  const maximum = Math.round(day.temperatureMaxC);
  const chance = Math.round(day.precipitationProbability);
  return `${minimum} to ${maximum}°C · ${chance}% chance of rain`;
}

export default function SellerAdvisoriesScreen() {
  const { advisories, loading, refreshing, error, refresh } = useSellerAdvisories();

  if (loading && !refreshing) {
    return <SafeAreaView style={styles.safeArea} edges={["bottom"]}><View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /><Text style={styles.muted}>Loading advisories...</Text></View></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} colors={[colors.primary]} tintColor={colors.primary} />}
      >
        <View style={styles.header}><View style={styles.headerText}><Text style={styles.title}>Advisories</Text><Text style={styles.muted}>Weather and holiday context for your selling plans.</Text></View><AlertTriangle size={28} color={colors.primary} /></View>
        {error ? <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text><ButtonComponent title="Try Again" onPress={refresh} variant="secondary" style={styles.retry} /></View> : null}

        {!advisories ? <View style={styles.empty}><Text style={styles.emptyTitle}>Advisories unavailable</Text><Text style={styles.muted}>Try again when your connection is available.</Text></View> : <>
          {!advisories.location ? <View style={styles.card}><View style={styles.cardHeader}><MapPin size={20} color={colors.warning} /><Text style={styles.cardTitle}>Add your location</Text></View><Text style={styles.cardText}>Add a seller location to receive local weather advisories.</Text></View> : null}

          <View style={styles.card}><View style={styles.cardHeader}><CloudRain size={20} color={colors.primary} /><Text style={styles.cardTitle}>Weather</Text></View>{!advisories.weather ? <Text style={styles.muted}>Weather data is currently unavailable.</Text> : <><Text style={styles.currentWeather}>{advisories.weather.current ? `${advisories.weather.current.temperatureC.toFixed(1)}°C · ${weatherLabel(advisories.weather.current.weatherCode)}` : "Current weather unavailable"}</Text>{advisories.weather.forecast.map((day) => <View key={day.date} style={styles.forecastRow}><Text style={styles.forecastDate}>{dateLabel(day.date)}</Text><Text style={styles.forecastText}>{forecastLabel(day)}</Text></View>)}</>}</View>

          <View style={styles.card}><View style={styles.cardHeader}><CalendarDays size={20} color={colors.primary} /><Text style={styles.cardTitle}>Upcoming holidays</Text></View>{!advisories.holidays.available ? <Text style={styles.muted}>Holiday data is currently unavailable.</Text> : !advisories.holidays.upcoming.length ? <Text style={styles.muted}>No public holiday is listed in the next 14 days.</Text> : advisories.holidays.upcoming.map((holiday) => <View key={`${holiday.date}-${holiday.name}`} style={styles.holidayRow}><Text style={styles.forecastDate}>{dateLabel(holiday.date)}</Text><View style={styles.holidayText}><Text style={styles.cardText}>{holiday.name}</Text>{holiday.localName !== holiday.name ? <Text style={styles.muted}>{holiday.localName}</Text> : null}</View></View>)}</View>

          <Text style={styles.sectionTitle}>Reminders</Text>
          {advisories.reminders.length === 0 ? <View style={styles.card}><Sun size={20} color={colors.success} /><Text style={styles.cardText}>No special reminders right now. Continue routine physical inspection.</Text></View> : advisories.reminders.map((reminder, index) => <View key={`${reminder.kind}-${index}`} style={styles.reminder}><AlertTriangle size={18} color={colors.warning} /><Text style={styles.reminderText}>{reminder.message}</Text></View>)}

          {(advisories.sources.weather === "unavailable" || advisories.sources.holidays === "unavailable") ? <Text style={styles.sourceNote}>Some external advisory data is unavailable. Your stored listings and orders remain available.</Text> : null}
        </>}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.base, paddingBottom: spacing.xxxl },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: spacing.base },
  headerText: { flex: 1, marginRight: spacing.md },
  title: { fontFamily: fonts.heading.bold, fontSize: 28, lineHeight: 34, color: colors.text },
  muted: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, color: colors.textMuted },
  sectionTitle: { fontFamily: fonts.heading.semiBold, fontSize: 18, color: colors.text, marginTop: spacing.lg, marginBottom: spacing.sm },
  card: { backgroundColor: colors.surface, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border, padding: spacing.base, marginBottom: spacing.md },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.sm },
  cardTitle: { fontFamily: fonts.heading.semiBold, fontSize: 16, color: colors.text },
  cardText: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, color: colors.text },
  currentWeather: { fontFamily: fonts.heading.bold, fontSize: 20, color: colors.primary, marginBottom: spacing.sm },
  forecastRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border },
  forecastDate: { fontFamily: fonts.body.semiBold, fontSize: 14, color: colors.text },
  forecastText: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted },
  holidayRow: { flexDirection: "row", alignItems: "flex-start", paddingVertical: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border },
  holidayText: { flex: 1, marginLeft: spacing.md },
  reminder: { flexDirection: "row", alignItems: "flex-start", backgroundColor: "rgba(199, 149, 62, 0.12)", borderWidth: 1, borderColor: colors.warning, borderRadius: radii.card, padding: spacing.md, marginBottom: spacing.sm },
  reminderText: { flex: 1, fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, color: colors.text, marginLeft: spacing.sm },
  errorBox: { backgroundColor: "rgba(184, 84, 80, 0.1)", borderWidth: 1, borderColor: colors.error, borderRadius: radii.card, padding: spacing.md, marginBottom: spacing.base },
  errorText: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, color: colors.error },
  retry: { marginTop: spacing.sm },
  sourceNote: { fontFamily: fonts.body.regular, fontSize: 13, lineHeight: 19, color: colors.textMuted, marginTop: spacing.sm },
  empty: { alignItems: "center", paddingVertical: spacing.xxxl },
  emptyTitle: { fontFamily: fonts.heading.semiBold, fontSize: 18, color: colors.text, marginBottom: spacing.xs },
});
