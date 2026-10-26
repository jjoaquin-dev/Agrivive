import { StyleSheet } from "react-native";
import { colors, fonts, radii, spacing } from "../../../theme";

export const filterRowStyles = StyleSheet.create({
  container: {
    marginBottom: spacing.base,
    gap: spacing.sm,
  },
  periodRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  periodChip: {
    flex: 1,
    height: 42,
    borderRadius: radii.button,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.sm,
  },
  periodChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  periodChipText: {
    fontFamily: fonts.body.medium,
    fontSize: 13,
    color: colors.text,
  },
  periodChipTextSelected: {
    fontFamily: fonts.body.semiBold,
    color: colors.white,
  },
  secondaryFilterScroll: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingVertical: 2,
  },
  filterTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginRight: 2,
  },
  filterTagText: {
    fontFamily: fonts.body.medium,
    fontSize: 12,
    color: colors.textMuted,
  },
  unitChip: {
    height: 32,
    paddingHorizontal: 12,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  unitChipSelected: {
    backgroundColor: "rgba(15, 146, 15, 0.12)",
    borderColor: colors.primary,
  },
  unitChipText: {
    fontFamily: fonts.body.regular,
    fontSize: 12,
    color: colors.text,
  },
  unitChipTextSelected: {
    fontFamily: fonts.body.semiBold,
    color: colors.primary,
  },
  divider: {
    width: 1,
    height: 18,
    backgroundColor: colors.border,
    marginHorizontal: 4,
  },
  productChip: {
    height: 32,
    paddingHorizontal: 12,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  productChipSelected: {
    backgroundColor: "rgba(15, 146, 15, 0.12)",
    borderColor: colors.primary,
  },
  productChipText: {
    fontFamily: fonts.body.regular,
    fontSize: 12,
    color: colors.text,
  },
  productChipTextSelected: {
    fontFamily: fonts.body.semiBold,
    color: colors.primary,
  },
});
