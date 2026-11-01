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
      transitionTimingFunction: {
        pop: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        settle: "cubic-bezier(0.215, 0.61, 0.355, 1)",
        glide: "cubic-bezier(0.455, 0.03, 0.515, 0.955)",
      },
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
          primary: "#457D00",
          primaryPressed: "#386600",
          background: "#F8F6F1",
          surface: "#FFFFFF",
          text: "#202622",
          muted: "#636B63",
          sage: "#96B125",
          olive: "#C6C736",
          terracotta: "#FEA938",
          cream: "#FCEC9A",
          border: "#E5E2DA",
          success: "#457D00",
          warning: "#FEA938",
          error: "#B85450",
        },
      },
      fontFamily: {
        brand: ["var(--font-parkinsans)", "var(--font-brand)", "Poppins", "sans-serif"],
        heading: ["var(--font-parkinsans)", "var(--font-jakarta)", "var(--font-heading)", "Poppins", "sans-serif"],
        subheading: ["var(--font-jakarta)", "var(--font-subheading)", "Lato", "sans-serif"],
        body: ["var(--font-jakarta)", "var(--font-body)", "Lato", "sans-serif"],
        sans: ["var(--font-jakarta)", "var(--font-body)", "Lato", "sans-serif"],
      },
      boxShadow: {
        auth: "0 24px 70px rgba(31, 77, 58, 0.14)",
      },
    },
  },
  plugins: [],
};

export default config;
