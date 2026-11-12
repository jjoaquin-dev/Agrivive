import React, { useState } from "react";
import { Alert, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Minus, Plus } from "lucide-react-native";
import { ButtonComponent } from "../../../components/ButtonComponent";
import { colors, fonts, radii, spacing, touchTargets } from "../../../theme";
import { offerNewPickupTime } from "../api/seller-pickup";
import type { SellerOrder } from "../types";

const HOUR = 3_600_000;
const label = (date: Date) => date.toLocaleString("en-PH", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: "Asia/Manila" });

/** The seller offers a new start time (in 30-minute steps, keeping the same length) and a reason. The buyer must accept. */
export function OrderRescheduleSheet({ order, visible, onClose, onChanged }: { order: SellerOrder; visible: boolean; onClose: () => void; onChanged: (order: SellerOrder) => void }) {
  // New reservations span until a deadline (many hours), which the server refuses as a pickup range. Offer a 1-hour range then.
  const span = order.pickupStart && order.pickupEnd ? new Date(order.pickupEnd).getTime() - new Date(order.pickupStart).getTime() : HOUR;
  const length = span > 4 * HOUR ? HOUR : span;
  const base = Math.max(Date.now() + HOUR, order.pickupStart ? new Date(order.pickupStart).getTime() : 0);
  const [start, setStart] = useState(() => Math.ceil(base / 1_800_000) * 1_800_000);
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  const send = async () => {
    setSaving(true);
    try {
      onChanged(await offerNewPickupTime(order.id, { pickupStart: new Date(start).toISOString(), pickupEnd: new Date(start + length).toISOString(), reason: reason.trim() }));
      setReason(""); onClose();
      Alert.alert("Sent", "The buyer must accept before anything changes.");
    } catch (err: any) { Alert.alert("Could Not Offer", err?.message || "Please try again."); } finally { setSaving(false); }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Offer a new pickup time</Text>
          <Text style={styles.hint}>Use this for a sudden problem such as heavy rain or a closed road. The old time stays until the buyer accepts.</Text>
          <View style={styles.row}>
            <Pressable accessibilityRole="button" accessibilityLabel="Earlier" onPress={() => setStart((value) => value - 1_800_000)} style={styles.step}><Minus size={18} color={colors.primary} /></Pressable>
            <Text style={styles.value}>{label(new Date(start))}</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="Later" onPress={() => setStart((value) => value + 1_800_000)} style={styles.step}><Plus size={18} color={colors.primary} /></Pressable>
          </View>
          <Text style={styles.hint}>Buyers can pick up today or tomorrow, inside your opening hours.</Text>
          <TextInput value={reason} onChangeText={setReason} placeholder="Why? e.g. Heavy rain at the market" placeholderTextColor={colors.textMuted} multiline style={styles.input} />
          <ButtonComponent title="Send to Buyer" onPress={send} loading={saving} disabled={reason.trim().length < 5} />
          <ButtonComponent title="Cancel" onPress={onClose} variant="ghost" />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.5)" },
  sheet: { backgroundColor: colors.surface, borderTopLeftRadius: radii.sheet, borderTopRightRadius: radii.sheet, padding: spacing.base, paddingBottom: spacing.xl },
  title: { fontFamily: fonts.heading.bold, fontSize: 17, color: colors.text },
  hint: { fontFamily: fonts.body.regular, fontSize: 12, lineHeight: 17, color: colors.textMuted, marginVertical: spacing.sm },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginVertical: spacing.sm },
  step: { width: touchTargets.min, height: touchTargets.min, borderRadius: touchTargets.min / 2, backgroundColor: colors.primaryLight, alignItems: "center", justifyContent: "center" },
  value: { fontFamily: fonts.body.semiBold, fontSize: 15, color: colors.text, textAlign: "center", flex: 1 },
  input: { minHeight: 72, borderWidth: 1, borderColor: colors.border, borderRadius: radii.card, padding: spacing.md, fontFamily: fonts.body.regular, fontSize: 14, color: colors.text, marginBottom: spacing.md, textAlignVertical: "top" },
});
