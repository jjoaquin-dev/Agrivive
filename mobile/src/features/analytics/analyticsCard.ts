import { StyleSheet } from "react-native";
import { colors, fonts, radii, shadows, spacing } from "../../theme";

/** One card look for every Sales Report section (Gestalt common region, Wertheimer et al.). */
export const cardStyles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border, padding: spacing.base, marginBottom: spacing.md, ...shadows.card },
  title: { fontFamily: fonts.heading.semiBold, fontSize: 17, lineHeight: 24, color: colors.text },
  subtitle: { fontFamily: fonts.body.regular, fontSize: 12, lineHeight: 18, color: colors.textMuted, marginTop: 2 },
});
