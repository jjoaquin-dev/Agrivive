import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { X } from "lucide-react-native";
import { ButtonComponent } from "../../../components/ButtonComponent";
import { colors, fonts, radii, spacing, touchTargets } from "../../../theme";

interface OrderCancelSheetProps {
  visible: boolean;
  saving: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<boolean>;
}

export function OrderCancelSheet({ visible, saving, onClose, onConfirm }: OrderCancelSheetProps) {
  const [reason, setReason] = useState("");
  const ready = reason.trim().length >= 5;

  const confirm = async () => {
    if (await onConfirm(reason.trim())) setReason("");
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <Text style={styles.title}>Cancel Reservation</Text>
            <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Close" style={styles.close}>
              <X size={22} color={colors.textMuted} />
            </Pressable>
          </View>
          <Text style={styles.body}>Tell the buyer why you can't hand this over.</Text>
          <Text style={styles.label}>Reason</Text>
          <TextInput
            value={reason}
            onChangeText={setReason}
            placeholder="e.g. Produce ran out before pickup"
            placeholderTextColor={colors.textMuted}
            multiline
            style={styles.input}
          />
          <Text style={styles.helper}>At least 5 letters</Text>
          <ButtonComponent title="Cancel Reservation" onPress={confirm} loading={saving} disabled={!ready} variant="destructive" style={styles.confirm} />
          <ButtonComponent title="Keep Reservation" onPress={onClose} variant="ghost" textStyle={styles.keep} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.5)" },
  sheet: { backgroundColor: colors.surface, borderTopLeftRadius: radii.sheet, borderTopRightRadius: radii.sheet, padding: spacing.base, paddingBottom: spacing.xl },
  handle: { alignSelf: "center", width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, marginBottom: spacing.md },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { fontFamily: fonts.heading.bold, fontSize: 17, color: colors.text },
  close: { width: touchTargets.min, height: touchTargets.min, alignItems: "center", justifyContent: "center", marginRight: -spacing.sm },
  body: { fontFamily: fonts.body.regular, fontSize: 14, color: colors.textMuted, marginBottom: spacing.base },
  label: { fontFamily: fonts.body.semiBold, fontSize: 13, color: colors.text, marginBottom: spacing.xs },
  input: { minHeight: 100, borderWidth: 1, borderColor: colors.border, borderRadius: radii.input, padding: spacing.md, fontFamily: fonts.body.regular, fontSize: 14, textAlignVertical: "top", color: colors.text },
  helper: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.base },
  confirm: { minHeight: touchTargets.min },
  keep: { color: colors.textMuted },
});
