import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, spacing } from "../../../theme";

interface Props {
  unreadCount: number;
  urgentCount: number;
}

/** One quiet line instead of a banner: how many are new and how many need the seller. */
export function NotificationSummaryBanner({ unreadCount, urgentCount }: Props) {
  if (unreadCount === 0 && urgentCount === 0) {
    return <View style={styles.row}><Text style={styles.text}>All caught up</Text></View>;
  }
  return (
    <View style={styles.row}>
      <Text style={styles.text}>{unreadCount} new</Text>
      {urgentCount > 0 ? (
        <>
          <Text style={styles.text}>·</Text>
          <Text style={[styles.text, { color: colors.warning }]}>{urgentCount} need you</Text>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: spacing.sm, paddingHorizontal: spacing.base, paddingVertical: spacing.sm },
  text: { fontFamily: fonts.body.medium, fontSize: 13, color: colors.textMuted },
});
