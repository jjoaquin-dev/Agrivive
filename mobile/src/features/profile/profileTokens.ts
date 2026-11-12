import { colors } from "../../theme";
/** Colors the Profile screens share. Warm cream ground, white cards, crisp borders. */
export const profileColors = {
  cream: colors.background,
  border: colors.border,
  mint: colors.successSurfaceStrong,
  mintText: colors.primaryPressed,
  amber: colors.warningSurface,
  amberBorder: colors.star,
  amberText: colors.warningText,
  red: colors.error,
  redSoft: colors.errorSurface,
  slate: colors.textMuted,
} as const;
