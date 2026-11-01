import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AlertTriangle, CheckCircle2, ChevronRight, Info } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import type { SellerTrustAction, SellerTrustResponse } from "../../trust/types";
import { profileColors } from "../profileTokens";

interface Props {
  trust: SellerTrustResponse;
  loading: boolean;
  failed: boolean;
  isActive: boolean;
  onPress: () => void;
}

function activeAction(trust: SellerTrustResponse): SellerTrustAction | null {
  const live = (trust.actions ?? []).filter((action) => !action.revokedAt && (!action.endsAt || new Date(action.endsAt) > new Date()));
  return live.find((a) => a.actionType === "temporary_restriction") ?? live.find((a) => a.actionType === "warning") ?? null;
}

function untilLabel(value: string) {
  return new Date(value).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export function ProfileStandingCard({ trust, loading, failed, isActive, onPress }: Props) {
  const points = trust.monitoring?.weightedPoints ?? 0;
  const action = activeAction(trust);
  const limited = action?.actionType === "temporary_restriction";
  const bad = !isActive || Boolean(action);
  const title = !isActive ? "Account Paused" : limited ? (action?.endsAt ? `Limited until ${untilLabel(action.endsAt)}` : "Account Limited") : action ? "Warning" : loading ? "Checking your record..." : failed ? "Could not load your record" : "Good Standing";
  const line = !isActive ? "Your account is paused. Open your record to learn why." : action ? action.reason : loading ? "One moment." : failed ? "Tap to try again." : "No problems on your record.";
  const tone = bad ? profileColors.amberText : colors.success;

  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`${title}. Open your record`} style={[styles.card, bad && styles.cardBad]}>
      <View style={styles.row}>
        <View style={[styles.icon, { backgroundColor: bad ? profileColors.amber : profileColors.mint }]}>
          {bad ? <AlertTriangle size={20} color={tone} /> : <CheckCircle2 size={20} color={tone} />}
        </View>
        <View style={styles.text}>
          <Text style={[styles.title, bad && { color: tone }]}>{title}</Text>
          <Text style={styles.line}>{line}</Text>
          {!loading && !failed ? (
            <Text style={styles.points}>Problem points: <Text style={[styles.pointsValue, points > 0 && { color: profileColors.red }]}>{points}</Text> <Text style={styles.hint}>(lower is better)</Text></Text>
          ) : null}
        </View>
        <ChevronRight size={20} color={colors.textMuted} />
      </View>
      {limited ? (
        <View style={styles.notice}>
          <Info size={16} color={profileColors.amberText} />
          <Text style={styles.noticeText}>Your listings will not show to buyers while your account is limited.</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radii.sheet, borderWidth: 1, borderColor: profileColors.border, padding: spacing.base, marginBottom: spacing.base },
  cardBad: { borderColor: profileColors.amberBorder },
  row: { flexDirection: "row", alignItems: "center" },
  icon: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", marginRight: spacing.md },
  text: { flex: 1 },
  title: { fontFamily: fonts.heading.bold, fontSize: 17, color: colors.text },
  line: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, color: colors.textMuted, marginTop: 2 },
  points: { fontFamily: fonts.body.medium, fontSize: 13, color: colors.text, marginTop: spacing.xs },
  pointsValue: { fontFamily: fonts.heading.bold },
  hint: { fontFamily: fonts.body.regular, color: colors.textMuted },
  notice: { flexDirection: "row", gap: spacing.sm, backgroundColor: profileColors.amber, borderRadius: radii.input, padding: spacing.md, marginTop: spacing.md },
  noticeText: { flex: 1, fontFamily: fonts.body.regular, fontSize: 13, lineHeight: 19, color: "#92400E" },
});
