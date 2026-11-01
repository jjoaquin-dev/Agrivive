import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Clock3, TrendingDown } from "lucide-react-native";
import { ButtonComponent } from "../../../components/ButtonComponent";
import { colors, fonts, radii, spacing } from "../../../theme";
import type { PriceDropRule } from "../types";

interface Props {
  rule: PriceDropRule;
  onSetUp: () => void;
}

const time = (value: string) =>
  new Date(value).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

function copy(rule: PriceDropRule) {
  const score = rule.score === null ? null : Math.round(rule.score * 100);
  switch (rule.state) {
    case "set_up_now": return { title: "Set your price drop", text: "Your produce was Priority Boost when it posted. Choose how much the price drops every 6 hours and your final price." };
    case "waiting_6h": return { title: "Price drop opens soon", text: `Your produce was Priority Boost when it posted${score === null ? "" : ` (score ${score} of 100)`}. You can set your price drop at ${rule.setupAt ? time(rule.setupAt) : "6 hours after the post"}, or now.` };
    case "on": return { title: "Price drop is on", text: rule.nextDropAt ? `The price drops again at ${time(rule.nextDropAt)}.` : "The price drops every 6 hours." };
    case "not_priority": return { title: "No price drop", text: `Your produce was ${rule.tier ?? "below Priority Boost"} when it posted${score === null ? "" : ` (score ${score} of 100)`}. Only Priority Boost produce gets the 6-hour price drop.` };
    case "ended": return { title: "Price drop finished", text: "The price reached your final price, or the produce is no longer for sale." };
    default: return { title: "Price drop is off", text: "Your price stays the same." };
  }
}

/** The 6-hour price drop rule for a produce that has posted: what it is doing and, for Priority produce, how to set it up. */
export function PriceDropRuleCard({ rule, onSetUp }: Props) {
  const text = copy(rule);
  const canSetUp = rule.state === "set_up_now" || rule.state === "waiting_6h";
  const Icon = rule.state === "waiting_6h" ? Clock3 : TrendingDown;
  return (
    <View style={styles.card} accessibilityRole="summary">
      <View style={styles.row}>
        <Icon size={22} color={rule.state === "not_priority" ? colors.textMuted : colors.primary} />
        <View style={styles.copy}>
          <Text style={styles.title}>{text.title}</Text>
          <Text style={styles.text}>{text.text}</Text>
        </View>
      </View>
      {canSetUp ? <ButtonComponent title="Set Price Drop" onPress={onSetUp} style={styles.action} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.primarySurface, borderRadius: radii.card, borderWidth: 1, borderColor: colors.primaryLight, padding: spacing.base, marginTop: spacing.base },
  row: { flexDirection: "row", gap: spacing.md },
  copy: { flex: 1 },
  title: { fontFamily: fonts.body.semiBold, fontSize: 15, color: colors.text },
  text: { fontFamily: fonts.body.regular, fontSize: 13, lineHeight: 19, color: colors.textMuted, marginTop: 2 },
  action: { minHeight: 48, marginTop: spacing.md },
});
