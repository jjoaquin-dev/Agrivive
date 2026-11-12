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
    backgroundColor: "rgba(184, 84, 80, 0.08)",
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
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  inputLabel: {
    color: colors.text,
    fontSize: 14,
    fontFamily: fonts.body.medium,
    marginBottom: spacing.xs,
  },
  inputRounded: {
    borderRadius: radii.input,
    borderColor: colors.border,
    borderWidth: 1.5,
    minHeight: touchTargets.min,
    backgroundColor: colors.surface,
  },
  forgotPasswordRow: {
    alignItems: "flex-end",
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  forgotText: {
    fontFamily: fonts.body.semiBold,
    fontSize: 13,
    color: colors.primary,
  },
  submitButton: {
    borderRadius: radii.button,
    minHeight: touchTargets.min,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 3,
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: fonts.body.semiBold,
    color: colors.white,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.xl,
  },
  footerPrompt: {
    fontSize: 14,
    color: colors.textMuted,
    fontFamily: fonts.body.regular,
  },
  signUpText: {
    fontSize: 14,
    color: colors.primary,
    fontFamily: fonts.body.semiBold,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    color: colors.textMuted,
    fontSize: 13,
    fontFamily: fonts.body.medium,
    paddingHorizontal: spacing.md,
  },
  emailOtpButton: {
    marginTop: spacing.md,
    borderRadius: radii.button,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
