import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ButtonComponent } from "../../../components/ButtonComponent";
import { CardComponent } from "../../../components/CardComponent";
import { colors, fonts, radii, spacing } from "../../../theme";
import { answerPickupDecline, confirmSellerOrder, decideBuyerExcuse, markOrderNoShow, packSellerOrder, readySellerOrder } from "../api/seller-pickup";
import type { SellerOrder } from "../types";
import { OrderRescheduleSheet } from "./OrderRescheduleSheet";

const stepNames = ["Placed", "Confirmed", "Preparing", "Ready", "Completed"] as const;
const stepKeys = ["placed", "confirmed", "preparing", "ready", "completed"] as const;
const pickupTime = (iso: string | null) => (iso ? new Date(iso).toLocaleString("en-PH", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: "Asia/Manila" }) : "");

/** Progress, pickup time and the seller's next step: confirm, pack, ready, answer a decline, judge an excuse, mark a no-show, offer a new time. */
export function OrderPickupSteps({ order, onChanged }: { order: SellerOrder; onChanged: (order: SellerOrder) => void }) {
  const [busy, setBusy] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const current = stepKeys.indexOf(order.progress.current);
  const terminal = order.progress.terminal;
  const open = order.status === "pending";
  const qrExpired = order.qr.status === "expired";

  const run = async (action: () => Promise<SellerOrder>) => {
    setBusy(true);
    try { onChanged(await action()); } catch (err: any) { Alert.alert("Could Not Update", err?.message || "Please try again."); } finally { setBusy(false); }
  };

  const disputeWithPhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    let photoUri: string | undefined;
    if (permission.granted) {
      const shot = await ImagePicker.launchCameraAsync({ mediaTypes: ["images"], quality: 0.7 });
      if (!shot.canceled) photoUri = shot.assets[0]?.uri;
    }
    await run(() => answerPickupDecline(order.id, { action: "dispute", note: "The produce was fine when I handed it over.", photoUri }));
  };

  const pendingProposal = order.reschedules?.some((item) => item.status === "pending");
  return (
    <View>
      <CardComponent style={styles.card}>
        <Text style={styles.title}>Pickup time</Text>
        <Text style={styles.time}>{order.pickupStart ? `${pickupTime(order.pickupStart)} to ${new Date(order.pickupEnd!).toLocaleTimeString("en-PH", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Manila" })}` : "Set by the buyer"}</Text>
        {open ? <Text style={styles.hint}>QR {order.qr.status === "active" ? "is active now" : order.qr.status === "not_yet_valid" ? "starts at the pickup time" : "has expired"}. It works until 15 minutes after the pickup time ends.</Text> : null}
        <View style={styles.steps} accessibilityLabel="Order progress">
          {stepNames.map((name, index) => {
            const done = !terminal && index <= current;
            return <View key={name} style={styles.step}><View style={[styles.dot, done && styles.dotDone]} /><Text style={[styles.stepText, done && styles.stepDone]}>{name}</Text></View>;
          })}
        </View>
        {terminal ? <Text style={styles.terminal}>{terminal === "declined" ? "Declined at pickup" : terminal === "expired" ? "Expired" : "Cancelled"}</Text> : null}
      </CardComponent>

      {open && !order.confirmedAt ? (
        <CardComponent style={styles.card}>
          <Text style={styles.title}>Confirm this order</Text>
          <Text style={styles.hint}>If you do nothing for 3 hours after it was placed, it is confirmed for you. After that the buyer cannot cancel.</Text>
          <ButtonComponent title="Confirm Order" onPress={() => void run(() => confirmSellerOrder(order.id))} loading={busy} style={styles.button} />
        </CardComponent>
      ) : null}

      {open && order.confirmedAt && !order.readyAt ? (
        <CardComponent style={styles.card}>
          <Text style={styles.title}>Get it ready</Text>
          {!order.packedAt ? <ButtonComponent title="Mark Packed" onPress={() => void run(() => packSellerOrder(order.id))} loading={busy} variant="secondary" style={styles.button} /> : null}
          <ButtonComponent title="Mark Ready for Pickup" onPress={() => void run(() => readySellerOrder(order.id))} loading={busy} style={styles.button} />
          <Text style={styles.hint}>The order is completed only when you scan the buyer's QR at pickup.</Text>
        </CardComponent>
      ) : null}

      {open && !order.decline && !pendingProposal ? (
        <ButtonComponent title="Offer a New Pickup Time" onPress={() => setRescheduleOpen(true)} variant="ghost" style={styles.button} />
      ) : null}
      {pendingProposal ? <Text style={styles.hint}>Waiting for the buyer to answer your new pickup time.</Text> : null}

      {order.decline && ["pending_seller"].includes(order.decline.status) ? (
        <CardComponent style={styles.alertCard}>
          <Text style={styles.title}>The buyer declined at pickup</Text>
          <Text style={styles.hint}>Reason: {order.decline.reason.replace(/_/g, " ")}. Answer before {pickupTime(order.decline.sellerDueAt)}. No answer counts as accepted, and an accepted decline adds 2 points to you. If you dispute it, nobody gets points and the order closes as declined at pickup. The produce is not put back on sale.</Text>
          <ButtonComponent title="Accept Decline" onPress={() => void run(() => answerPickupDecline(order.id, { action: "accept" }))} loading={busy} style={styles.button} />
          <ButtonComponent title="Dispute and Save My Photo" onPress={() => void disputeWithPhoto()} loading={busy} variant="secondary" style={styles.button} />
        </CardComponent>
      ) : null}

      {order.status === "expired" && !order.noShowAt && qrExpired !== undefined && !order.decline ? (
        <CardComponent style={styles.card}>
          <Text style={styles.title}>Buyer did not come</Text>
          <Text style={styles.hint}>The pickup time and QR time are over. A missed pickup adds 2 points to the buyer. If you do nothing, the system records it after an hour.</Text>
          <ButtonComponent title="Mark No-Show" onPress={() => Alert.alert("Mark no-show?", "Only do this if the buyer never came.", [{ text: "Not now", style: "cancel" }, { text: "Mark No-Show", style: "destructive", onPress: () => void run(() => markOrderNoShow(order.id)) }])} loading={busy} variant="destructive" style={styles.button} />
        </CardComponent>
      ) : null}
      {order.noShow ? <Text style={styles.hint}>No-show recorded{order.noShow.excused ? " (excused)" : order.noShow.sequence === 1 ? ": first time, warning only" : `: ${order.noShow.weight} points`}.</Text> : null}

      {order.excuse?.status === "pending" ? (
        <CardComponent style={styles.alertCard}>
          <Text style={styles.title}>The buyer says a problem stopped them</Text>
          <Text style={styles.hint}>Reason: {order.excuse.reason.replace(/_/g, " ")}{order.excuse.details ? ` - ${order.excuse.details}` : ""}. If you accept, the missed pickup adds 0 points.</Text>
          <ButtonComponent title="Accept Explanation" onPress={() => void run(async () => (await decideBuyerExcuse(order.id, true)).order)} loading={busy} style={styles.button} />
          <ButtonComponent title="Reject Explanation" onPress={() => void run(async () => (await decideBuyerExcuse(order.id, false)).order)} loading={busy} variant="ghost" style={styles.button} />
        </CardComponent>
      ) : null}

      <OrderRescheduleSheet order={order} visible={rescheduleOpen} onClose={() => setRescheduleOpen(false)} onChanged={onChanged} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing.base },
  alertCard: { marginBottom: spacing.base, borderColor: "#FED7AA", borderWidth: 1, backgroundColor: "#FFF7ED" },
  title: { fontFamily: fonts.heading.semiBold, fontSize: 16, color: colors.text },
  time: { fontFamily: fonts.body.semiBold, fontSize: 15, color: colors.primary, marginTop: spacing.xs },
  hint: { fontFamily: fonts.body.regular, fontSize: 12, lineHeight: 17, color: colors.textMuted, marginTop: spacing.xs },
  steps: { flexDirection: "row", justifyContent: "space-between", marginTop: spacing.md },
  step: { alignItems: "center", flex: 1, gap: 4 },
  dot: { width: 14, height: 14, borderRadius: 7, backgroundColor: colors.border },
  dotDone: { backgroundColor: colors.primary },
  stepText: { fontFamily: fonts.body.regular, fontSize: 10, color: colors.textMuted },
  stepDone: { fontFamily: fonts.body.semiBold, color: colors.text },
  terminal: { fontFamily: fonts.body.semiBold, fontSize: 12, color: colors.error, marginTop: spacing.sm, borderRadius: radii.full },
  button: { marginTop: spacing.md },
});
