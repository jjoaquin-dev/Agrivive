import { StyleSheet } from "react-native";
import { fonts, radii, spacing } from "../../../theme";

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FDFDFD" },
  header: { paddingHorizontal: spacing.base, paddingTop: spacing.xs, paddingBottom: spacing.sm },
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.md },
  iconButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#F6F5F1", alignItems: "center", justifyContent: "center", position: "relative" },
  iconButtonActive: { backgroundColor: "#DCFCE7" },
  filterDot: { position: "absolute", top: 8, right: 8, width: 7, height: 7, borderRadius: 3.5, backgroundColor: "#457D00" },
  titleColumn: { flex: 1, marginLeft: spacing.sm },
  title: { fontFamily: fonts.heading.bold, fontSize: 22, color: "#202622" },
  subtitle: { fontFamily: fonts.body.regular, fontSize: 13, color: "#636B63" },
  actionRow: { flexDirection: "row", gap: spacing.sm },
  filterScrollView: { marginHorizontal: -spacing.base },
  filterScrollContent: { paddingHorizontal: spacing.base, flexDirection: "row", gap: spacing.xs, alignItems: "center" },
  filterChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: radii.full, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#EEECE6" },
  filterChipActive: { backgroundColor: "#457D00", borderColor: "#457D00" },
  filterChipText: { fontFamily: fonts.body.medium, fontSize: 13, color: "#4B5563" },
  filterChipTextActive: { color: "#FFFFFF", fontFamily: fonts.body.semiBold },
  searchBar: { flexDirection: "row", alignItems: "center", gap: spacing.sm, backgroundColor: "#F6F5F1", borderWidth: 1, borderColor: "#EEECE6", borderRadius: 9999, paddingHorizontal: spacing.base, height: 44, marginTop: spacing.sm },
  searchInput: { flex: 1, fontFamily: fonts.body.regular, fontSize: 14, color: "#202622" },
  loader: { marginVertical: spacing.xl },
  empty: { alignItems: "center", paddingVertical: spacing.xxxl },
  emptyTitle: { fontFamily: fonts.heading.bold, fontSize: 16, color: "#202622", marginTop: spacing.md },
  muted: { fontFamily: fonts.body.regular, fontSize: 13, color: "#636B63", textAlign: "center", marginTop: spacing.xs, paddingHorizontal: spacing.xl },
});
