import { StyleSheet } from "react-native";
import { colors, fonts, radii, spacing } from "../../../theme";

export const styles = StyleSheet.create({
  row: { backgroundColor: colors.surface, paddingTop: 14, paddingBottom: spacing.md, paddingHorizontal: spacing.base, borderBottomWidth: 1, borderBottomColor: colors.border },
  urgentBar: { position: "absolute", left: 0, top: 0, bottom: 0, width: 3, backgroundColor: colors.warning },
  topRow: { flexDirection: "row", alignItems: "flex-start", gap: spacing.md },
  gutter: { flexDirection: "row", alignItems: "center", gap: spacing.sm, paddingTop: 4 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  iconWrap: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  content: { flex: 1, minWidth: 0 },
  titleLine: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", gap: spacing.sm },
  title: { flex: 1, fontSize: 15, color: colors.text },
  time: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted },
  body: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, color: colors.textMuted, marginTop: 4 },
  pill: { alignSelf: "flex-start", marginTop: 10, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radii.full, backgroundColor: "#FFF7ED", borderWidth: 1, borderColor: "#FED7AA" },
  pillText: { fontFamily: fonts.body.semiBold, fontSize: 11, color: colors.warning },
  actions: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: spacing.md },
  primary: { minHeight: 44, paddingHorizontal: spacing.base, borderRadius: radii.button, borderWidth: 1, borderColor: colors.primary, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" },
  ghost: { minHeight: 44, paddingHorizontal: spacing.md, borderRadius: radii.button, alignItems: "center", justifyContent: "center" },
  actionText: { fontFamily: fonts.body.semiBold, fontSize: 13, color: colors.primary },
});
