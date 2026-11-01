import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, radii, spacing, typography } from "../../../theme";
import { ButtonComponent } from "../../../components/ButtonComponent";

interface Props {
  unreadCount: number;
  urgentCount: number;
  onMarkAllRead: () => void;
}

export function NotificationSummaryBanner({ unreadCount, urgentCount, onMarkAllRead }: Props) {
  return (
    <View style={styles.banner}>
      <View style={styles.copyContainer}>
        <Text style={styles.heading}>
          {unreadCount > 0 ? `${unreadCount} Unread` : "All Caught Up"}
        </Text>
        <Text style={styles.subheading}>
          {urgentCount > 0
            ? `${urgentCount} require immediate attention`
            : "No urgent actions required"}
        </Text>
      </View>

      {unreadCount > 0 && (
        <ButtonComponent title="Mark All Read" variant="secondary" onPress={onMarkAllRead} style={styles.markButton} textStyle={styles.markText} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { backgroundColor: colors.primarySurface, borderWidth: 1, borderColor: colors.primaryLight, borderRadius: radii.card, padding: spacing.base, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginVertical: spacing.sm },
  copyContainer: { flex: 1, marginRight: spacing.sm },
  heading: { ...typography.screenTitle, color: colors.text },
  subheading: { ...typography.label, color: colors.textMuted, marginTop: 2 },
  markButton: { minHeight: 40, paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: radii.full },
  markText: { fontSize: 13, color: colors.text },
});
