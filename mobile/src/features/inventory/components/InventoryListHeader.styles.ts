import { StyleSheet } from "react-native";
import { colors, fonts, radii, spacing, touchTargets, typography } from "../../../theme";

export const styles = StyleSheet.create({
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.md },
  title: { ...typography.screenTitle, color: colors.text },
  actions: { flexDirection: "row", alignItems: "center" },
  iconButton: { width: 44, height: 44, borderRadius: radii.full, alignItems: "center", justifyContent: "center" },
  searchBar: { flexDirection: "row", alignItems: "center", backgroundColor: colors.surface, borderRadius: radii.input, borderWidth: 1.5, borderColor: colors.border, paddingHorizontal: spacing.md, height: touchTargets.min, marginBottom: spacing.sm + 2 },
  searchInput: { flex: 1, ...typography.body, color: colors.text, marginLeft: spacing.sm },
  categoryButton: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: colors.surface, borderRadius: radii.input, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md, height: 44, marginBottom: spacing.md },
  categoryLabel: { ...typography.body, fontFamily: fonts.body.medium, color: colors.textMuted },
  categoryValue: { fontFamily: fonts.body.semiBold, color: colors.text },
  chipScroll: { marginHorizontal: -spacing.base, marginBottom: spacing.base },
  chipRow: { paddingHorizontal: spacing.base, gap: spacing.sm, alignItems: "center", paddingVertical: 2 },
  chip: { paddingHorizontal: spacing.md + 2, minHeight: 36, justifyContent: "center", borderRadius: radii.full },
  chipText: { ...typography.label },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.md, paddingHorizontal: 2 },
  summaryCount: { ...typography.body, fontFamily: fonts.body.semiBold, color: colors.text },
  summarySort: { ...typography.labelSmall, color: colors.textMuted },
});
