import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Bell, CheckCheck, Search } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";

interface Props {
  searchQuery: string;
  hasFilters: boolean;
  hasAnyItems: boolean;
}

/** Says why the list is empty, so the seller knows if something is wrong or just quiet. */
export function NotificationEmptyState({ searchQuery, hasFilters, hasAnyItems }: Props) {
  const searching = searchQuery.trim().length > 0;
  const Icon = searching ? Search : hasAnyItems ? CheckCheck : Bell;
  const title = searching ? "No matching notifications" : hasFilters || hasAnyItems ? "Nothing to show here" : "No notifications yet";
  const text = searching
    ? `We found nothing for "${searchQuery.trim()}".`
    : hasFilters || hasAnyItems
      ? "Try another tab or change the filter."
      : "Reservations, messages and listing updates will show up here.";
  return (
    <View style={styles.wrap}>
      <View style={styles.circle}><Icon size={32} color={colors.primary} /></View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", paddingVertical: spacing.xxl, paddingHorizontal: spacing.xl },
  circle: { width: 72, height: 72, borderRadius: radii.full, backgroundColor: colors.primarySurface, alignItems: "center", justifyContent: "center", marginBottom: spacing.base },
  title: { fontFamily: fonts.heading.bold, fontSize: 18, color: colors.text, textAlign: "center" },
  text: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, color: colors.textMuted, textAlign: "center", marginTop: 6 },
});
