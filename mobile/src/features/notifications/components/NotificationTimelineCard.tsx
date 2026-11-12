import React from "react";
import { Pressable, Text, View } from "react-native";
import { Package, Clock, MessageCircle, Thermometer, CheckCircle2, XCircle, PartyPopper, Megaphone, ShieldAlert } from "lucide-react-native";
import { colors, fonts } from "../../../theme";
import type { UnifiedNotificationItem } from "../types";
import { styles } from "./NotificationTimelineCard.styles";

const ICONS = {
  package: Package, clock: Clock, message: MessageCircle, thermometer: Thermometer, check: CheckCircle2,
  cross: XCircle, celebration: PartyPopper, megaphone: Megaphone, shield: ShieldAlert,
} as const;

function tone(item: UnifiedNotificationItem) {
  if (item.urgent) return { fg: colors.warning, bg: "#FFF1DE" };
  if (item.iconType === "cross") return { fg: colors.error, bg: "#FEF2F2" };
  return { fg: colors.primary, bg: colors.primaryLight };
}

/** New reservations, messages and questions that are still unread, plus anything urgent, stand out from the rest. */
export function NotificationTimelineCard({ item }: { item: UnifiedNotificationItem }) {
  const unread = !item.read;
  const important = !item.urgent && unread && (item.category === "reservations" || item.category === "messages");
  const Icon = ICONS[item.iconType] ?? Package;
  const { fg, bg } = tone(item);
  const strong = item.urgent || important;

  return (
    <View style={[styles.row, important && styles.rowImportant, item.urgent && styles.rowUrgent]}>
      {strong ? <View style={[styles.accent, { backgroundColor: item.urgent ? colors.warning : colors.primary }]} /> : null}
      <View style={styles.topRow}>
        <View>
          <View style={[styles.iconWrap, { backgroundColor: bg }]}><Icon size={22} color={fg} /></View>
          {unread ? <View style={styles.dot} accessibilityLabel="Unread" /> : null}
        </View>
        <View style={styles.content}>
          <View style={styles.titleLine}>
            <Text style={[styles.title, { fontFamily: unread ? fonts.heading.bold : fonts.body.medium }]} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.time}>{item.timestamp}</Text>
          </View>
          <Text style={styles.body}>{item.subtitle}</Text>
          {item.urgent ? <View style={styles.pill}><Text style={styles.pillText}>Needs action</Text></View> : important ? <View style={[styles.pill, styles.pillNew]}><Text style={[styles.pillText, styles.pillTextNew]}>New</Text></View> : null}
          {item.primaryAction || item.secondaryAction ? (
            <View style={styles.actions}>
              {item.primaryAction ? (
                <Pressable onPress={item.primaryAction.onPress} accessibilityRole="button" style={[styles.primary, strong && styles.primaryStrong]}>
                  <Text style={[styles.actionText, strong && styles.actionTextStrong]}>{item.primaryAction.label}</Text>
                </Pressable>
              ) : null}
              {item.secondaryAction ? (
                <Pressable onPress={item.secondaryAction.onPress} accessibilityRole="button" style={styles.ghost}>
                  <Text style={styles.actionText}>{item.secondaryAction.label}</Text>
                </Pressable>
              ) : null}
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}
