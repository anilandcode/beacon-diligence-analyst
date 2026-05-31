import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Document surfaces
        surface: {
          DEFAULT: "#FAFAF8",
          elevated: "#FFFFFF",
          sunken: "#F5F5F3",
        },
        // Charcoal structure
        structure: {
          DEFAULT: "#1A1A1A",
          secondary: "#4A4A4A",
          tertiary: "#737373",
          muted: "#A3A3A3",
        },
        // Status colors
        status: {
          covered: "#16A34A",
          partial: "#CA8A04",
          missing: "#DC2626",
          conflict: "#7C3AED",
          review: "#2563EB",
        },
        // Risk levels
        risk: {
          low: "#16A34A",
          medium: "#CA8A04",
          high: "#EA580C",
          critical: "#DC2626",
        },
        // Borders
        rule: {
          DEFAULT: "#E5E5E5",
          strong: "#D4D4D4",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "Times", "serif"],
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: ["Menlo", "Monaco", "Consolas", "Liberation Mono", "monospace"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
      },
      borderColor: {
        rule: "#E5E5E5",
        "rule-strong": "#D4D4D4",
      },
    },
  },
  plugins: [],
};
export default config;
