import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { AlertTriangle, CloudRain, CalendarDays } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import type { AdvisoryKind } from "../types";

interface ContextualReminderCardProps {
  reminders: Array<{ kind: AdvisoryKind; message: string }>;
}

function getReminderIcon(kind: AdvisoryKind) {
  if (kind === "weather") return <CloudRain size={16} color={colors.warning} />;
  if (kind === "holiday") return <CalendarDays size={16} color={colors.warning} />;
  return <AlertTriangle size={16} color={colors.warning} />;
}

/** Lists the reminders the server sent. Nothing to warn about means no card at all. */
export const ContextualReminderCard: React.FC<ContextualReminderCardProps> = ({ reminders }) => {
  if (reminders.length === 0) return null;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <AlertTriangle size={16} color="#92400E" />
        <Text style={styles.headerText}>Heads Up</Text>
      </View>
      <View style={styles.list}>
        {reminders.map((reminder, idx) => (
          <View key={`${reminder.kind}-${idx}`} style={styles.itemRow}>
            <View style={styles.itemIcon}>{getReminderIcon(reminder.kind)}</View>
            <Text style={styles.itemText}>{reminder.message}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: "#FFFBEB", borderColor: "#FDE68A", borderWidth: 1, borderRadius: radii.card, padding: spacing.base, marginBottom: spacing.md },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  headerText: { fontFamily: fonts.heading.semiBold, fontSize: 15, color: "#92400E" },
  list: { gap: 10, marginTop: 10 },
  itemRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  itemIcon: { marginTop: 2 },
  itemText: { flex: 1, fontFamily: fonts.body.regular, fontSize: 13, lineHeight: 18, color: "#78350F" },
});
