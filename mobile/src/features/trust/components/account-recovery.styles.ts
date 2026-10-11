import { StyleSheet } from "react-native";
import { colors, fonts, spacing } from "../../../theme";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
  },
  header: { alignItems: "center", marginBottom: spacing.xl },
  iconCircle: {
    alignItems: "center",
    backgroundColor: "rgba(31, 77, 58, 0.08)",
    borderRadius: 999,
    justifyContent: "center",
    marginBottom: spacing.base,
    padding: spacing.md,
  },
  title: {
    color: colors.text,
    fontFamily: fonts.heading.bold,
    fontSize: 28,
    marginBottom: spacing.xs,
    textAlign: "center",
  },
  subtitle: {
    color: colors.textMuted,
    fontFamily: fonts.body.regular,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
  form: { marginBottom: spacing.base },
  primaryButton: { marginTop: spacing.sm },
  secondaryButton: { marginTop: spacing.sm },
  backButton: { alignSelf: "center", marginTop: spacing.sm },
  backText: { color: colors.textMuted, fontSize: 14 },
  errorBox: {
    backgroundColor: "rgba(184, 84, 80, 0.1)",
    borderColor: colors.error,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: spacing.base,
    padding: spacing.md,
  },
  errorText: { color: colors.error, fontSize: 13, fontWeight: "500" },
  noticeBox: {
    backgroundColor: "rgba(63, 125, 88, 0.1)",
    borderColor: colors.success,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: spacing.base,
    padding: spacing.md,
  },
  noticeText: { color: colors.success, fontSize: 13, fontWeight: "500" },
});
