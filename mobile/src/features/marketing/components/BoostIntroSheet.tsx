import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Info, Megaphone } from "lucide-react-native";
import { ButtonComponent } from "../../../components/ButtonComponent";
import { colors, fonts, radii, spacing } from "../../../theme";
import { PlatformBadge } from "./PlatformBadge";

interface Props {
  visible: boolean;
  priceReductionPercent: number;
  onPreview: () => void;
  onClose: () => void;
}

const benefits = (percent: number) => [
  { title: "Reach more buyers", text: "Get your produce seen by more people." },
  {
    title: "Lower the price if needed",
    text: percent > 0
      ? `If it has not sold, the price drops ${percent}% on its own.`
      : "Your price stays the same unless you set a price drop.",
  },
  { title: "Share on Facebook and Instagram", text: "Your product can appear on both Agrivive pages." },
];

/** The first Boost step: a short bottom sheet (Hick's Law: three choices to read, two actions). */
export function BoostIntroSheet({ visible, priceReductionPercent, onPreview, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close" />
      <View style={styles.sheet} accessibilityViewIsModal>
        <View style={styles.handle} />
        <View style={styles.iconWrap}><Megaphone size={34} color={colors.primary} /></View>
        <Text style={styles.title}>Boost this produce?</Text>
        <Text style={styles.text}>Reach more buyers by sharing your product on the Agrivive Facebook and Instagram pages.</Text>
        {benefits(priceReductionPercent).map((item, index) => (
          <View key={item.title} style={styles.row}>
            <View style={styles.number}><Text style={styles.numberText}>{index + 1}</Text></View>
            <View style={styles.rowCopy}>
              <Text style={styles.rowTitle}>{item.title}</Text>
              <Text style={styles.rowText}>{item.text}</Text>
            </View>
            {index === 2 ? <View style={styles.badges}><PlatformBadge platform="facebook" size={24} /><PlatformBadge platform="instagram" size={24} /></View> : null}
          </View>
        ))}
        <View style={styles.free}><Info size={16} color={colors.textMuted} /><Text style={styles.freeText}>Free promotion · Not a paid advertisement.</Text></View>
        <ButtonComponent title="Preview Post" onPress={onPreview} style={styles.primary} />
        <ButtonComponent title="Not Now" variant="ghost" onPress={onClose} style={styles.secondary} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(17,24,39,0.45)" },
  sheet: { backgroundColor: colors.white, borderTopLeftRadius: radii.sheet + 4, borderTopRightRadius: radii.sheet + 4, padding: spacing.lg, paddingBottom: spacing.xl },
  handle: { alignSelf: "center", width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, marginBottom: spacing.md },
  iconWrap: { alignSelf: "center", width: 72, height: 72, borderRadius: 36, backgroundColor: colors.primaryLight, alignItems: "center", justifyContent: "center" },
  title: { fontFamily: fonts.heading.bold, fontSize: 24, color: colors.text, textAlign: "center", marginTop: spacing.md },
  text: { fontFamily: fonts.body.regular, fontSize: 15, lineHeight: 22, color: colors.textMuted, textAlign: "center", marginTop: spacing.xs, marginBottom: spacing.base },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md, backgroundColor: colors.primarySurface, borderRadius: radii.card, padding: spacing.md, marginBottom: spacing.sm },
  number: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primaryLight, alignItems: "center", justifyContent: "center" },
  numberText: { fontFamily: fonts.heading.bold, fontSize: 14, color: colors.primary },
  rowCopy: { flex: 1 },
  rowTitle: { fontFamily: fonts.body.semiBold, fontSize: 15, color: colors.text },
  rowText: { fontFamily: fonts.body.regular, fontSize: 13, lineHeight: 18, color: colors.textMuted, marginTop: 2 },
  badges: { gap: 4 },
  free: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm, marginVertical: spacing.sm },
  freeText: { fontFamily: fonts.body.medium, fontSize: 13, color: colors.textMuted },
  primary: { minHeight: 52 },
  secondary: { minHeight: 48, marginTop: spacing.xs },
});
