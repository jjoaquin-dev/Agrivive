import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Info } from "lucide-react-native";
import { colors, fonts, radii, shadows, spacing } from "../../../theme";

interface UpcomingHolidaysCardProps {
  holidays: { available: boolean; upcoming: Array<{ date: string; name: string; localName: string }> };
  sourceAvailable: boolean;
}

function daysAway(dateStr: string) {
  const target = new Date(`${dateStr}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Math.round((target.getTime() - today.getTime()) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `in ${days} days`;
}

export const UpcomingHolidaysCard: React.FC<UpcomingHolidaysCardProps> = ({ holidays, sourceAvailable }) => {
  const upcoming = holidays.upcoming;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Holidays in the Next 2 Weeks</Text>

      {!sourceAvailable ? (
        <Text style={styles.empty}>Holidays aren't available right now.</Text>
      ) : upcoming.length === 0 ? (
        <Text style={styles.empty}>No public holidays in the next 2 weeks.</Text>
      ) : (
        <>
          {upcoming.map((holiday, index) => {
            const d = new Date(`${holiday.date}T00:00:00`);
            return (
              <View key={`${holiday.date}-${holiday.name}`} style={[styles.row, index > 0 && styles.rowGap]}>
                <View style={styles.dateBox}>
                  <Text style={styles.dateMonth}>{d.toLocaleDateString([], { month: "short" }).toUpperCase()}</Text>
                  <Text style={styles.dateDay}>{d.getDate()}</Text>
                </View>
                <View style={styles.info}>
                  <View style={styles.nameRow}>
                    <Text style={styles.name} numberOfLines={1}>{holiday.name}</Text>
                    <Text style={styles.away}>{daysAway(holiday.date)}</Text>
                  </View>
                  {holiday.localName !== holiday.name ? <Text style={styles.localName} numberOfLines={1}>{holiday.localName}</Text> : null}
                </View>
              </View>
            );
          })}
          <View style={styles.tip}>
            <Info size={14} color={colors.textMuted} />
            <Text style={styles.tipText}>Check your pickup times before a holiday.</Text>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border, padding: spacing.base, marginBottom: spacing.md, ...shadows.card },
  title: { fontFamily: fonts.heading.semiBold, fontSize: 15, color: colors.text, marginBottom: spacing.md },
  empty: { fontFamily: fonts.body.regular, fontSize: 13, lineHeight: 20, color: colors.textMuted },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  rowGap: { marginTop: spacing.md },
  dateBox: { width: 56, alignItems: "center", paddingVertical: 8, borderRadius: 10, backgroundColor: colors.surfaceMuted, borderWidth: 1, borderColor: colors.border },
  dateMonth: { fontFamily: fonts.body.semiBold, fontSize: 11, color: colors.textMuted, letterSpacing: 0.5 },
  dateDay: { fontFamily: fonts.heading.bold, fontSize: 18, color: colors.text, marginTop: 2 },
  info: { flex: 1 },
  nameRow: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", gap: spacing.xs },
  name: { flex: 1, fontFamily: fonts.heading.semiBold, fontSize: 15, color: colors.text },
  away: { fontFamily: fonts.heading.bold, fontSize: 12, color: colors.primary },
  localName: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted, marginTop: 2 },
  tip: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: "#F3F1EA" },
  tipText: { flex: 1, fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted },
});
