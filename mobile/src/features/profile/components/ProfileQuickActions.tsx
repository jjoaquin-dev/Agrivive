import React from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { ChevronRight, MessageSquareText, Store } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import { profileColors } from "../profileTokens";

interface Props {
  closedToday: boolean | null;
  toReply: number | null;
  saving: boolean;
  failed: boolean;
  onToggleClosed: (next: boolean) => void;
  onReviews: () => void;
}

/** What may need the seller right now, before the settings: close the store for today, and reviews waiting for a reply. */
export function ProfileQuickActions({ closedToday, toReply, saving, failed, onToggleClosed, onReviews }: Props) {
  const waiting = (toReply ?? 0) > 0;
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={[styles.icon, closedToday && styles.iconWarn]}><Store size={20} color={closedToday ? profileColors.amberText : colors.primary} /></View>
        <View style={styles.text}>
          <Text style={styles.title}>{closedToday ? "Store is closed today" : "Close store today"}</Text>
          <Text style={styles.hint}>{failed ? "Could not save. Try again." : closedToday ? "Buyers pick up on your next open day. Turns off tomorrow." : "Use this if you cannot open today."}</Text>
        </View>
        <Switch value={Boolean(closedToday)} disabled={closedToday === null || saving} onValueChange={onToggleClosed}
          trackColor={{ true: colors.primary }} accessibilityLabel="Close store today" />
      </View>
      <View style={styles.divider} />
      <Pressable onPress={onReviews} accessibilityRole="button" accessibilityLabel={waiting ? `${toReply} reviews to reply to` : "Ratings and reviews"} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
        <View style={[styles.icon, waiting && styles.iconWarn]}><MessageSquareText size={20} color={waiting ? profileColors.amberText : colors.primary} /></View>
        <View style={styles.text}>
          <Text style={styles.title}>{waiting ? "Reviews waiting for your reply" : "Ratings & Reviews"}</Text>
          <Text style={styles.hint}>{waiting ? "Replying helps buyers trust your stall." : toReply === null ? "Loading..." : "You have answered every review."}</Text>
        </View>
        {waiting ? <View style={styles.count}><Text style={styles.countText}>{toReply}</Text></View> : null}
        <ChevronRight size={18} color={colors.textMuted} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radii.sheet, borderWidth: 1, borderColor: profileColors.border, marginBottom: spacing.base, overflow: "hidden" },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md, minHeight: 68, paddingHorizontal: spacing.base, paddingVertical: spacing.sm },
  pressed: { backgroundColor: "#FAF9F6" },
  divider: { height: 1, backgroundColor: profileColors.border, marginLeft: spacing.base + 40 + spacing.md },
  icon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primaryLight, alignItems: "center", justifyContent: "center" },
  iconWarn: { backgroundColor: profileColors.amber },
  text: { flex: 1 },
  title: { fontFamily: fonts.heading.bold, fontSize: 15, color: colors.text },
  hint: { fontFamily: fonts.body.regular, fontSize: 13, lineHeight: 18, color: colors.textMuted, marginTop: 1 },
  count: { minWidth: 26, height: 26, borderRadius: 13, paddingHorizontal: 8, backgroundColor: colors.terracotta, alignItems: "center", justifyContent: "center" },
  countText: { fontFamily: fonts.body.semiBold, fontSize: 13, color: colors.white },
});
