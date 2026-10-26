/**
 * Agrivive Mobile Design System Tokens
 * Source: .agents/design/mobile-design/DESIGN.md
 */

export const colors = {
  primary: "#1F4D3A",
  primaryPressed: "#17392B",
  primaryLight: "rgba(31, 77, 58, 0.08)",
  primarySurface: "rgba(31, 77, 58, 0.04)",
  background: "#F8F6F1",
  surface: "#FFFFFF",
  surfaceMuted: "#F3EFE6",
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
    semiBold: "Inter_600SemiBold",
    bold: "Inter_700Bold",
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
    shadowColor: "#1F4D3A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  elevated: {
    shadowColor: "#1F4D3A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
} as const;
