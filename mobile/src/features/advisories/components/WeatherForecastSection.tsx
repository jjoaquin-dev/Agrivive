import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Droplet } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import type { SellerAdvisoryWeatherDay } from "../types";
import { getWeatherConditionName } from "./WeatherHeroCard";
import { surface } from "../../../theme/surface";

interface WeatherForecastSectionProps {
  forecast: SellerAdvisoryWeatherDay[];
}

/** Same threshold the server uses to send its rain reminder. */
const RAIN_WARNING_PERCENT = 60;

function formatDayLabel(dateStr: string, index: number) {
  if (index === 0) return "Today";
  if (index === 1) return "Tomorrow";
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
}

export const WeatherForecastSection: React.FC<WeatherForecastSectionProps> = ({ forecast }) => (
  <View style={styles.card}>
    <Text style={styles.title}>Next 3 Days</Text>
    {forecast.length === 0 ? (
      <Text style={styles.unavailable}>Forecast isn't available right now.</Text>
    ) : (
      forecast.map((day, index) => {
        const rain = Math.round(day.precipitationProbability);
        const wet = rain >= RAIN_WARNING_PERCENT;
        return (
          <View key={day.date} style={[styles.row, index > 0 && styles.rowBorder]}>
            <View style={styles.dateCol}>
              <Text style={styles.dayText}>{formatDayLabel(day.date, index)}</Text>
              <Text style={[styles.conditionText, wet && styles.conditionWet]} numberOfLines={1}>
                {wet ? "Rain Expected" : getWeatherConditionName(day.weatherCode)}
              </Text>
            </View>
            <Text style={[styles.range, wet && styles.rangeWet]}>{`${Math.round(day.temperatureMinC)}°–${Math.round(day.temperatureMaxC)}°C`}</Text>
            <View style={[styles.rainBadge, wet && styles.rainBadgeWet]}>
              <Droplet size={12} color={wet ? "#B45309" : colors.textMuted} fill={wet ? "#B45309" : colors.textMuted} />
              <Text style={[styles.rainText, wet && styles.rainTextWet]}>{`${rain}% rain`}</Text>
            </View>
          </View>
        );
      })
    )}
  </View>
);

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border, padding: spacing.base, marginBottom: spacing.md, ...surface.shadow },
  title: { fontFamily: fonts.heading.bold, fontSize: 17, color: colors.text, marginBottom: spacing.sm },
  unavailable: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted, textAlign: "center" },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: spacing.md },
  rowBorder: { borderTopWidth: 1, borderTopColor: "#F3F1EC" },
  dateCol: { width: 104, flexShrink: 1 },
  dayText: { fontFamily: fonts.body.semiBold, fontSize: 15, color: colors.text },
  conditionText: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted },
  conditionWet: { fontFamily: fonts.body.medium, color: colors.warning },
  range: { fontFamily: fonts.body.medium, fontSize: 15, color: colors.text },
  rangeWet: { fontFamily: fonts.body.semiBold, color: colors.text },
  rainBadge: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#F6F5F1", borderRadius: 9999, paddingHorizontal: 10, paddingVertical: 4 },
  rainBadgeWet: { backgroundColor: "#FFF1DE" },
  rainText: { fontFamily: fonts.body.medium, fontSize: 13, color: colors.textMuted },
  rainTextWet: { fontFamily: fonts.body.semiBold, color: "#92400E" },
});
