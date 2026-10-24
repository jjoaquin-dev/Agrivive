/**
 * Agrivive Mobile Design System Tokens
 * Source: .agents/design/mobile-design/DESIGN.md
 */

export const colors = {
  primary: "#0F920F",
  primaryPressed: "#0C770C",
  primaryLight: "rgba(15, 146, 15, 0.10)",
  primarySurface: "rgba(15, 146, 15, 0.05)",
  background: "#FFFFFF",
  surface: "#FFFFFF",
  surfaceMuted: "#F9FAFB",
  text: "#111827",
  textMuted: "#6B7280",
  sage: "#A8BFA3",
  terracotta: "#C97850",
  border: "#E5E7EB",
  success: "#16A34A",
  warning: "#D97706",
  error: "#DC2626",
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
