import { StyleSheet } from "react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import { surface } from "../../../theme/surface";

export const sellerOrderReportStyles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.5)" },
  sheet: { maxHeight: "92%", backgroundColor: surface.card, borderTopLeftRadius: radii.sheet, borderTopRightRadius: radii.sheet, padding: spacing.base },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { fontFamily: fonts.heading.bold, fontSize: 22, lineHeight: 28, color: colors.text },
  text: { fontFamily: fonts.body.regular, fontSize: 15, lineHeight: 22, color: colors.textMuted, marginTop: spacing.xs },
  successRow: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm },
  label: { fontFamily: fonts.heading.semiBold, fontSize: 15, color: colors.text, marginTop: spacing.lg, marginBottom: spacing.sm },
  reasonRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  reason: { minHeight: 44, justifyContent: "center", borderWidth: 1, borderColor: surface.border, borderRadius: radii.full, paddingHorizontal: spacing.base, backgroundColor: surface.card },
  reasonSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  reasonText: { fontFamily: fonts.body.medium, fontSize: 14, color: colors.text },
  reasonTextSelected: { color: colors.white },
  input: { minHeight: 110, borderWidth: 1, borderColor: surface.border, borderRadius: radii.input, padding: spacing.md, fontFamily: fonts.body.regular, fontSize: 14, textAlignVertical: "top", color: colors.text },
  count: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted, textAlign: "right", marginTop: spacing.xs },
  error: { fontFamily: fonts.body.medium, fontSize: 13, color: colors.error, marginTop: spacing.sm },
  fileRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: surface.border },
  fileName: { flex: 1, fontFamily: fonts.body.regular, fontSize: 13, color: colors.text, marginRight: spacing.sm },
  fileStatus: { fontFamily: fonts.body.medium, fontSize: 12, color: colors.success },
  fileButton: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", backgroundColor: "#F6F5F1" },
  actions: { gap: spacing.sm, paddingBottom: spacing.xxl },
});
