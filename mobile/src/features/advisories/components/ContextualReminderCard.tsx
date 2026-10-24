import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { AlertTriangle, CloudRain, CalendarDays, CheckCircle2 } from "lucide-react-native";
import { fonts, spacing } from "../../../theme";
import type { AdvisoryKind } from "../types";

interface ContextualReminderCardProps {
  reminders: Array<{ kind: AdvisoryKind; message: string }>;
}

function getReminderIcon(kind: AdvisoryKind) {
  if (kind === "weather") return <CloudRain size={16} color="#D97706" />;
  if (kind === "holiday") return <CalendarDays size={16} color="#D97706" />;
  return <AlertTriangle size={16} color="#D97706" />;
}

export const ContextualReminderCard: React.FC<ContextualReminderCardProps> = ({ reminders }) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <AlertTriangle size={15} color="#B45309" />
        <Text style={styles.headerText}>CONTEXTUAL REMINDERS</Text>
      </View>

      {reminders.length === 0 ? (
        <View style={styles.emptyRow}>
          <CheckCircle2 size={16} color="#059669" />
          <Text style={styles.emptyText}>
            No severe weather or upcoming holiday alerts right now. Continue routine physical produce inspection.
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {reminders.map((reminder, idx) => (
            <View key={`${reminder.kind}-${idx}`} style={styles.itemRow}>
              {getReminderIcon(reminder.kind)}
              <Text style={styles.itemText}>{reminder.message}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFBEB",
    borderColor: "#FDE68A",
    borderWidth: 1,
    borderRadius: 14,
    padding: spacing.base,
    marginBottom: spacing.base,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: spacing.xs,
  },
  headerText: {
    fontFamily: fonts.heading.bold,
    fontSize: 11,
    color: "#B45309",
    letterSpacing: 0.6,
  },
  list: {
    gap: spacing.sm,
    marginTop: 4,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.xs,
  },
  itemText: {
    flex: 1,
    fontFamily: fonts.body.regular,
    fontSize: 12,
    lineHeight: 18,
    color: "#78350F",
  },
  emptyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: 4,
  },
  emptyText: {
    flex: 1,
    fontFamily: fonts.body.regular,
    fontSize: 12,
    lineHeight: 17,
    color: "#065F46",
  },
});
