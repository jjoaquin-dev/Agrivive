import { StyleSheet } from "react-native";
import { colors, fonts, radii, spacing } from "../../../theme";

export const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.base,
  },
  label: {
    fontFamily: fonts.body.semiBold,
    fontSize: 14,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  uploadBox: {
    height: 130,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: colors.border,
    borderRadius: radii.card - 4,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.base,
  },
  uploadBoxPressed: {
    borderColor: colors.primary,
  },
  uploadBoxError: {
    borderColor: colors.error,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  uploadPrompt: {
    fontFamily: fonts.body.semiBold,
    fontSize: 14,
    color: colors.text,
  },
  uploadSubtext: {
    fontFamily: fonts.body.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  previewContainer: {
    height: 180,
    borderRadius: radii.card,
    overflow: "hidden",
    position: "relative",
    borderWidth: 1,
    borderColor: colors.border,
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: colors.white,
    fontFamily: fonts.body.medium,
    fontSize: 13,
    marginTop: spacing.xs,
  },
  actionRow: {
    position: "absolute",
    bottom: spacing.sm,
    right: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  changeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radii.button,
  },
  changeButtonText: {
    color: colors.white,
    fontFamily: fonts.body.semiBold,
    fontSize: 12,
    marginLeft: 8,
  },
  removeButton: {
    width: 34,
    height: 34,
    borderRadius: 18,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  errorText: {
    fontFamily: fonts.body.regular,
    fontSize: 14,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
