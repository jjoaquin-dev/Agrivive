import { StyleSheet } from "react-native";
import { colors, fonts, radii, spacing, typography } from "../../../theme";

export const styles = StyleSheet.create({
  card: { paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  cardUrgent: { backgroundColor: "#FFFBF7" },
  // The blue dot sits in the left gutter, so unread rows are found by scanning down one edge.
  gutterDot: { position: "absolute", left: -12, top: 28, width: 8, height: 8, borderRadius: 4, backgroundColor: "#3B82F6" },
  topRow: { flexDirection: "row", alignItems: "flex-start" },
  iconWrap: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", marginRight: spacing.md },
  headerContent: { flex: 1 },
  titleLine: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { flex: 1, ...typography.bodyLarge, fontFamily: fonts.heading.semiBold, color: colors.text, marginRight: spacing.sm },
  titleUrgent: { color: "#C2410C" },
  timeWrap: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  timeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#D1D5DB" },
  timeText: { ...typography.labelSmall, color: colors.textMuted },
  subtitle: { ...typography.body, color: colors.textMuted, marginTop: 2 },
  actionsRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.sm, marginLeft: 44 + spacing.md },
  actionBtn: { minHeight: 40, paddingVertical: spacing.sm, paddingHorizontal: spacing.base, borderRadius: radii.full },
  actionBtnOrange: { borderColor: colors.terracotta },
  actionBtnText: { fontSize: 13 },
  actionBtnTextOrange: { color: colors.terracotta },
  actionBtnGrayText: { fontSize: 13, color: colors.text },
});
