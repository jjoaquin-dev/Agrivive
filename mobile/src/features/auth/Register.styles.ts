import { StyleSheet } from "react-native";
import { colors, fonts, radii, spacing, touchTargets } from "../../theme";

export const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.base,
    paddingBottom: spacing.xxl,
    justifyContent: "center",
  },
  navBar: {
    height: 48,
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
  },
  logoIcon: {
    width: 140,
    height: 41,
    marginBottom: spacing.base,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontFamily: fonts.heading.bold,
    fontSize: 28,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontFamily: fonts.body.regular,
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
  },
  errorBox: {
    backgroundColor: "rgba(184, 84, 80, 0.1)",
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: radii.card,
    padding: spacing.md,
    marginBottom: spacing.base,
  },
  errorBoxText: {
    color: colors.error,
    fontSize: 13,
    fontFamily: fonts.body.medium,
  },
  noticeBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radii.card,
    padding: spacing.md,
    marginBottom: spacing.base,
  },
  noticeBoxText: {
    color: colors.primary,
    fontSize: 13,
    fontFamily: fonts.body.medium,
    flex: 1,
  },
  form: {
    marginBottom: spacing.xl,
  },
  termsWrap: {
    marginTop: spacing.base,
  },
  verificationNoteWrap: {
    marginTop: spacing.sm,
    marginBottom: spacing.base,
    paddingLeft: spacing.xxl + spacing.sm,
  },
  verificationNoteText: {
    fontFamily: fonts.body.regular,
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
  submitButton: {
    marginTop: spacing.sm,
    borderRadius: radii.button,
    minHeight: touchTargets.min,
    backgroundColor: colors.primary,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.base,
  },
  footerPrompt: {
    fontSize: 14,
    color: colors.textMuted,
  },
  inlineButton: {
    minHeight: 36,
    paddingHorizontal: spacing.xs,
    paddingVertical: 0,
  },
  inlineButtonText: {
    fontSize: 14,
    fontFamily: fonts.body.semiBold,
    color: colors.primary,
  },
});
