import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { CalendarDays } from "lucide-react-native";
import { fonts, radii, spacing } from "../../../theme";

interface UpcomingHolidaysCardProps {
  holidays?: {
    available: boolean;
    upcoming: Array<{ date: string; name: string; localName: string }>;
  };
}

export const UpcomingHolidaysCard: React.FC<UpcomingHolidaysCardProps> = ({ holidays }) => {
  const upcoming = holidays?.upcoming || [];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Upcoming Holidays</Text>

      <View style={styles.card}>
        {upcoming.length === 0 ? (
          <View style={styles.emptyRow}>
            <CalendarDays size={18} color="#94A3B8" />
            <Text style={styles.emptyText}>
              No public holidays listed in the next 14 days. Regular market schedules apply.
            </Text>
          </View>
        ) : (
          upcoming.map((holiday, index) => {
            const isLast = index === upcoming.length - 1;
            const d = new Date(`${holiday.date}T00:00:00`);
            const monthStr = d.toLocaleDateString([], { month: "short" }).toUpperCase();
            const dayStr = d.toLocaleDateString([], { day: "numeric" });

            return (
              <View key={`${holiday.date}-${holiday.name}`} style={[styles.row, !isLast && styles.rowBorder]}>
                {/* Calendar Date Badge */}
                <View style={styles.dateBadge}>
                  <View style={styles.dateHeader}>
                    <Text style={styles.dateMonth}>{monthStr}</Text>
                  </View>
                  <View style={styles.dateBody}>
                    <Text style={styles.dateDay}>{dayStr}</Text>
                  </View>
                </View>

                {/* Holiday Details */}
                <View style={styles.infoWrap}>
                  <Text style={styles.holidayName}>{holiday.name}</Text>
                  {holiday.localName !== holiday.name && (
                    <Text style={styles.localName}>{holiday.localName}</Text>
                  )}
                  <Text style={styles.tipText}>
                    Review buyer quantities and pickup availability before the holiday.
                  </Text>
                </View>
              </View>
            );
          })
        )}
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
    padding: spacing.base,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    paddingBottom: spacing.sm,
    marginBottom: spacing.xs,
  },
  dateBadge: {
    width: 44,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    overflow: "hidden",
    alignItems: "center",
  },
  dateHeader: {
    backgroundColor: "#16A34A",
    width: "100%",
    paddingVertical: 2,
    alignItems: "center",
  },
  dateMonth: {
    fontFamily: fonts.body.semiBold,
    fontSize: 9,
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  dateBody: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dateDay: {
    fontFamily: fonts.heading.bold,
    fontSize: 17,
    color: "#0F172A",
    lineHeight: 22,
  },
  infoWrap: {
    flex: 1,
  },
  holidayName: {
    fontFamily: fonts.heading.bold,
    fontSize: 14,
    color: "#0F172A",
  },
  localName: {
    fontFamily: fonts.body.regular,
    fontSize: 12,
    color: "#64748B",
    marginTop: 1,
  },
  tipText: {
    fontFamily: fonts.body.regular,
    fontSize: 11,
    color: "#059669",
    marginTop: 4,
  },
  emptyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingVertical: spacing.xs,
  },
  emptyText: {
    flex: 1,
    fontFamily: fonts.body.regular,
    fontSize: 12,
    color: "#64748B",
    lineHeight: 18,
  },
});
