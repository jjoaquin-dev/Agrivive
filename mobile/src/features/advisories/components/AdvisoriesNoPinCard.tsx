import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MapPin } from "lucide-react-native";
import { ButtonComponent } from "../../../components/ButtonComponent";
import { colors, fonts, radii, spacing } from "../../../theme";

interface AdvisoriesNoPinCardProps {
  onAddPin: () => void;
}

/** Shown instead of the weather cards when the seller has no saved stall location. */
export const AdvisoriesNoPinCard: React.FC<AdvisoriesNoPinCardProps> = ({ onAddPin }) => (
  <View style={styles.card}>
    <View style={styles.iconCircle}>
      <MapPin size={28} color={colors.warning} />
    </View>
    <Text style={styles.title}>Add your stall pin to see weather.</Text>
    <Text style={styles.body}>We use your stall location to show local weather and rain chances.</Text>
    <ButtonComponent title="Add Stall Pin" onPress={onAddPin} style={styles.button} />
  </View>
);

const styles = StyleSheet.create({
  card: { backgroundColor: colors.warningSurface, borderColor: colors.warningBorder, borderWidth: 1.5, borderRadius: radii.card, padding: spacing.lg, alignItems: "center", marginBottom: spacing.md },
  iconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.warningSurface, alignItems: "center", justifyContent: "center" },
  title: { fontFamily: fonts.heading.bold, fontSize: 17, color: colors.warningText, marginTop: spacing.md, textAlign: "center" },
  body: { fontFamily: fonts.body.regular, fontSize: 13, lineHeight: 20, color: colors.warningText, marginTop: spacing.xs, textAlign: "center", maxWidth: 270 },
  button: { alignSelf: "stretch", marginTop: spacing.base },
});
