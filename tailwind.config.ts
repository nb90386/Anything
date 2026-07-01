import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{ts,tsx}",
    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    {
      pattern: /^(bg|text|border|ring)-(tremor|risk)-.*/,
    },
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        // Malbek-inspired violet. This is an informed approximation, not a
        // verified match to official brand guidelines (malbek.io was not
        // reachable for direct color extraction); see docs/design/design-direction.md.
        brand: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
          950: "#2e1065",
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
        // Tremor color aliases so chart components share this app's brand/neutral palette
        // instead of Tremor's default blue/slate tokens.
        tremor: {
          brand: {
            faint: "#f5f3ff",
            muted: "#c4b5fd",
            subtle: "#a78bfa",
            DEFAULT: "#7c3aed",
            emphasis: "#6d28d9",
            inverted: "#ffffff",
          },
          background: {
            muted: "#f6f8fb",
            subtle: "#eef1f6",
            DEFAULT: "#ffffff",
            emphasis: "#3d4760",
          },
          border: {
            DEFAULT: "#dfe4ec",
          },
          ring: {
            DEFAULT: "#dfe4ec",
          },
          content: {
            subtle: "#9aa4b8",
            DEFAULT: "#525f77",
            emphasis: "#262e42",
            strong: "#0b0e17",
            inverted: "#ffffff",
          },
        },
        "dark-tremor": {
          brand: {
            faint: "#2e1065",
            muted: "#6d28d9",
            subtle: "#a78bfa",
            DEFAULT: "#a78bfa",
            emphasis: "#c4b5fd",
            inverted: "#2e1065",
          },
          background: {
            muted: "#0f1320",
            subtle: "#161b29",
            DEFAULT: "#0b0e17",
            emphasis: "#c6cddb",
          },
          border: {
            DEFAULT: "#262e42",
          },
          ring: {
            DEFAULT: "#262e42",
          },
          content: {
            subtle: "#707d94",
            DEFAULT: "#9aa4b8",
            emphasis: "#dfe4ec",
            strong: "#fbfcfe",
            inverted: "#0b0e17",
          },
        },
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(15 23 42 / 0.04), 0 1px 3px 0 rgb(15 23 42 / 0.06)",
        elevated: "0 4px 12px -2px rgb(15 23 42 / 0.08), 0 2px 4px -2px rgb(15 23 42 / 0.04)",
        popover: "0 12px 32px -8px rgb(15 23 42 / 0.18), 0 4px 8px -4px rgb(15 23 42 / 0.08)",
        "tremor-input": "0 1px 2px 0 rgb(15 23 42 / 0.05)",
        "tremor-card": "0 1px 3px 0 rgb(15 23 42 / 0.1), 0 1px 2px -1px rgb(15 23 42 / 0.1)",
        "tremor-dropdown": "0 4px 6px -1px rgb(15 23 42 / 0.1), 0 2px 4px -2px rgb(15 23 42 / 0.1)",
      },
      borderRadius: {
        xl2: "1.125rem",
        "tremor-small": "0.5rem",
        "tremor-default": "0.75rem",
        "tremor-full": "9999px",
      },
      fontSize: {
        "tremor-label": ["0.75rem", { lineHeight: "1rem" }],
        "tremor-default": ["0.875rem", { lineHeight: "1.25rem" }],
        "tremor-title": ["1.125rem", { lineHeight: "1.75rem" }],
        "tremor-metric": ["1.875rem", { lineHeight: "2.25rem" }],
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
        "border-beam": {
          "100%": { offsetDistance: "100%" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - var(--gap, 1rem)))" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.35s ease-out",
        shimmer: "shimmer 1.8s linear infinite",
        "border-beam": "border-beam calc(var(--duration, 8) * 1s) infinite linear",
        marquee: "marquee var(--duration, 30s) linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
