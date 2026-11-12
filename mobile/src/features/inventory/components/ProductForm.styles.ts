import { StyleSheet } from "react-native";
import { colors, fonts, radii, spacing, touchTargets } from "../../../theme";
import { surface } from "../../../theme/surface";

export const styles = StyleSheet.create({
  container: { paddingHorizontal: spacing.base, paddingTop: spacing.sm, paddingBottom: spacing.xxl },
  errorBox: { backgroundColor: "rgba(220, 38, 38, 0.08)", borderWidth: 1, borderColor: colors.error, borderRadius: radii.input, padding: spacing.md, marginBottom: spacing.base },
  errorBoxText: { color: colors.error, fontSize: 14, fontFamily: fonts.body.medium },
  section: { marginBottom: spacing.lg },
  sectionLabel: { fontFamily: fonts.body.semiBold, fontSize: 15, color: colors.text, marginBottom: spacing.sm },
  sectionHint: { fontFamily: fonts.body.regular, fontSize: 13, lineHeight: 18, color: colors.textMuted, marginTop: spacing.sm },
  pricingSection: { backgroundColor: surface.card, borderWidth: 1, borderColor: surface.border, borderRadius: radii.card, padding: spacing.base, marginBottom: spacing.lg },
  pricingHeader: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: 2 },
  pricingIcon: { width: 28, height: 28, borderRadius: 8, backgroundColor: colors.primaryLight, alignItems: "center", justifyContent: "center" },
  segmented: { flexDirection: "row", height: 48, backgroundColor: "#F6F5F1", borderRadius: radii.full, padding: 4, gap: 4 },
  segment: { flex: 1, alignItems: "center", justifyContent: "center", borderRadius: radii.full },
  segmentSelected: { backgroundColor: colors.primary },
  segmentText: { fontFamily: fonts.body.medium, fontSize: 14, color: colors.textMuted },
  segmentTextSelected: { fontFamily: fonts.body.semiBold, color: colors.white },
  lockedField: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", height: touchTargets.min, backgroundColor: "#F6F5F1", borderWidth: 1, borderColor: colors.border, borderRadius: radii.input, paddingHorizontal: spacing.md + 2 },
  lockedValue: { fontFamily: fonts.body.medium, fontSize: 15, color: colors.text },
  lockedTag: { flexDirection: "row", alignItems: "center", gap: 4 },
  lockedTagText: { fontFamily: fonts.body.medium, fontSize: 11, letterSpacing: 0.6, textTransform: "uppercase", color: colors.textMuted },
  fieldError: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.error, marginTop: spacing.xs },
  switchRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: surface.card, borderRadius: radii.card, borderWidth: 1, borderColor: surface.border, padding: spacing.base, minHeight: touchTargets.min },
  switchInfo: { flex: 1, marginRight: spacing.md },
  switchLabel: { fontFamily: fonts.body.semiBold, fontSize: 15, color: colors.text },
  switchSubtext: { fontFamily: fonts.body.regular, fontSize: 13, lineHeight: 18, color: colors.textMuted, marginTop: 2 },
  footer: { backgroundColor: surface.page, borderTopWidth: 1, borderTopColor: surface.border, paddingHorizontal: spacing.base, paddingTop: spacing.base, paddingBottom: spacing.lg },
  submitButton: { minHeight: 52, borderRadius: radii.button },
  submitText: { fontFamily: fonts.heading.bold, fontSize: 16 },
});
