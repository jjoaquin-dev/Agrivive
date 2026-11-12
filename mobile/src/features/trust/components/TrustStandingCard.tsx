import React, { useCallback, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { BadgeCheck } from "lucide-react-native";
import { apiFetch } from "../../../api/client";
import { requestTrustCorrection } from "../api/seller-trust";
import { ButtonComponent } from "../../../components/ButtonComponent";
import { CardComponent } from "../../../components/CardComponent";
import { colors, fonts, radii, spacing } from "../../../theme";
import type { MyTrust } from "../types";
import { formatDate, formatDateTime } from "../../../utils/dates";
import { SlideModal } from "../../../components/SlideModal";

/** The seller's level, 90-day score, fault rate, rating, Trusted Seller badge, flags, and events that can still be disputed (7 days). */
export function TrustStandingCard() {
  const [data, setData] = useState<MyTrust | null>(null);
  const [target, setTarget] = useState<{ event: MyTrust["events"][number]; mode: "dispute" | "check" } | null>(null);
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => { try { setData(await apiFetch<MyTrust>("/trust/me")); } catch { setData(null); } }, []);
  useFocusEffect(useCallback(() => { void load(); }, [load]));

  const send = async () => {
    if (!target) return;
    setSaving(true);
    try {
      const body = JSON.stringify({ reason: reason.trim() });
      if (target.mode === "dispute") {
        const sent = await apiFetch<{ result: string; because: string }>(`/trust/events/${target.event.id}/dispute`, { method: "POST", body });
        Alert.alert(sent.result === "upheld" ? "Dispute Accepted" : sent.result === "rejected" ? "Event Stays" : "Saved", `${sent.because} The system checked this against your records right away.`);
      } else {
        const sent = await requestTrustCorrection(target.event.id, reason.trim());
        Alert.alert(sent.outcome === "invalidated" ? "Event Removed" : "Event Stays", sent.outcome === "invalidated" ? "Your records do not support this event, so it was removed." : "Your records support this event, so it stays.");
      }
      setTarget(null); setReason(""); await load();
    } catch (err: any) { Alert.alert("Could Not Send", err?.message || "Please try again."); } finally { setSaving(false); }
  };

  if (!data) return null;
  const seller = data.seller;
  return (
    <View>
      <CardComponent style={styles.card}>
        <View style={styles.head}>
          <Text style={styles.title}>Your standing: {data.levelLabel}</Text>
          {seller?.trustedSeller ? <View style={styles.badge}><BadgeCheck size={14} color={colors.primary} /><Text style={styles.badgeText}>Trusted Seller</Text></View> : null}
        </View>
        <Text style={styles.line}>Trust score (last {data.windowDays} days): {data.score}</Text>
        {data.nextLevel ? <Text style={styles.hint}>{data.nextLevel.pointsToGo} more points to reach {data.nextLevel.label} ({data.nextLevel.atPoints}).</Text> : null}
        <View style={styles.todo}>
          <Text style={styles.todoTitle}>What to do now</Text>
          <Text style={styles.line}>{data.guidance}</Text>
        </View>
        {data.pausedUntil ? <Text style={styles.line}>Pause ends {formatDateTime(data.pausedUntil)}</Text> : null}
        {seller?.fault ? <Text style={styles.line}>Fault rate: {seller.fault.ratePercent}% ({seller.fault.faults} of {seller.fault.orders} orders){seller.fault.orders < seller.fault.minOrders ? ` - counted after ${seller.fault.minOrders} orders` : ""}</Text> : null}
        {seller?.rating ? <Text style={styles.line}>Rating: {seller.rating.bayesian} from {seller.rating.reviews} reviews</Text> : null}
        {seller ? <Text style={styles.hint}>Trusted Seller needs a rating of {seller.trustedRequirements.minRating}+, a score of 0, {seller.trustedRequirements.minCompletedOrders}+ completed orders ({seller.trustedRequirements.completedOrders} so far) and a fault rate under {seller.fault?.reviewPercent ?? 15}%.</Text> : null}
        {seller?.underWatch ? <Text style={styles.warn}>Under watch: your score is high, but your fault rate is under {seller.fault?.gatePercent}%, so you are not paused.</Text> : null}
        {seller?.needsReview ? <Text style={styles.warn}>High fault rate: your fault rate is {seller.fault?.reviewPercent}% or more. Boost and the Trusted Seller badge are off.</Text> : null}
        {seller?.flags.filter((flag) => flag.kind === "repeat_returns").map((flag) => <Text key={flag.kind} style={styles.warn}>{flag.detail}</Text>)}
        {seller && !seller.canList ? <Text style={styles.warn}>New listings and Boost are off during your pause. You can still serve your orders.</Text> : null}
      </CardComponent>

      <CardComponent style={styles.card}>
        <Text style={styles.title}>Levels</Text>
        {data.ladder.map((row) => (
          <View key={row.level} style={styles.event}>
            <Text style={[styles.line, row.level === data.level ? styles.current : null]}>{row.label}{row.level === data.level ? " (you)" : ""} · from {row.fromPoints} points</Text>
            <Text style={styles.hint}>{row.summary}</Text>
          </View>
        ))}
        <Text style={styles.hint}>{data.serious} Points fade 90 days after each event.</Text>
      </CardComponent>

      <CardComponent style={styles.card}>
        <Text style={styles.title}>What counted</Text>
        <Text style={styles.hint}>Points from the last {data.windowDays} days. You can dispute an event for 7 days after it happens.</Text>
        {data.events.length === 0 ? <Text style={styles.line}>Nothing counted against you.</Text> : data.events.map((event) => (
          <View key={event.id} style={styles.event}>
            <Text style={styles.line}>{event.what} ({event.counted ? `+${event.points}` : "removed"})</Text>
            <Text style={styles.hint}>{event.rule}</Text>
            <Text style={styles.hint}>{formatDate(event.createdAt, true)}{event.disputeStatus ? ` · Dispute: ${event.disputeStatus}` : ""}</Text>
            {event.canDispute ? <ButtonComponent title="Dispute" variant="secondary" onPress={() => setTarget({ event, mode: "dispute" })} style={styles.dispute} /> : null}
            {!event.canDispute && event.canCorrect ? <ButtonComponent title="Ask for a Check" variant="secondary" onPress={() => setTarget({ event, mode: "check" })} style={styles.dispute} /> : null}
          </View>
        ))}
      </CardComponent>

      <SlideModal visible={!!target} onRequestClose={() => setTarget(null)}>
        <View style={styles.backdrop}>
          <View style={styles.sheet}>
            <Text style={styles.title}>{target?.mode === "check" ? "Ask for a check" : "Dispute this event"}</Text>
            <Text style={styles.hint}>{target?.event.what}{target?.mode === "check" ? " The system checks your order or question record again." : ""}</Text>
            <TextInput value={reason} onChangeText={setReason} multiline placeholder="Write why this is wrong (at least 10 letters)" placeholderTextColor={colors.textMuted} style={styles.input} />
            <ButtonComponent title={target?.mode === "check" ? "Send Request" : "Send Dispute"} onPress={send} loading={saving} disabled={reason.trim().length < 10} />
            <ButtonComponent title="Cancel" variant="ghost" onPress={() => setTarget(null)} />
          </View>
        </View>
      </SlideModal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing.base },
  head: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: spacing.sm },
  title: { flex: 1, fontFamily: fonts.heading.semiBold, fontSize: 16, color: colors.text },
  line: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.text, marginTop: spacing.xs },
  hint: { fontFamily: fonts.body.regular, fontSize: 12, lineHeight: 17, color: colors.textMuted, marginTop: spacing.xs },
  warn: { fontFamily: fonts.body.semiBold, fontSize: 12, lineHeight: 17, color: colors.warning, marginTop: spacing.sm },
  todo: { backgroundColor: colors.primaryLight, borderRadius: radii.card, padding: spacing.md, marginTop: spacing.md },
  todoTitle: { fontFamily: fonts.body.semiBold, fontSize: 13, color: colors.primary },
  current: { fontFamily: fonts.body.semiBold },
  badge: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: colors.primaryLight, paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: radii.full },
  badgeText: { fontFamily: fonts.body.semiBold, fontSize: 11, color: colors.primary },
  event: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.sm, marginTop: spacing.sm },
  dispute: { marginTop: spacing.sm },
  backdrop: { flex: 1, justifyContent: "flex-end" },
  sheet: { backgroundColor: colors.surface, borderTopLeftRadius: radii.sheet, borderTopRightRadius: radii.sheet, padding: spacing.base, paddingBottom: spacing.xl },
  input: { minHeight: 90, borderWidth: 1, borderColor: colors.border, borderRadius: radii.card, padding: spacing.md, fontFamily: fonts.body.regular, fontSize: 14, color: colors.text, marginVertical: spacing.md, textAlignVertical: "top" },
});
