import React from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { Bell, ChevronRight } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import type { SellerNotification } from "../types";

const titles: Record<string, string> = {
  seller_cancellation_warning: "Order cancellation recorded",
  inquiry_12h_reminder: "Buyer question needs a reply",
  inquiry_24h_warning: "Buyer question is waiting",
  inquiry_24h_buyer_notice: "Inquiry response update",
  trust_event_corrected: "Trust record updated",
};

function title(kind: string) { return titles[kind] || "Seller account update"; }

function description(kind: string) {
  switch (kind) {
    case "seller_cancellation_warning": return "A cancelled pending order was added to your trust history.";
    case "inquiry_12h_reminder": return "A buyer has been waiting for your answer for 12 hours.";
    case "inquiry_24h_warning": return "Please answer the buyer before the inquiry becomes overdue.";
    case "inquiry_24h_buyer_notice": return "The buyer was informed that the inquiry is still unanswered.";
    case "trust_event_corrected": return "A trust event was corrected after its source was checked.";
    default: return "Open the related order for more information.";
  }
}

export function SellerNotificationCard({ item, onPress }: { item: SellerNotification; onPress: () => void }) {
  const unread = !item.readAt;
  return (
    <Pressable onPress={onPress} accessibilityRole="button"
      accessibilityLabel={`${title(item.kind)}${unread ? ", unread" : ""}`}
      style={({ pressed }) => [styles.card, unread && styles.unread, pressed && styles.pressed]}>
      <View style={[styles.icon, unread && styles.iconUnread]}>
        <Bell size={19} color={unread ? colors.primary : colors.textMuted} />
      </View>
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title(item.kind)}</Text>
          {unread ? <View style={styles.dot} accessible accessibilityLabel="Unread" /> : null}
        </View>
        <Text style={styles.description}>{description(item.kind)}</Text>
        <Text style={styles.date}>{new Date(item.createdAt).toLocaleString()}</Text>
      </View>
      <ChevronRight size={20} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { minHeight: 92, flexDirection: "row", alignItems: "center", backgroundColor: colors.surface, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border, padding: spacing.base, marginBottom: spacing.sm },
  unread: { borderColor: colors.primary, backgroundColor: "rgba(31, 77, 58, 0.04)" },
  pressed: { opacity: 0.75 },
  icon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.background, alignItems: "center", justifyContent: "center", marginRight: spacing.md },
  iconUnread: { backgroundColor: "rgba(31, 77, 58, 0.12)" },
  content: { flex: 1, marginRight: spacing.sm },
  titleRow: { flexDirection: "row", alignItems: "center" },
  title: { flex: 1, fontFamily: fonts.body.semiBold, fontSize: 16, lineHeight: 22, color: colors.text },
  description: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, color: colors.textMuted, marginTop: 2 },
  date: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted, marginTop: spacing.xs },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginLeft: spacing.xs },
});
