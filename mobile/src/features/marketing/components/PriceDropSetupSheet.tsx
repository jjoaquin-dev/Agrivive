import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Coins } from "lucide-react-native";
import { ButtonComponent } from "../../../components/ButtonComponent";
import { InputComponent } from "../../../components/InputComponent";
import { colors, fonts, radii, spacing } from "../../../theme";
import { setAutoPriceDropEnabled } from "../api/visibility-boosts";

interface Props {
  visible: boolean;
  productId: string;
  price: number;
  onClose: () => void;
  onSaved: () => void;
}

/** Priority Boost produce: how much the price drops every 6 hours, and the final price it never goes below. */
export function PriceDropSetupSheet({ visible, productId, price, onClose, onSaved }: Props) {
  const [amount, setAmount] = useState("");
  const [finalPrice, setFinalPrice] = useState("");
  const [errors, setErrors] = useState<{ amount?: string; finalPrice?: string; general?: string }>({});
  const [busy, setBusy] = useState(false);

  const save = async () => {
    const drop = parseFloat(amount), floor = parseFloat(finalPrice);
    const next: typeof errors = {};
    if (!Number.isFinite(drop) || drop <= 0 || drop >= price) next.amount = `Enter an amount above ₱0 and below ₱${price.toFixed(2)}.`;
    if (!Number.isFinite(floor) || floor < 1 || floor > price) next.finalPrice = `Enter a final price from ₱1 up to ₱${price.toFixed(2)}.`;
    if (next.amount || next.finalPrice) return setErrors(next);
    setBusy(true);
    setErrors({});
    try {
      await setAutoPriceDropEnabled(productId, true, { amount: drop, minimumPrice: floor });
      setAmount(""); setFinalPrice("");
      onSaved();
    } catch (reason: any) {
      setErrors({ general: reason?.message || "Could not save your price drop. Check your connection and try again." });
    } finally { setBusy(false); }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close" />
      <View style={styles.sheet} accessibilityViewIsModal>
        <View style={styles.handle} />
        <Text style={styles.title}>Set your price drop</Text>
        <Text style={styles.text}>The price drops by this amount every 6 hours, until your final price. It never goes lower. The first drop happens once the 6 hours after your post are up.</Text>
        <InputComponent label="Drop by (₱) every 6 hours" placeholder="e.g. 3" keyboardType="decimal-pad" value={amount} error={errors.amount}
          leftIcon={<Coins size={18} color={colors.textMuted} />} onChangeText={(value) => { setAmount(value); setErrors({}); }} />
        <InputComponent label="Final price (₱)" placeholder="e.g. 20" keyboardType="decimal-pad" value={finalPrice} error={errors.finalPrice}
          hint={`Your price now is ₱${price.toFixed(2)}.`} leftIcon={<Coins size={18} color={colors.textMuted} />}
          onChangeText={(value) => { setFinalPrice(value); setErrors({}); }} />
        {errors.general ? <Text accessibilityRole="alert" style={styles.error}>{errors.general}</Text> : null}
        <ButtonComponent title="Save Price Drop" onPress={() => void save()} loading={busy} style={styles.primary} />
        <ButtonComponent title="Not Now" variant="ghost" onPress={onClose} style={styles.secondary} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(17,24,39,0.45)" },
  sheet: { backgroundColor: colors.white, borderTopLeftRadius: radii.sheet + 4, borderTopRightRadius: radii.sheet + 4, padding: spacing.lg, paddingBottom: spacing.xl },
  handle: { alignSelf: "center", width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, marginBottom: spacing.md },
  title: { fontFamily: fonts.heading.bold, fontSize: 22, color: colors.text, textAlign: "center" },
  text: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 21, color: colors.textMuted, textAlign: "center", marginTop: spacing.xs, marginBottom: spacing.base },
  error: { color: colors.error, fontFamily: fonts.body.medium, fontSize: 14, marginTop: spacing.sm },
  primary: { minHeight: 52, marginTop: spacing.md },
  secondary: { minHeight: 48, marginTop: spacing.xs },
});
