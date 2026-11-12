import React, { useCallback, useState } from "react";
import { Alert, Modal, StyleSheet, Text, TextInput, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { BadgeCheck, ShieldCheck } from "lucide-react-native";
import { apiFetch } from "../../../api/client";
import { ButtonComponent } from "../../../components/ButtonComponent";
import { CardComponent } from "../../../components/CardComponent";
import { colors, fonts, radii, spacing } from "../../../theme";

type MyTrust = {
  score: number; level: string; levelLabel: string; windowDays: number; pausedUntil: string | null;
  events: { id: string; kind: string; points: number; what: string; rule: string; createdAt: string; counted: boolean; disputeStatus: string | null; canDispute: boolean }[];
  seller: null | {
    underWatch: boolean; needsReview: boolean; flags: { kind: string; detail: string | null }[];
    fault: null | { ratePercent: number; faults: number; orders: number; minOrders: number; gatePercent: number; reviewPercent: number };
    rating: null | { bayesian: number; reviews: number };
    trustedSeller: boolean; canBoost: boolean; canList: boolean;
    trustedRequirements: { minRating: number; minCompletedOrders: number; completedOrders: number };
  };
};

/** The seller's level, 90-day score, fault rate, rating, Trusted Seller badge, flags, and events that can still be disputed (7 days). */
export function TrustStandingCard() {
  const [data, setData] = useState<MyTrust | null>(null);
  const [dispute, setDispute] = useState<MyTrust["events"][number] | null>(null);
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => { try { setData(await apiFetch<MyTrust>("/trust/me")); } catch { setData(null); } }, []);
  useFocusEffect(useCallback(() => { void load(); }, [load]));

  const send = async () => {
    if (!dispute) return;
    setSaving(true);
    try {
      const sent = await apiFetch<{ result: string; because: string }>(`/trust/events/${dispute.id}/dispute`, { method: "POST", body: JSON.stringify({ reason: reason.trim() }) });
      setDispute(null); setReason(""); await load();
      Alert.alert(sent.result === "upheld" ? "Dispute Accepted" : sent.result === "rejected" ? "Event Stays" : "Saved", `${sent.because} The system checked this against your records right away.`);
    } catch (err: any) { Alert.alert("Could Not Send", err?.message || "Please try again."); } finally { setSaving(false); }
  };

  if (!data) return null;
  const seller = data.seller;
  const disputable = data.events.filter((event) => event.canDispute);
  // Green when clean, amber when there are points or a watch, red when paused or flagged for review.
  const tone = data.pausedUntil || seller?.needsReview ? { main: colors.error, soft: "#FEE2E2" }
    : data.score > 0 || seller?.underWatch ? { main: colors.warning, soft: "#FEF3C7" } : { main: colors.primary, soft: colors.primaryLight };
  return (
    <View>
      <CardComponent style={styles.card}>
        <View style={styles.head}>
          <View style={[styles.levelIcon, { backgroundColor: tone.soft }]}><ShieldCheck size={24} color={tone.main} /></View>
          <View style={styles.headText}>
            <Text style={styles.eyebrow}>Your standing</Text>
            <Text style={[styles.level, { color: tone.main }]} numberOfLines={2}>{data.levelLabel}</Text>
          </View>
          {seller?.trustedSeller ? <View style={styles.badge}><BadgeCheck size={14} color={colors.primary} /><Text style={styles.badgeText}>Trusted Seller</Text></View> : null}
        </View>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{data.score}</Text>
            <Text style={styles.statLabel}>Trust score</Text>
            <Text style={styles.statSub}>Last {data.windowDays} days</Text>
          </View>
          {seller?.fault ? (
            <View style={styles.stat}>
              <Text style={styles.statValue}>{seller.fault.ratePercent}%</Text>
              <Text style={styles.statLabel}>Fault rate</Text>
              <Text style={styles.statSub}>{seller.fault.faults} of {seller.fault.orders} orders</Text>
            </View>
          ) : null}
          {seller?.rating ? (
            <View style={styles.stat}>
              <Text style={styles.statValue}>{seller.rating.bayesian}</Text>
              <Text style={styles.statLabel}>Rating</Text>
              <Text style={styles.statSub}>{seller.rating.reviews} reviews</Text>
            </View>
          ) : null}
        </View>

        {seller?.fault && seller.fault.orders < seller.fault.minOrders ? <Text style={styles.hint}>Fault rate is counted after {seller.fault.minOrders} orders.</Text> : null}
        {data.pausedUntil ? <Text style={styles.warn}>Pause ends {new Date(data.pausedUntil).toLocaleString("en-PH")}</Text> : null}
        {seller?.underWatch ? <Text style={styles.warn}>Under watch: your score is high, but your fault rate is under {seller.fault?.gatePercent}%, so you are not paused.</Text> : null}
        {seller?.needsReview ? <Text style={styles.warn}>High fault rate: your fault rate is {seller.fault?.reviewPercent}% or more. Priority Boost and the Trusted Seller badge are off.</Text> : null}
        {seller?.flags.filter((flag) => flag.kind === "repeat_returns").map((flag) => <Text key={flag.kind} style={styles.warn}>{flag.detail}</Text>)}
        {seller && !seller.canList ? <Text style={styles.warn}>New listings and Priority Boost are off during your pause. You can still serve your orders.</Text> : null}
        {seller ? <Text style={styles.hint}>Trusted Seller needs a rating of {seller.trustedRequirements.minRating}+, a score of 0, {seller.trustedRequirements.minCompletedOrders}+ completed orders ({seller.trustedRequirements.completedOrders} so far) and a fault rate under {seller.fault?.reviewPercent ?? 15}%.</Text> : null}
      </CardComponent>

      {disputable.length ? (
        <CardComponent style={styles.card}>
          <Text style={styles.title}>You can dispute these (7 days)</Text>
          {disputable.map((event) => (
            <View key={event.id} style={styles.event}>
              <Text style={styles.line}>{event.what} (+{event.points})</Text>
              <Text style={styles.hint}>{event.rule}</Text>
              <ButtonComponent title="Dispute" variant="secondary" onPress={() => setDispute(event)} style={styles.dispute} />
            </View>
          ))}
        </CardComponent>
      ) : null}

      <Modal visible={!!dispute} transparent animationType="slide" onRequestClose={() => setDispute(null)}>
        <View style={styles.backdrop}>
          <View style={styles.sheet}>
            <Text style={styles.title}>Dispute this event</Text>
            <Text style={styles.hint}>{dispute?.what}</Text>
            <TextInput value={reason} onChangeText={setReason} multiline placeholder="Write why this is wrong (at least 10 letters)" placeholderTextColor={colors.textMuted} style={styles.input} />
            <ButtonComponent title="Send Dispute" onPress={send} loading={saving} disabled={reason.trim().length < 10} />
            <ButtonComponent title="Cancel" variant="ghost" onPress={() => setDispute(null)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing.base },
  head: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  headText: { flex: 1 },
  levelIcon: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center" },
  eyebrow: { fontFamily: fonts.body.medium, fontSize: 13, color: colors.textMuted },
  level: { fontFamily: fonts.heading.bold, fontSize: 22, lineHeight: 28 },
  title: { flex: 1, fontFamily: fonts.heading.semiBold, fontSize: 16, color: colors.text },
  stats: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.base },
  stat: { flex: 1, backgroundColor: "#FBFAF7", borderRadius: radii.card, paddingVertical: spacing.md, paddingHorizontal: spacing.sm, alignItems: "center" },
  statValue: { fontFamily: fonts.heading.bold, fontSize: 24, color: colors.text },
  statLabel: { fontFamily: fonts.body.semiBold, fontSize: 13, color: colors.text, marginTop: 2 },
  statSub: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted, marginTop: 1, textAlign: "center" },
  line: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.text, marginTop: spacing.xs },
  hint: { fontFamily: fonts.body.regular, fontSize: 12, lineHeight: 17, color: colors.textMuted, marginTop: spacing.sm },
  warn: { fontFamily: fonts.body.semiBold, fontSize: 13, lineHeight: 18, color: colors.warning, backgroundColor: "#FFF7ED", borderRadius: radii.card, padding: spacing.sm, marginTop: spacing.sm },
  badge: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: colors.primaryLight, paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: radii.full },
  badgeText: { fontFamily: fonts.body.semiBold, fontSize: 11, color: colors.primary },
  event: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.sm, marginTop: spacing.sm },
  dispute: { marginTop: spacing.sm },
  backdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.5)" },
  sheet: { backgroundColor: colors.surface, borderTopLeftRadius: radii.sheet, borderTopRightRadius: radii.sheet, padding: spacing.base, paddingBottom: spacing.xl },
  input: { minHeight: 90, borderWidth: 1, borderColor: colors.border, borderRadius: radii.card, padding: spacing.md, fontFamily: fonts.body.regular, fontSize: 14, color: colors.text, marginVertical: spacing.md, textAlignVertical: "top" },
});
