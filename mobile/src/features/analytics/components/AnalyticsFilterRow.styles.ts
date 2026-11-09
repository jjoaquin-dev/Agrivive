import { StyleSheet } from "react-native";
import { colors, fonts, radii, spacing } from "../../../theme";

export const filterRowStyles = StyleSheet.create({
  container: { backgroundColor: colors.surface, paddingHorizontal: spacing.base, paddingTop: spacing.sm, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border, gap: spacing.sm + 2 },
  segmented: { flexDirection: "row", height: 44, backgroundColor: "#F3F1EA", borderRadius: radii.input, padding: 3, gap: 4 },
  segment: { flex: 1, alignItems: "center", justifyContent: "center", borderRadius: 8 },
  segmentActive: { backgroundColor: colors.white, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 1 },
  segmentText: { fontFamily: fonts.body.medium, fontSize: 13, color: colors.textMuted },
  segmentTextActive: { fontFamily: fonts.heading.bold, color: colors.text },
  dateButton: { flexDirection: "row", alignItems: "center", gap: spacing.sm, minHeight: 48, paddingHorizontal: spacing.md, borderRadius: radii.input, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  dateText: { flex: 1, fontFamily: fonts.body.semiBold, fontSize: 15, color: colors.text },
  row: { gap: spacing.sm },
  unitRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 6 },
  unitChip: { minHeight: 36, paddingHorizontal: 12, justifyContent: "center", borderRadius: radii.full },
  unitChipActive: { backgroundColor: colors.primary },
  unitText: { fontFamily: fonts.body.medium, fontSize: 13, color: colors.textMuted },
  unitTextActive: { fontFamily: fonts.body.semiBold, color: colors.white },
  produceButton: { flexDirection: "row", alignItems: "center", gap: 4, minHeight: 44, alignSelf: "stretch", justifyContent: "space-between", paddingHorizontal: 12, borderRadius: radii.input, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  produceText: { flexShrink: 1, fontFamily: fonts.body.medium, fontSize: 13, color: colors.text },
});
