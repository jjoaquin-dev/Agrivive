import React from "react";
import { StyleSheet, View, Text } from "react-native";
import {
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudDrizzle,
  CloudLightning,
  MapPin,
  Droplets,
} from "lucide-react-native";
import { fonts, radii, spacing } from "../../../theme";

interface WeatherHeroCardProps {
  temperatureC?: number;
  precipitationProbability?: number;
  weatherCode?: number;
  locationName?: string;
  generatedAt?: string;
}

export function getWeatherIcon(code?: number, size = 32, color = "#FFFFFF") {
  if (code === undefined || code === null) return <Sun size={size} color={color} />;
  if (code === 0) return <Sun size={size} color="#FDE047" />;
  if (code === 1 || code === 2) return <CloudSun size={size} color={color} />;
  if (code === 3 || code === 45 || code === 48) return <Cloud size={size} color={color} />;
  if (code >= 51 && code <= 57) return <CloudDrizzle size={size} color={color} />;
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return <CloudRain size={size} color={color} />;
  if (code >= 95) return <CloudLightning size={size} color="#FDE047" />;
  return <Sun size={size} color={color} />;
}

export function getWeatherConditionName(code?: number) {
  if (code === undefined || code === null) return "Clear Conditions";
  if (code === 0) return "Mostly Sunny";
  if (code === 1) return "Mostly Sunny";
  if (code === 2) return "Partly Cloudy";
  if (code === 3) return "Overcast";
  if (code === 45 || code === 48) return "Foggy";
  if (code >= 51 && code <= 57) return "Light Drizzle";
  if (code >= 61 && code <= 67) return "Rain Showers";
  if (code >= 71 && code <= 77) return "Cool Weather";
  if (code >= 80 && code <= 82) return "Passing Showers";
  if (code >= 95 && code <= 99) return "Thunderstorm Alert";
  return "Clear Conditions";
}

export const WeatherHeroCard: React.FC<WeatherHeroCardProps> = ({
  temperatureC,
  precipitationProbability,
  weatherCode,
  locationName = "Bankerohan Public Market, Davao City",
  generatedAt,
}) => {
  const timeStr = generatedAt
    ? new Date(generatedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    : "Live";

  return (
    <View style={styles.card}>
      {/* Top Header Row */}
      <View style={styles.topRow}>
        <Text style={styles.badgeLabel}>OUTDOOR WEATHER</Text>
        {getWeatherIcon(weatherCode, 32)}
      </View>

      {/* Location */}
      <View style={styles.locationRow}>
        <MapPin size={14} color="#FCA5A5" />
        <Text style={styles.locationText} numberOfLines={1}>
          {locationName}
        </Text>
      </View>

      {/* Main Temperature and Stats */}
      <View style={styles.mainRow}>
        <Text style={styles.tempText}>
          {temperatureC !== undefined ? `${Math.round(temperatureC)}°C` : "--°C"}
        </Text>
        <View style={styles.statsWrap}>
          <View style={styles.statLine}>
            <Droplets size={14} color="#93C5FD" />
            <Text style={styles.rainText}>
              {precipitationProbability !== undefined ? `${Math.round(precipitationProbability)}% rain chance` : "0% rain chance"}
            </Text>
          </View>
          <Text style={styles.conditionText}>{getWeatherConditionName(weatherCode)}</Text>
        </View>
      </View>

      {/* Source timestamp */}
      <Text style={styles.sourceText}>Updated {timeStr} · Open-Meteo</Text>

      {/* Contextual disclaimer note */}
      <View style={styles.noteBox}>
        <Text style={styles.noteText}>
          Outdoor weather is provided as context only. It may differ from actual storage temperature inside a stall, container, or shaded area.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1D4ED8",
    borderRadius: radii.card || 16,
    padding: spacing.base,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
    shadowColor: "#1D4ED8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badgeLabel: {
    fontFamily: fonts.heading.bold,
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.9)",
    letterSpacing: 0.8,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  locationText: {
    fontFamily: fonts.body.medium,
    fontSize: 12,
    color: "#FFFFFF",
    flex: 1,
  },
  mainRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.base,
    marginTop: spacing.sm,
  },
  tempText: {
    fontFamily: fonts.heading.bold,
    fontSize: 44,
    color: "#FFFFFF",
    letterSpacing: -1,
  },
  statsWrap: {
    flex: 1,
  },
  statLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rainText: {
    fontFamily: fonts.body.regular,
    fontSize: 13,
    color: "#BFDBFE",
  },
  conditionText: {
    fontFamily: fonts.heading.semiBold,
    fontSize: 15,
    color: "#FFFFFF",
    marginTop: 2,
  },
  sourceText: {
    fontFamily: fonts.body.regular,
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.75)",
    marginTop: spacing.sm,
  },
  noteBox: {
    backgroundColor: "rgba(255, 255, 255, 0.14)",
    borderRadius: 10,
    padding: spacing.sm,
    marginTop: spacing.sm,
  },
  noteText: {
    fontFamily: fonts.body.regular,
    fontSize: 11,
    lineHeight: 16,
    color: "rgba(255, 255, 255, 0.95)",
  },
});
