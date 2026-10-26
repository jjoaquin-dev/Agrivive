import { StyleSheet } from "react-native";
import { fonts, radii, spacing } from "../../../theme";

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
  header: { paddingHorizontal: spacing.base, paddingTop: spacing.xs, paddingBottom: spacing.sm, borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.md },
  iconButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#F3F4F6", alignItems: "center", justifyContent: "center", position: "relative" },
  iconButtonActive: { backgroundColor: "#DCFCE7" },
  filterDot: { position: "absolute", top: 8, right: 8, width: 7, height: 7, borderRadius: 3.5, backgroundColor: "#16A34A" },
  titleColumn: { flex: 1, marginLeft: spacing.sm },
  title: { fontFamily: fonts.heading.bold, fontSize: 24, color: "#111827" },
  subtitle: { fontFamily: fonts.body.regular, fontSize: 13, color: "#6B7280" },
  actionRow: { flexDirection: "row", gap: spacing.sm },
  filterScrollView: { marginHorizontal: -spacing.base },
  filterScrollContent: { paddingHorizontal: spacing.base, flexDirection: "row", gap: spacing.xs, alignItems: "center" },
  filterChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: radii.full, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E5E7EB" },
  filterChipActive: { backgroundColor: "#16A34A", borderColor: "#16A34A" },
  filterChipText: { fontFamily: fonts.body.medium, fontSize: 13, color: "#4B5563" },
  filterChipTextActive: { color: "#FFFFFF", fontFamily: fonts.body.semiBold },
  searchBar: { flexDirection: "row", alignItems: "center", gap: spacing.sm, backgroundColor: "#F9FAFB", borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 12, paddingHorizontal: spacing.md, height: 42, marginTop: spacing.sm },
  searchInput: { flex: 1, fontFamily: fonts.body.regular, fontSize: 14, color: "#111827" },
  loader: { marginVertical: spacing.xl },
  empty: { alignItems: "center", paddingVertical: spacing.xxxl },
  emptyTitle: { fontFamily: fonts.heading.bold, fontSize: 16, color: "#111827", marginTop: spacing.md },
  muted: { fontFamily: fonts.body.regular, fontSize: 13, color: "#6B7280", textAlign: "center", marginTop: spacing.xs, paddingHorizontal: spacing.xl },
});
