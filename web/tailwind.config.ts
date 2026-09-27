import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./src/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    fontSize: {
      xs: ["0.75rem", { lineHeight: "1rem" }],
      sm: ["0.8125rem", { lineHeight: "1.25rem" }],
      base: ["0.9375rem", { lineHeight: "1.5rem" }],
      lg: ["1.0625rem", { lineHeight: "1.75rem" }],
      xl: ["1.1875rem", { lineHeight: "1.75rem" }],
      "2xl": ["1.375rem", { lineHeight: "1.875rem" }],
      "3xl": ["1.75rem", { lineHeight: "2.25rem" }],
      "4xl": ["2.125rem", { lineHeight: "2.5rem" }],
      "5xl": ["2.75rem", { lineHeight: "1" }],
      "6xl": ["3.375rem", { lineHeight: "1" }],
      "7xl": ["4.25rem", { lineHeight: "1" }],
      "8xl": ["5.75rem", { lineHeight: "1" }],
      "9xl": ["7.5rem", { lineHeight: "1" }],
    },
    extend: {
      colors: {
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        destructive: "hsl(var(--destructive) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        agrivive: {
          primary: "#1F4D3A",
          primaryPressed: "#17392B",
          background: "#F8F6F1",
          surface: "#FFFFFF",
          text: "#202622",
          muted: "#6F776F",
          sage: "#A8BFA3",
          terracotta: "#C97850",
          border: "#E5E2DA",
          success: "#3F7D58",
          warning: "#C7953E",
          error: "#B85450",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        auth: "0 24px 70px rgba(31, 77, 58, 0.14)",
      },
    },
  },
  plugins: [],
};

export default config;
