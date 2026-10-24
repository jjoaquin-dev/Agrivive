import React from "react";
import { Pressable, Text, View } from "react-native";
import {
  Package,
  Clock,
  MessageCircle,
  Thermometer,
  CheckCircle2,
  XCircle,
  PartyPopper,
  Megaphone,
  ShieldAlert,
} from "lucide-react-native";
import type { UnifiedNotificationItem } from "../types";
import { styles } from "./NotificationTimelineCard.styles";

function renderIcon(type: UnifiedNotificationItem["iconType"], urgent: boolean) {
  const size = 19;
  switch (type) {
    case "clock": return <Clock size={size} color="#EA580C" />;
    case "message": return <MessageCircle size={size} color="#2563EB" />;
    case "thermometer": return <Thermometer size={size} color="#D97706" />;
    case "check": return <CheckCircle2 size={size} color="#16A34A" />;
    case "cross": return <XCircle size={size} color="#DC2626" />;
    case "celebration": return <PartyPopper size={size} color="#059669" />;
    case "megaphone": return <Megaphone size={size} color="#D97706" />;
    case "shield": return <ShieldAlert size={size} color="#EA580C" />;
    default: return <Package size={size} color="#16A34A" />;
  }
}

function getIconBg(type: UnifiedNotificationItem["iconType"], urgent: boolean) {
  if (urgent) return "#FFEDD5";
  switch (type) {
    case "message": return "#EFF6FF";
    case "thermometer":
    case "megaphone": return "#FEF3C7";
    case "cross": return "#FEE2E2";
    default: return "#DCFCE7";
  }
}

export function NotificationTimelineCard({ item }: { item: UnifiedNotificationItem }) {
  const isUrgent = item.urgent;
  const isUnread = !item.read;

  return (
    <View
      style={[
        styles.card,
        isUrgent && styles.cardUrgent,
        !isUrgent && isUnread && styles.cardUnread,
      ]}
    >
      <View style={styles.topRow}>
        <View style={[styles.iconWrap, { backgroundColor: getIconBg(item.iconType, isUrgent) }]}>
          {renderIcon(item.iconType, isUrgent)}
        </View>

        <View style={styles.headerContent}>
          <View style={styles.titleLine}>
            <Text style={[styles.title, isUrgent && styles.titleUrgent]} numberOfLines={1}>
              {item.title}
            </Text>
            <View style={styles.timeWrap}>
              {isUnread && <View style={styles.unreadDot} />}
              <Text style={styles.timeText}>{item.timestamp}</Text>
            </View>
          </View>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        </View>
      </View>

      {(item.primaryAction || item.secondaryAction) && (
        <View style={styles.actionsRow}>
          {item.primaryAction && (
            <Pressable
              onPress={item.primaryAction.onPress}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.actionBtn,
                item.primaryAction?.variant === "warning" || isUrgent
                  ? styles.actionBtnOrange
                  : styles.actionBtnGreen,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.actionBtnText}>{item.primaryAction.label}</Text>
            </Pressable>
          )}

          {item.secondaryAction && (
            <Pressable
              onPress={item.secondaryAction.onPress}
              accessibilityRole="button"
              style={({ pressed }) => [styles.actionBtn, styles.actionBtnGray, pressed && styles.pressed]}
            >
              <Text style={styles.actionBtnGrayText}>{item.secondaryAction.label}</Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}
