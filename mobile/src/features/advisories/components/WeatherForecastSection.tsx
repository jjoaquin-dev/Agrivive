import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { fonts, radii, spacing } from "../../../theme";
import type { SellerAdvisoryWeatherDay } from "../types";
import { getWeatherIcon, getWeatherConditionName } from "./WeatherHeroCard";

interface WeatherForecastSectionProps {
  forecast?: SellerAdvisoryWeatherDay[];
}

function formatDayLabel(dateStr: string, index: number) {
  if (index === 0) return "Today";
  if (index === 1) return "Tomorrow";
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
}

export const WeatherForecastSection: React.FC<WeatherForecastSectionProps> = ({ forecast }) => {
  if (!forecast || forecast.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>3-Day Weather Forecast</Text>

      <View style={styles.card}>
        {forecast.map((day, index) => {
          const isLast = index === forecast.length - 1;
          const min = Math.round(day.temperatureMinC);
          const max = Math.round(day.temperatureMaxC);
          const rain = Math.round(day.precipitationProbability);

          return (
            <View key={day.date} style={[styles.row, !isLast && styles.rowBorder]}>
              <View style={styles.dateCol}>
                <Text style={styles.dayText}>{formatDayLabel(day.date, index)}</Text>
                <Text style={styles.subDateText}>{day.date}</Text>
              </View>

              <View style={styles.conditionCol}>
                {getWeatherIcon(day.weatherCode, 20, "#2563EB")}
                <Text style={styles.conditionText} numberOfLines={1}>
                  {getWeatherConditionName(day.weatherCode)}
                </Text>
              </View>

              <View style={styles.rightCol}>
                <Text style={styles.tempRange}>{`${min}° - ${max}°C`}</Text>
                <View style={styles.rainBadge}>
                  <Text style={styles.rainBadgeText}>{`${rain}% rain`}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.base,
  },
  sectionTitle: {
    fontFamily: fonts.heading.bold,
    fontSize: 15,
    color: "#0F172A",
    marginBottom: spacing.xs,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: radii.card || 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: spacing.base,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  dateCol: {
    width: 85,
  },
  dayText: {
    fontFamily: fonts.body.semiBold,
    fontSize: 13,
    color: "#0F172A",
  },
  subDateText: {
    fontFamily: fonts.body.regular,
    fontSize: 11,
    color: "#64748B",
  },
  conditionCol: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: spacing.xs,
  },
  conditionText: {
    fontFamily: fonts.body.medium,
    fontSize: 12,
    color: "#334155",
  },
  rightCol: {
    alignItems: "flex-end",
  },
  tempRange: {
    fontFamily: fonts.heading.bold,
    fontSize: 13,
    color: "#0F172A",
  },
  rainBadge: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 2,
  },
  rainBadgeText: {
    fontFamily: fonts.body.semiBold,
    fontSize: 10,
    color: "#2563EB",
  },
});
