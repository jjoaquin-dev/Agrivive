import { StyleSheet } from "react-native";
import { colors, fonts, radii, spacing } from "../../../theme";

export const sellerOrderReportStyles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.35)" },
  sheet: { maxHeight: "92%", backgroundColor: colors.surface, borderTopLeftRadius: radii.sheet, borderTopRightRadius: radii.sheet, padding: spacing.base },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { fontFamily: fonts.heading.bold, fontSize: 20, color: colors.text },
  text: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, color: colors.textMuted, marginTop: spacing.sm },
  successRow: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm },
  label: { fontFamily: fonts.body.semiBold, fontSize: 14, color: colors.text, marginTop: spacing.base, marginBottom: spacing.sm },
  reasonRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  reason: { borderWidth: 1, borderColor: colors.border, borderRadius: radii.button, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  reasonSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  reasonText: { fontFamily: fonts.body.medium, fontSize: 13, color: colors.primary },
  reasonTextSelected: { color: colors.white },
  input: { minHeight: 120, borderWidth: 1, borderColor: colors.border, borderRadius: radii.input, padding: spacing.md, fontFamily: fonts.body.regular, fontSize: 14, textAlignVertical: "top", color: colors.text },
  count: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted, textAlign: "right", marginTop: spacing.xs },
  error: { fontFamily: fonts.body.medium, fontSize: 13, color: colors.error, marginTop: spacing.sm },
  fileRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  fileName: { flex: 1, fontFamily: fonts.body.regular, fontSize: 13, color: colors.text, marginRight: spacing.sm },
  fileStatus: { fontFamily: fonts.body.medium, fontSize: 12, color: colors.success },
  fileButton: { minHeight: 44, justifyContent: "center", paddingHorizontal: spacing.sm },
  actions: { gap: spacing.sm, marginTop: spacing.lg, paddingBottom: spacing.xl },
});
