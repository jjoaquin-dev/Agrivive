import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { AlertTriangle, CloudRain, CalendarDays, Thermometer } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import type { AdvisoryKind } from "../types";

interface ContextualReminderCardProps {
  reminders: Array<{ kind: AdvisoryKind; message: string }>;
}

function getReminderIcon(kind: AdvisoryKind) {
  if (kind === "weather") return <CloudRain size={16} color={colors.warning} />;
  if (kind === "heat") return <Thermometer size={16} color={colors.warning} />;
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
  card: { backgroundColor: "#FFFAF3", borderColor: "#FBE3C3", borderWidth: 1, borderRadius: radii.card, padding: spacing.base, marginBottom: spacing.md },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  headerText: { fontFamily: fonts.heading.bold, fontSize: 17, color: "#92400E" },
  list: { gap: spacing.md, marginTop: spacing.md },
  itemRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  itemIcon: { marginTop: 2 },
  itemText: { flex: 1, fontFamily: fonts.body.regular, fontSize: 15, lineHeight: 22, color: "#78350F" },
});
