import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#dbe6fe",
          200: "#bed0fd",
          300: "#91b1fb",
          400: "#5e89f7",
          500: "#3a63f0",
          600: "#2745e4",
          700: "#2136c9",
          800: "#212fa2",
          900: "#212c80",
          950: "#161a4d",
        },
        ink: {
          25: "#fbfcfe",
          50: "#f6f8fb",
          100: "#eef1f6",
          200: "#dfe4ec",
          300: "#c6cddb",
          400: "#9aa4b8",
          500: "#707d94",
          600: "#525f77",
          700: "#3d4760",
          800: "#262e42",
          900: "#161b29",
          950: "#0b0e17",
        },
        risk: {
          low: "#16a34a",
          medium: "#d97706",
          high: "#dc2626",
          critical: "#991b1b",
        },
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(15 23 42 / 0.04), 0 1px 3px 0 rgb(15 23 42 / 0.06)",
        elevated: "0 4px 12px -2px rgb(15 23 42 / 0.08), 0 2px 4px -2px rgb(15 23 42 / 0.04)",
        popover: "0 12px 32px -8px rgb(15 23 42 / 0.18), 0 4px 8px -4px rgb(15 23 42 / 0.08)",
      },
      borderRadius: {
        xl2: "1.125rem",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.35s ease-out",
        shimmer: "shimmer 1.8s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
