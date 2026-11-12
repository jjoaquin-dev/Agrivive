import { StyleSheet } from "react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import { surface } from "../../../theme/surface";

/** Each notification is its own white card. Ones that need the seller get a tint and a coloured edge so they are seen first. */
export const styles = StyleSheet.create({
  row: { backgroundColor: surface.card, borderWidth: 1, borderColor: surface.border, borderRadius: radii.card, marginHorizontal: spacing.base, marginBottom: spacing.sm, padding: spacing.base, overflow: "hidden", ...surface.shadow },
  rowImportant: { backgroundColor: "#F7FAF2", borderColor: "#DDEBCB" },
  rowUrgent: { backgroundColor: "#FFFAF3", borderColor: "#FBE3C3" },
  accent: { position: "absolute", left: 0, top: 0, bottom: 0, width: 4 },
  topRow: { flexDirection: "row", alignItems: "flex-start", gap: spacing.md },
  iconWrap: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  dot: { position: "absolute", top: 0, right: 0, width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary, borderWidth: 2, borderColor: surface.card },
  content: { flex: 1, minWidth: 0 },
  titleLine: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", gap: spacing.sm },
  title: { flex: 1, fontSize: 16, color: colors.text },
  time: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted },
  body: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, color: colors.textMuted, marginTop: 4 },
  pill: { alignSelf: "flex-start", marginTop: spacing.sm, paddingHorizontal: spacing.sm + 2, paddingVertical: 3, borderRadius: radii.full, backgroundColor: "#FFF1DE" },
  pillNew: { backgroundColor: "#E6F1D8" },
  pillText: { fontFamily: fonts.body.semiBold, fontSize: 12, color: colors.warning },
  pillTextNew: { color: colors.primaryPressed },
  actions: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: spacing.md },
  primary: { minHeight: 44, paddingHorizontal: spacing.lg, borderRadius: radii.button, borderWidth: 1, borderColor: surface.border, backgroundColor: surface.card, alignItems: "center", justifyContent: "center" },
  primaryStrong: { backgroundColor: colors.primary, borderColor: colors.primary },
  ghost: { minHeight: 44, paddingHorizontal: spacing.md, borderRadius: radii.button, alignItems: "center", justifyContent: "center" },
  actionText: { fontFamily: fonts.body.semiBold, fontSize: 14, color: colors.primary },
  actionTextStrong: { color: colors.white },
});
