import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Clock, PlusCircle, RefreshCw, Sprout } from "lucide-react-native";
import { ButtonComponent } from "../../../components/ButtonComponent";
import { colors, fonts, radii, spacing } from "../../../theme";

interface StockFreshnessWarningModalProps {
  visible: boolean;
  productName: string;
  hoursOld: number;
  startPrice: number;
  currentPrice: number;
  onPostNewHarvest: () => void;
  onProceedAnyway: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const peso = (value: number) => `₱${value.toFixed(2)}`;

export const StockFreshnessWarningModal: React.FC<StockFreshnessWarningModalProps> = ({
  visible, productName, hoursOld, startPrice, currentPrice, onPostNewHarvest, onProceedAnyway, onCancel, loading = false,
}) => (
  <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
    <Pressable style={styles.backdrop} onPress={onCancel} accessibilityLabel="Close warning" />
    <View style={styles.sheet}>
      <View style={styles.handle} />
      <View style={styles.badge}><Clock size={28} color={colors.warning} /></View>
      <Text style={styles.title}>This batch is over 12 hours old</Text>
      <Text style={styles.description}>
        This {productName} batch was posted {Math.floor(hoursOld)} hours ago. Fresh vegetables sell faster when listed as a new harvest, rather than mixed with an older batch.
      </Text>

      <View style={styles.compare}>
        <View style={styles.compareRow}>
          <View style={[styles.rowIcon, { backgroundColor: "#DCFCE7" }]}><Sprout size={14} color={colors.primary} /></View>
          <Text style={styles.rowText}>
            <Text style={styles.recommended}>RECOMMENDED </Text>
            <Text style={styles.bold}>Post as New Harvest</Text> keeps produce fresh at the starting price (<Text style={styles.price}>{peso(startPrice)}</Text>)
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.compareRow}>
          <View style={[styles.rowIcon, { backgroundColor: "#F3F1EA" }]}><RefreshCw size={14} color={colors.textMuted} /></View>
          <Text style={[styles.rowText, { color: "#4B5563" }]}>
            <Text style={styles.bold}>Adding to this batch</Text> keeps the old batch date and the current price (<Text style={styles.bold}>{peso(currentPrice)}</Text>)
          </Text>
        </View>
      </View>

      <ButtonComponent title="Post as New Harvest" icon={<PlusCircle size={20} color={colors.white} />} onPress={onPostNewHarvest} style={styles.button} textStyle={styles.buttonText} />
      <ButtonComponent title="Add to This Batch Anyway" variant="secondary" onPress={onProceedAnyway} loading={loading} style={[styles.button, { marginTop: 10 }]} textStyle={styles.secondaryText} />
      <Pressable onPress={onCancel} style={styles.cancel} accessibilityRole="button">
        <Text style={styles.cancelText}>Cancel</Text>
      </Pressable>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)" },
  sheet: { backgroundColor: colors.surface, borderTopLeftRadius: radii.sheet, borderTopRightRadius: radii.sheet, paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: spacing.xl },
  handle: { alignSelf: "center", width: 36, height: 4, borderRadius: 2, backgroundColor: colors.border, marginBottom: spacing.base },
  badge: { alignSelf: "center", width: 56, height: 56, borderRadius: 28, backgroundColor: "#FFF7ED", alignItems: "center", justifyContent: "center" },
  title: { fontFamily: fonts.heading.bold, fontSize: 20, color: colors.text, textAlign: "center", marginTop: spacing.base },
  description: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, color: colors.textMuted, textAlign: "center", marginTop: spacing.sm },
  compare: { backgroundColor: colors.surfaceMuted, borderWidth: 1, borderColor: colors.border, borderRadius: radii.card - 4, padding: spacing.md + 2, marginTop: spacing.base, marginBottom: spacing.lg },
  compareRow: { flexDirection: "row", gap: spacing.sm + 2, alignItems: "flex-start" },
  rowIcon: { width: 20, height: 20, borderRadius: 10, alignItems: "center", justifyContent: "center", marginTop: 1 },
  rowText: { flex: 1, fontFamily: fonts.body.regular, fontSize: 13, lineHeight: 18, color: colors.text },
  recommended: { fontFamily: fonts.heading.bold, fontSize: 10, letterSpacing: 0.6, color: colors.primary },
  bold: { fontFamily: fonts.body.semiBold },
  price: { fontFamily: fonts.body.semiBold, color: "#386600" },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.sm + 2 },
  button: { minHeight: 52, borderRadius: radii.button },
  buttonText: { fontFamily: fonts.heading.bold, fontSize: 16 },
  secondaryText: { color: colors.text, fontSize: 15 },
  cancel: { minHeight: 44, alignItems: "center", justifyContent: "center", marginTop: 6 },
  cancelText: { fontFamily: fonts.body.semiBold, fontSize: 15, color: colors.textMuted },
});
