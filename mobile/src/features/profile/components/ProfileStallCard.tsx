import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Mail, Phone } from "lucide-react-native";
import { MapPickerComponent, type Coordinates } from "../../../components/MapPickerComponent";
import { colors, fonts, radii, spacing } from "../../../theme";
import { profileColors } from "../profileTokens";

interface Props {
  coordinates: Coordinates;
  detailAddress: string;
  pickupInstructions?: string | null;
  phoneNumber: string;
  email: string;
  onEdit: () => void;
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <View style={styles.row}>
      {icon}
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value} numberOfLines={1}>{value}</Text>
    </View>
  );
}

export function ProfileStallCard({ coordinates, detailAddress, pickupInstructions, phoneNumber, email, onEdit }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <Text style={styles.title}>Your Stall</Text>
        <Pressable onPress={onEdit} accessibilityRole="button" accessibilityLabel="Edit your stall" style={styles.editHit}>
          <Text style={styles.edit}>Edit</Text>
        </Pressable>
      </View>
      <View style={styles.map}>
        <MapPickerComponent initialCoordinates={coordinates} height={140} readOnly />
      </View>
      <Text style={styles.address}>{detailAddress}</Text>
      {pickupInstructions ? (
        <View style={styles.noteRow}>
          <View style={styles.dot} />
          <Text style={styles.note}>{pickupInstructions}</Text>
        </View>
      ) : null}
      <View style={styles.rule} />
      <Row icon={<Phone size={18} color={colors.textMuted} />} label="Phone" value={phoneNumber} />
      <Row icon={<Mail size={18} color={colors.textMuted} />} label="Email" value={email} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radii.sheet, borderWidth: 1, borderColor: profileColors.border, padding: spacing.base, marginBottom: spacing.base },
  head: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.md },
  title: { fontFamily: fonts.heading.bold, fontSize: 18, color: colors.text },
  editHit: { minHeight: 44, minWidth: 44, alignItems: "flex-end", justifyContent: "center" },
  edit: { fontFamily: fonts.body.semiBold, fontSize: 15, color: colors.primary },
  map: { borderRadius: radii.button, overflow: "hidden", borderWidth: 1, borderColor: profileColors.border, marginBottom: spacing.md },
  address: { fontFamily: fonts.heading.bold, fontSize: 16, lineHeight: 22, color: colors.text },
  noteRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: spacing.xs },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary },
  note: { flex: 1, fontFamily: fonts.body.regular, fontSize: 14, color: colors.textMuted },
  rule: { height: 1, backgroundColor: profileColors.border, marginVertical: spacing.md },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.sm, minHeight: 36 },
  label: { fontFamily: fonts.body.regular, fontSize: 15, color: colors.textMuted },
  value: { flex: 1, textAlign: "right", fontFamily: fonts.body.semiBold, fontSize: 15, color: colors.text },
});
