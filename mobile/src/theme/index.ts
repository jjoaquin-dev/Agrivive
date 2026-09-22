/**
 * Agrivive Mobile Design System Tokens
 * Source: .agents/design/mobile-design/DESIGN.md
 */

export const colors = {
  primary: "#1F4D3A",
  primaryPressed: "#17392B",
  background: "#F8F6F1",
  surface: "#FFFFFF",
  text: "#202622",
  textMuted: "#6F776F",
  sage: "#A8BFA3",
  terracotta: "#C97850",
  border: "#E5E2DA",
  success: "#3F7D58",
  warning: "#C7953E",
  error: "#B85450",
  white: "#FFFFFF",
  transparent: "transparent",
} as const;

export const fonts = {
  heading: {
    semiBold: "Manrope_600SemiBold",
    bold: "Manrope_700Bold",
  },
  body: {
    regular: "Inter_400Regular",
    medium: "Inter_500Medium",
    semiBold: "Inter_600SemiBold",
  },
} as const;

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
  button: 10,
  card: 12,
  sheet: 16,
  full: 9999,
} as const;

export const touchTargets = {
  min: 48,
} as const;
