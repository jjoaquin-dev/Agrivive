import { StyleSheet } from "react-native";
import { colors, fonts, radii, shadows, spacing } from "../../theme";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.xxl,
  },
  errorCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.orangeBorder,
    padding: spacing.md,
    marginBottom: spacing.base,
    ...shadows.card,
  },
  errorIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.orangeSurface,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  errorBody: {
    flex: 1,
  },
  errorTitle: {
    fontFamily: fonts.body.semiBold,
    fontSize: 14,
    color: colors.text,
  },
  errorSub: {
    fontFamily: fonts.body.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  retryButton: {
    paddingHorizontal: spacing.md,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: radii.button,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginLeft: spacing.xs,
  },
  retryButtonPressed: {
    backgroundColor: colors.surfaceMuted,
  },
  retryText: {
    fontFamily: fonts.body.semiBold,
    fontSize: 13,
    color: colors.text,
  },
});
