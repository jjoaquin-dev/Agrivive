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
import { colors, fonts, radii, shadows, spacing } from "../../../theme";

interface WeatherHeroCardProps {
  temperatureC: number;
  precipitationProbability: number;
  weatherCode: number;
  shopName?: string | null;
  address?: string | null;
}

export function getWeatherIcon(code?: number, size = 32, color = "#FFFFFF") {
  if (code === undefined || code === null) return <Sun size={size} color={color} />;
  if (code === 0) return <Sun size={size} color={color} />;
  if (code === 1 || code === 2) return <CloudSun size={size} color={color} />;
  if (code === 3 || code === 45 || code === 48) return <Cloud size={size} color={color} />;
  if (code >= 51 && code <= 57) return <CloudDrizzle size={size} color={color} />;
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return <CloudRain size={size} color={color} />;
  if (code >= 95) return <CloudLightning size={size} color={color} />;
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

/** "Now at Your Stall": the seller's own shop name and address with the live reading from the server. */
export const WeatherHeroCard: React.FC<WeatherHeroCardProps> = ({
  temperatureC,
  precipitationProbability,
  weatherCode,
  shopName,
  address,
}) => (
  <View style={styles.card}>
    <View style={styles.locationRow}>
      <View style={styles.pinCircle}>
        <MapPin size={16} color={colors.terracotta} />
      </View>
      <View style={styles.locationText}>
        <Text style={styles.shopName} numberOfLines={1}>{shopName || "Your stall"}</Text>
        {address ? <Text style={styles.address} numberOfLines={1}>{address}</Text> : null}
      </View>
    </View>

    <View style={styles.mainRow}>
      <Text style={styles.tempText}>{`${Math.round(temperatureC)}°C`}</Text>
      <View style={styles.conditionPill}>
        {getWeatherIcon(weatherCode, 20, colors.warning)}
        <Text style={styles.conditionText}>{getWeatherConditionName(weatherCode)}</Text>
      </View>
    </View>

    <View style={styles.rainRow}>
      <Droplets size={14} color={colors.warning} />
      <Text style={styles.rainText}>{`${Math.round(precipitationProbability)}% chance of rain`}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border, padding: spacing.base, marginBottom: spacing.md, ...shadows.card },
  locationRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  pinCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: "#FFF7ED", alignItems: "center", justifyContent: "center" },
  locationText: { flex: 1 },
  shopName: { fontFamily: fonts.heading.semiBold, fontSize: 15, color: colors.text },
  address: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted },
  mainRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#F3F1EA" },
  tempText: { fontFamily: fonts.heading.bold, fontSize: 32, color: colors.text, letterSpacing: -0.5 },
  conditionPill: { flexDirection: "row", alignItems: "center", gap: spacing.sm, backgroundColor: "#FFFBEB", borderWidth: 1, borderColor: "#FDE68A", borderRadius: 9999, paddingHorizontal: spacing.md, paddingVertical: 6 },
  conditionText: { fontFamily: fonts.body.medium, fontSize: 14, color: "#374151" },
  rainRow: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: colors.surfaceMuted, borderRadius: 8, padding: spacing.sm, marginTop: spacing.md },
  rainText: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted },
});
