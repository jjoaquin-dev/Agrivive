import React from "react";
import { Text, View } from "react-native";
import { ButtonComponent } from "../../../components/ButtonComponent";
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
  const size = 20;
  switch (type) {
    case "clock": return <Clock size={size} color="#FFFFFF" />;
    case "message": return <MessageCircle size={size} color="#FFFFFF" />;
    case "thermometer": return <Thermometer size={size} color="#FFFFFF" />;
    case "check": return <CheckCircle2 size={size} color="#FFFFFF" />;
    case "cross": return <XCircle size={size} color="#FFFFFF" />;
    case "celebration": return <PartyPopper size={size} color="#FFFFFF" />;
    case "megaphone": return <Megaphone size={size} color="#FFFFFF" />;
    case "shield": return <ShieldAlert size={size} color="#FFFFFF" />;
    default: return <Package size={size} color="#FFFFFF" />;
  }
}

function getIconBg(type: UnifiedNotificationItem["iconType"], urgent: boolean) {
  if (urgent) return "#F97316";
  switch (type) {
    case "message": return "#3B82F6";
    case "thermometer":
    case "megaphone": return "#F5A83C";
    case "cross": return "#EF4444";
    case "celebration": return "#10B981";
    case "clock":
    case "shield": return "#F97316";
    default: return "#16A34A";
  }
}

export function NotificationTimelineCard({ item }: { item: UnifiedNotificationItem }) {
  const isUrgent = item.urgent;
  const isUnread = !item.read;

  return (
    <View
      style={[styles.card, isUrgent && styles.cardUrgent]}
    >
      {isUnread && <View style={styles.gutterDot} accessibilityLabel="Unread" />}
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
              <View style={styles.timeDot} />
              <Text style={styles.timeText}>{item.timestamp}</Text>
            </View>
          </View>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        </View>
      </View>

      {(item.primaryAction || item.secondaryAction) && (
        <View style={styles.actionsRow}>
          {item.primaryAction && (
            <ButtonComponent
              title={item.primaryAction.label}
              variant="secondary"
              onPress={item.primaryAction.onPress}
              style={[styles.actionBtn, (item.primaryAction.variant === "warning" || isUrgent) && styles.actionBtnOrange]}
              textStyle={[styles.actionBtnText, (item.primaryAction.variant === "warning" || isUrgent) && styles.actionBtnTextOrange]}
            />
          )}

          {item.secondaryAction && (
            <ButtonComponent
              title={item.secondaryAction.label}
              variant="secondary"
              onPress={item.secondaryAction.onPress}
              style={styles.actionBtn}
              textStyle={styles.actionBtnGrayText}
            />
          )}
        </View>
      )}
    </View>
  );
}
