import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Archive, Check, Eye, EyeOff } from "lucide-react-native";
import { ButtonComponent } from "../../../components/ButtonComponent";
import { colors, fonts, radii, spacing } from "../../../theme";

interface Props {
  visible: boolean;
  productName: string;
  remaining: string;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ArchiveConfirmSheet({ visible, productName, remaining, loading, onConfirm, onCancel }: Props) {
  const rows = [
    { Icon: Check, tint: "#F0FDF4", color: colors.primary, text: `Your remaining ${remaining} is saved` },
    { Icon: EyeOff, tint: "transparent", color: colors.textMuted, text: "Buyers will no longer see this listing" },
    { Icon: Eye, tint: "transparent", color: colors.textMuted, text: "Reservations already made are not affected" },
  ];
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel} accessibilityLabel="Close archive question" />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <View style={styles.badge}><Archive size={28} color={colors.error} /></View>
        <Text style={styles.title}>Archive this listing?</Text>
        <Text style={styles.description}>
          This hides {productName} from buyers right away. You can restore it any time.
        </Text>
        <View style={styles.box}>
          {rows.map(({ Icon, tint, color, text }) => (
            <View key={text} style={styles.row}>
              <View style={[styles.rowIcon, { backgroundColor: tint }]}><Icon size={14} color={color} strokeWidth={2.4} /></View>
              <Text style={styles.rowText}>{text}</Text>
            </View>
          ))}
        </View>
        <ButtonComponent title="Archive Listing" variant="destructive" onPress={onConfirm} loading={loading} style={styles.button} textStyle={styles.buttonText} />
        <ButtonComponent title="Keep Listing" variant="secondary" onPress={onCancel} style={[styles.button, { marginTop: 10 }]} textStyle={styles.keepText} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)" },
  sheet: { backgroundColor: colors.surface, borderTopLeftRadius: radii.sheet, borderTopRightRadius: radii.sheet, paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: spacing.xl },
  handle: { alignSelf: "center", width: 36, height: 4, borderRadius: 2, backgroundColor: colors.border, marginBottom: spacing.lg },
  badge: { alignSelf: "center", width: 56, height: 56, borderRadius: 28, backgroundColor: "#FEF2F2", alignItems: "center", justifyContent: "center" },
  title: { fontFamily: fonts.heading.bold, fontSize: 20, color: colors.text, textAlign: "center", marginTop: spacing.base },
  description: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, color: colors.textMuted, textAlign: "center", marginTop: spacing.sm },
  box: { backgroundColor: colors.surfaceMuted, borderWidth: 1, borderColor: colors.border, borderRadius: radii.card - 4, padding: spacing.md + 2, marginTop: spacing.base, marginBottom: spacing.lg, gap: spacing.md },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  rowIcon: { width: 20, height: 20, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  rowText: { flex: 1, fontFamily: fonts.body.medium, fontSize: 13, color: colors.text },
  button: { minHeight: 52, borderRadius: radii.button },
  buttonText: { fontFamily: fonts.heading.bold, fontSize: 16 },
  keepText: { color: colors.text, fontSize: 16 },
});
