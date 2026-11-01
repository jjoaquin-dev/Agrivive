/**
 * Agrivive Mobile Design System Tokens
 * Source: web/tailwind.config.ts (agrivive palette) and web/app/layout.tsx (Parkinsans headings, Plus Jakarta Sans body)
 */

export const colors = {
  primary: "#457D00",
  primaryPressed: "#386600",
  primaryLight: "rgba(69, 125, 0, 0.10)",
  primarySurface: "rgba(69, 125, 0, 0.05)",
  background: "#F8F6F1",
  surface: "#FFFFFF",
  surfaceMuted: "#F3F1EA",
  text: "#202622",
  textMuted: "#636B63",
  sage: "#96B125",
  olive: "#C6C736",
  cream: "#FCEC9A",
  terracotta: "#FEA938",
  border: "#E5E2DA",
  success: "#457D00",
  /** Darker than the web's orange (#FEA938) because this colour is also used for text, which needs contrast on white. */
  warning: "#D97706",
  error: "#B85450",
  white: "#FFFFFF",
  transparent: "transparent",
} as const;

export const fonts = {
  heading: {
    semiBold: "Parkinsans_600SemiBold",
    bold: "Parkinsans_700Bold",
  },
  body: {
    regular: "PlusJakartaSans_400Regular",
    medium: "PlusJakartaSans_500Medium",
    semiBold: "PlusJakartaSans_600SemiBold",
  },
} as const;

/**
 * One type scale for the whole app (DESIGN.md "Typography and Spacing").
 * Headings use Parkinsans and body text uses Plus Jakarta Sans, the same faces as the web.
 * Spread a role into a style: `{ ...typography.body, color: colors.text }`.
 */
export const typography = {
  largeTitle: { fontFamily: fonts.heading.bold, fontSize: 28, lineHeight: 34 },
  screenTitle: { fontFamily: fonts.heading.bold, fontSize: 22, lineHeight: 28 },
  sectionHeading: { fontFamily: fonts.heading.semiBold, fontSize: 17, lineHeight: 24 },
  bodyLarge: { fontFamily: fonts.body.regular, fontSize: 15, lineHeight: 22 },
  body: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20 },
  label: { fontFamily: fonts.body.medium, fontSize: 13, lineHeight: 18 },
  labelSmall: { fontFamily: fonts.body.medium, fontSize: 12, lineHeight: 18 },
  caption: { fontFamily: fonts.body.semiBold, fontSize: 11, lineHeight: 14 },
} as const;

/** The only font sizes allowed in styles. Anything else snaps to the nearest one. */
export const fontSizeScale = [10, 11, 12, 13, 14, 15, 16, 17, 18, 22, 28] as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
} as const;

export const radii = {
  sm: 6,
  input: 10,
  button: 14,
  card: 16,
  sheet: 20,
  full: 9999,
} as const;

export const touchTargets = {
  min: 48,
} as const;

export const shadows = {
  card: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  elevated: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
} as const;
