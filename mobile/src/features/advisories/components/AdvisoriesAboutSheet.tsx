import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { CalendarDays, MapPin, ShieldCheck, X } from "lucide-react-native";
import { ButtonComponent } from "../../../components/ButtonComponent";
import { colors, fonts, radii, spacing } from "../../../theme";

interface AdvisoriesAboutSheetProps {
  visible: boolean;
  onClose: () => void;
}

const ITEMS = [
  { Icon: MapPin, tint: colors.terracotta, label: "Stall weather:", text: "Today's weather and the 3-day rain chances come from your stall pin." },
  { Icon: CalendarDays, tint: colors.warning, label: "Public holidays:", text: "Shows Philippine public holidays in the next 14 days." },
  { Icon: ShieldCheck, tint: colors.primary, label: "Nothing changes by itself:", text: "This page never cancels reservations or changes your stock. Weather outside can differ from inside your stall." },
];

export const AdvisoriesAboutSheet: React.FC<AdvisoriesAboutSheetProps> = ({ visible, onClose }) => (
  <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
    <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close" />
    <View style={styles.sheet}>
      <View style={styles.handle} />
      <View style={styles.headerRow}>
        <Text style={styles.title}>About This Page</Text>
        <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Close" style={styles.closeButton}>
          <X size={20} color={colors.textMuted} />
        </Pressable>
      </View>
      <Text style={styles.body}>Weather comes from your stall pin. Holidays are Philippine public holidays. This page doesn't change your listings or reservations.</Text>
      <View style={styles.list}>
        {ITEMS.map(({ Icon, tint, label, text }) => (
          <View key={label} style={styles.item}>
            <View style={[styles.itemIcon, { backgroundColor: `${tint}1A` }]}>
              <Icon size={18} color={tint} />
            </View>
            <Text style={styles.itemText}><Text style={styles.itemLabel}>{label}</Text> {text}</Text>
          </View>
        ))}
      </View>
      <ButtonComponent title="Got It" onPress={onClose} style={styles.button} />
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)" },
  sheet: { backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, borderTopWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.xl },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: "#D1D5DB", alignSelf: "center", marginBottom: spacing.md },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingBottom: spacing.sm, borderBottomWidth: 1, borderBottomColor: "#F3F1EA" },
  title: { fontFamily: fonts.heading.bold, fontSize: 18, color: colors.text },
  closeButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#F3F1EA", alignItems: "center", justifyContent: "center" },
  body: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 22, color: "#374151", marginTop: spacing.md },
  list: { gap: spacing.sm, marginTop: spacing.md },
  item: { flexDirection: "row", alignItems: "flex-start", gap: spacing.md, padding: spacing.md, borderRadius: 12, backgroundColor: colors.surfaceMuted, borderWidth: 1, borderColor: colors.border },
  itemIcon: { width: 28, height: 28, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  itemText: { flex: 1, fontFamily: fonts.body.regular, fontSize: 13, lineHeight: 20, color: "#374151" },
  itemLabel: { fontFamily: fonts.body.semiBold, color: colors.text },
  button: { marginTop: spacing.lg, borderRadius: radii.button },
});
