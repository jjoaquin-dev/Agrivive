import { StyleSheet } from "react-native";
import { colors, fonts, radii, spacing, touchTargets } from "../../../theme";

export const styles = StyleSheet.create({
  container: { paddingHorizontal: spacing.base, paddingTop: spacing.base, paddingBottom: 140 },
  errorBox: { backgroundColor: "rgba(184, 84, 80, 0.1)", borderWidth: 1, borderColor: colors.error, borderRadius: radii.input, padding: spacing.md, marginBottom: spacing.base },
  errorBoxText: { color: colors.error, fontSize: 14, fontFamily: fonts.body.medium },
  section: { marginBottom: spacing.base },
  sectionLabel: { fontFamily: fonts.body.semiBold, fontSize: 14, color: colors.text, marginBottom: 2 },
  sectionHint: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted, marginBottom: spacing.sm },
  pricingSection: { marginBottom: spacing.base },
  unitRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs },
  unitChip: { flexDirection: "row", alignItems: "center", paddingHorizontal: spacing.md, paddingVertical: 10, borderRadius: radii.input, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, minHeight: touchTargets.min },
  unitChipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  unitChipDisabled: { opacity: 0.6 },
  unitChipText: { fontFamily: fonts.body.medium, fontSize: 13, color: colors.text },
  unitChipTextSelected: { color: colors.white, fontFamily: fonts.body.semiBold },
  fieldError: { fontFamily: fonts.body.regular, fontSize: 14, color: colors.error, marginTop: spacing.xs },
  switchRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: colors.surface, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border, padding: spacing.base, marginBottom: spacing.lg, minHeight: touchTargets.min },
  switchInfo: { flex: 1, marginRight: spacing.md },
  switchLabel: { fontFamily: fonts.body.semiBold, fontSize: 14, color: colors.text },
  switchSubtext: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted, marginTop: 2 },
  submitButton: { marginTop: spacing.sm },
});
