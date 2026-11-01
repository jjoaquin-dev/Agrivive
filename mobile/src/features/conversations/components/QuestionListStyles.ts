import { StyleSheet } from "react-native";
import { colors, fonts, radii, spacing } from "../../../theme";

export const styles = StyleSheet.create({
  listContent: { padding: spacing.base, flexGrow: 1 },
  headerBox: { marginBottom: spacing.md },
  infoLine: {
    fontFamily: fonts.body.regular,
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  segmentedRow: {
    flexDirection: "row",
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.button,
    padding: 3,
    height: 44,
  },
  segmentBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.input,
  },
  segmentBtnActive: {
    backgroundColor: colors.surface,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  segmentText: {
    fontFamily: fonts.body.medium,
    fontSize: 13,
    color: colors.textMuted,
  },
  segmentTextActive: {
    fontFamily: fonts.heading.bold,
    color: colors.text,
  },
  centerBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxl,
  },
  emptyTitle: {
    fontFamily: fonts.heading.bold,
    fontSize: 16,
    color: colors.text,
    textAlign: "center",
    marginTop: spacing.md,
  },
  emptySub: {
    fontFamily: fonts.body.regular,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing.xs,
  },
  errorText: {
    fontFamily: fonts.body.medium,
    fontSize: 14,
    color: colors.error,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  retryBtn: {
    height: 44,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.button,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  retryBtnPressed: { backgroundColor: colors.surfaceMuted },
  retryBtnText: {
    fontFamily: fonts.heading.bold,
    fontSize: 14,
    color: colors.text,
  },
  loader: { paddingVertical: spacing.md },
});
