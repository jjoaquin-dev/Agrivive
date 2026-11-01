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
  if (item.urgent) return { fg: colors.warning, bg: "#FFF7ED" };
  if (item.iconType === "cross") return { fg: colors.error, bg: "#FEF2F2" };
  return { fg: colors.primary, bg: colors.primaryLight };
}

export function NotificationTimelineCard({ item }: { item: UnifiedNotificationItem }) {
  const unread = !item.read;
  const Icon = ICONS[item.iconType] ?? Package;
  const { fg, bg } = tone(item);

  return (
    <View style={styles.row}>
      {item.urgent ? <View style={styles.urgentBar} /> : null}
      <View style={styles.topRow}>
        <View style={styles.gutter}>
          <View style={[styles.dot, { backgroundColor: unread ? colors.primary : "transparent" }]} accessibilityLabel={unread ? "Unread" : undefined} />
          <View style={[styles.iconWrap, { backgroundColor: bg }]}><Icon size={20} color={fg} /></View>
        </View>
        <View style={styles.content}>
          <View style={styles.titleLine}>
            <Text style={[styles.title, { fontFamily: unread ? fonts.heading.semiBold : fonts.body.medium }]} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.time}>{item.timestamp}</Text>
          </View>
          <Text style={styles.body}>{item.subtitle}</Text>
          {item.urgent ? <View style={styles.pill}><Text style={styles.pillText}>Needs action</Text></View> : null}
          {item.primaryAction || item.secondaryAction ? (
            <View style={styles.actions}>
              {item.primaryAction ? (
                <Pressable onPress={item.primaryAction.onPress} accessibilityRole="button" style={styles.primary}>
                  <Text style={styles.actionText}>{item.primaryAction.label}</Text>
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
