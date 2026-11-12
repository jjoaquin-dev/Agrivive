import { StyleSheet } from "react-native";
import { colors, fonts, radii, spacing, touchTargets } from "../../../theme";

export const styles = StyleSheet.create({
  card: { marginBottom: spacing.base },
  inquiryBlock: { marginBottom: spacing.md },
  headingRow: { flexDirection: "row", alignItems: "center", marginBottom: spacing.md },
  heading: { fontFamily: fonts.heading.bold, fontSize: 17, color: colors.text, marginLeft: spacing.sm },
  loadingRow: { flexDirection: "row", alignItems: "center" },
  muted: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, color: colors.textMuted },
  label: { fontFamily: fonts.body.semiBold, fontSize: 14, lineHeight: 20, color: colors.text, marginBottom: spacing.xs },
  message: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 21, color: colors.text },
  replyBox: { backgroundColor: colors.background, borderRadius: radii.input, padding: spacing.md, marginTop: spacing.md },
  formGroup: { marginTop: spacing.md },
  input: { minHeight: touchTargets.min * 2, borderWidth: 1, borderColor: colors.border, borderRadius: radii.input, padding: spacing.md, color: colors.text, fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, textAlignVertical: "top", backgroundColor: colors.surface },
  inputError: { borderColor: colors.error },
  fieldError: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, color: colors.error, marginTop: spacing.xs },
  formButton: { marginTop: spacing.sm },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.lg },
  ratingRow: { flexDirection: "row", alignItems: "center", marginBottom: spacing.xs },
  ratingText: { fontFamily: fonts.body.semiBold, fontSize: 14, color: colors.text, marginLeft: spacing.xs },
  errorText: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, color: colors.error },
  retryButton: { marginTop: spacing.sm },
});
