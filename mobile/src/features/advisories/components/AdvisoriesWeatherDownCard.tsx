import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { CloudOff, RefreshCw } from "lucide-react-native";
import { ButtonComponent } from "../../../components/ButtonComponent";
import { colors, fonts, radii, spacing } from "../../../theme";

interface AdvisoriesWeatherDownCardProps {
  onRetry: () => void;
}

/** Shown when the weather service did not answer. Holidays and the rest of the app keep working. */
export const AdvisoriesWeatherDownCard: React.FC<AdvisoriesWeatherDownCardProps> = ({ onRetry }) => (
  <View style={styles.card}>
    <View style={styles.iconCircle}>
      <CloudOff size={22} color={colors.warning} />
    </View>
    <Text style={styles.title}>Weather isn't available right now.</Text>
    <Text style={styles.body}>We couldn't connect to the weather service. Your stall listings and reservations are not affected.</Text>
    <ButtonComponent title="Try Again" onPress={onRetry} variant="primary" icon={<RefreshCw size={18} color={colors.white} />} style={styles.button} />
  </View>
);

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: radii.card, padding: spacing.lg, alignItems: "center", marginBottom: spacing.md },
  iconCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#FEF3C7", alignItems: "center", justifyContent: "center" },
  title: { fontFamily: fonts.heading.semiBold, fontSize: 16, color: colors.text, marginTop: spacing.sm, textAlign: "center" },
  body: { fontFamily: fonts.body.regular, fontSize: 13, lineHeight: 20, color: colors.textMuted, marginTop: spacing.xs, textAlign: "center" },
  button: { marginTop: spacing.md, alignSelf: "stretch" },
});
