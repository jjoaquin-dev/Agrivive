import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { Thermometer, Calendar } from "lucide-react-native";
import { fonts, radii, spacing } from "../../../theme";

interface DashboardAdvisoriesRowProps {
  temperatureC?: number;
  precipitationProbability?: number;
  weatherTip?: string;
  holidayName?: string;
  holidayDate?: string;
  onReviewWeather: () => void;
  onViewHoliday: () => void;
}

export const DashboardAdvisoriesRow: React.FC<DashboardAdvisoriesRowProps> = ({
  temperatureC = 34,
  precipitationProbability = 82,
  weatherTip = "Inspect produce listings for ambient heat impact.",
  holidayName = "Market Schedule",
  holidayDate = "Upcoming",
  onReviewWeather,
  onViewHoliday,
}) => {
  return (
    <View style={styles.container}>
      {/* Weather Advisory Card */}
      <View style={styles.card}>
        <View style={styles.iconWrap}>
          <Thermometer size={18} color="#EA580C" />
        </View>
        <Text style={styles.title}>Weather Advisory</Text>
        <Text style={styles.dataLine}>
          {temperatureC}°C · {precipitationProbability}% humidity
        </Text>
        <Text style={styles.guidance} numberOfLines={2}>
          {weatherTip}
        </Text>
        <Pressable
          onPress={onReviewWeather}
          accessibilityRole="button"
          accessibilityLabel="Review weather advisory"
          style={({ pressed }) => [styles.orangeBtn, pressed && styles.btnPressed]}
        >
          <Text style={styles.orangeBtnText}>Review</Text>
        </Pressable>
      </View>

      {/* Upcoming Holiday Card */}
      <View style={styles.card}>
        <View style={styles.iconWrap}>
          <Calendar size={18} color="#4F46E5" />
        </View>
        <Text style={styles.title}>Upcoming Holiday</Text>
        <Text style={styles.dataLine} numberOfLines={1}>
          {holidayName} · {holidayDate}
        </Text>
        <Text style={styles.guidance} numberOfLines={2}>
          Review buyer quantities before the holiday.
        </Text>
        <Pressable
          onPress={onViewHoliday}
          accessibilityRole="button"
          accessibilityLabel="View holiday schedule"
          style={({ pressed }) => [styles.blueBtn, pressed && styles.btnPressed]}
        >
          <Text style={styles.blueBtnText}>View</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.xxl,
  },
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 12,
    justifyContent: "space-between",
    minHeight: 180,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  title: {
    fontFamily: fonts.heading.bold,
    fontSize: 13,
    color: "#1E1E1E",
    marginBottom: 4,
  },
  dataLine: {
    fontFamily: fonts.body.semiBold,
    fontSize: 10,
    color: "#475569",
    marginBottom: 4,
  },
  guidance: {
    fontFamily: fonts.body.regular,
    fontSize: 10,
    color: "#64748B",
    lineHeight: 14,
    marginBottom: 10,
  },
  orangeBtn: {
    backgroundColor: "#F59E0B",
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  orangeBtnText: {
    fontFamily: fonts.body.semiBold,
    fontSize: 12,
    color: "#FFFFFF",
  },
  blueBtn: {
    backgroundColor: "#EEF2FF",
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  blueBtnText: {
    fontFamily: fonts.body.semiBold,
    fontSize: 12,
    color: "#4F46E5",
  },
  btnPressed: {
    opacity: 0.85,
  },
});
