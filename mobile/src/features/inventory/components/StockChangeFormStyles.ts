import { StyleSheet } from "react-native";
import { colors, fonts, radii, spacing } from "../../../theme";

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
    paddingBottom: 140,
  },
  agingBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: "rgba(201, 120, 80, 0.12)",
    borderRadius: radii.input,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: "rgba(201, 120, 80, 0.3)",
  },
  agingBannerText: {
    flex: 1,
    fontFamily: fonts.body.regular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.text,
  },
  submitButton: {
    marginTop: spacing.md,
  },
});
