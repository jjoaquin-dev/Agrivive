import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fonts, radii, spacing } from "../theme";

interface Props {
  visible: boolean;
  icon: React.ReactNode;
  title: string;
  message: string;
  cancelLabel: string;
  confirmLabel: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

/** Small centered question with a quiet Cancel and a red confirm button. */
export function ConfirmDialogComponent({ visible, icon, title, message, cancelLabel, confirmLabel, loading, onCancel, onConfirm }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel} statusBarTranslucent>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} accessibilityLabel="Close" />
        <View style={styles.card} accessibilityViewIsModal>
          <View style={styles.iconWrap}>{icon}</View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.row}>
            <Pressable onPress={onCancel} accessibilityRole="button" style={[styles.btn, styles.cancel]}>
              <Text style={styles.cancelText}>{cancelLabel}</Text>
            </Pressable>
            <Pressable onPress={onConfirm} disabled={loading} accessibilityRole="button" style={[styles.btn, styles.confirm, loading && styles.disabled]}>
              <Text style={styles.confirmText}>{confirmLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(17,24,39,0.55)", justifyContent: "center", padding: spacing.xl },
  card: { backgroundColor: colors.white, borderRadius: radii.sheet + 4, padding: spacing.lg },
  iconWrap: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#FEE2E2", alignItems: "center", justifyContent: "center", marginBottom: spacing.md },
  title: { fontFamily: fonts.heading.bold, fontSize: 18, color: colors.text },
  message: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 21, color: colors.textMuted, marginTop: spacing.xs },
  row: { flexDirection: "row", gap: spacing.md, marginTop: spacing.lg },
  btn: { flex: 1, minHeight: 48, borderRadius: radii.button, alignItems: "center", justifyContent: "center" },
  cancel: { backgroundColor: "#F3F1EA", borderWidth: 1, borderColor: colors.border },
  cancelText: { fontFamily: fonts.body.semiBold, fontSize: 15, color: colors.text },
  confirm: { backgroundColor: colors.error },
  confirmText: { fontFamily: fonts.body.semiBold, fontSize: 15, color: colors.white },
  disabled: { opacity: 0.6 },
});
